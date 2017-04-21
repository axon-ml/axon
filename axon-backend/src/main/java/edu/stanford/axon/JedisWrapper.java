package edu.stanford.axon;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

/**
 * JedisWrapper wraps a Jedis instance, and retries computations in the face of connection errors.
 *
 * NOTE: try and make your operations idempotent, since you can't safely reason about whether or not
 * they completed before the connection was lost.
 */
public final class JedisWrapper {
    private static final Logger LOGGER = LoggerFactory.getLogger(JedisWrapper.class);

    private AtomicReference<Jedis> redis;
    private String hostname;
    private int port;

    private static final int MAX_RETRIES = 3; // Attempt to reconnect 3 times.

    public JedisWrapper(String host, int port) {
        this.hostname = host;
        this.port = port;
        this.redis = new AtomicReference<>(new Jedis(host, port));
    }

   public <T> T withReconnect(Function<Jedis, T> f) {
        for (int tries = 1; tries <= MAX_RETRIES; tries++) {
            try {
                return f.apply(redis.get());
            } catch (JedisConnectionException ex) {
                LOGGER.info("Lost connection to redis, attempt {} of {}...", tries, MAX_RETRIES);
                synchronized (this) {
                    // Only allow one client to use this at a time.
                    redis.set(new Jedis(hostname, port));
                }
            }
        }
        throw new RuntimeException("Could not reconnect to Jedis!");
    }

}
