package axon;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

/**
 * axon.JedisWrapper wraps a Jedis instance, and retries computations in the face of connection errors.
 *
 * NOTE: try and make your operations idempotent, since you can't safely reason about whether or not
 * they completed before the connection was lost.
 */
public final class JedisWrapper {
    private AtomicReference<Jedis> redis;
    private String hostname;
    private int port;

    private static final int MAX_RETRIES = 3; // Attempt to reconnect 3 times.

    public JedisWrapper(String host, int port) {
        this.hostname = host;
        this.port = port;
        this.redis = new AtomicReference<>(new Jedis(host, port));
    }

    /**
     * Perform the given function using the wrapped Jedis instance, performing retries in the case
     * of a connection failure.
     */
    public <T> T executeWithRetries(Function<Jedis, T> f) {
        for (int tries = 1; tries <= MAX_RETRIES; tries++) {
            try {
                return f.apply(redis.get());
            } catch (JedisConnectionException ex) {
                synchronized (this) {
                    // Only allow one thread to overwrite at a time.
                    // Note that when we are using Dropwizard, requests are handled concurrently by multiple threads,
                    // so we need to consider concurrency in our data structures, like this one.
                    redis.set(new Jedis(hostname, port));
                }
            }
        }

        throw new RuntimeException("Could not reconnect to Jedis!");
    }
}