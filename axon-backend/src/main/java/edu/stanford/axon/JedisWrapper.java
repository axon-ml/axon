package edu.stanford.axon;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.exceptions.JedisConnectionException;

import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

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

    // Check if the below instance has failed before performing the action.
    public Jedis get() {
        redis.compareAndSet(null, new Jedis(hostname, port));
        return redis.get();
    }

    public <T> T withReconnect(Function<Jedis, T> f) {
        for (int tries = 1; tries <= MAX_RETRIES; tries++) {
            try {
                return f.apply(redis.get());
            } catch (JedisConnectionException ex) {
                LOGGER.info("Lost connection to redis, attempt {} of {}...", tries, MAX_RETRIES);
                redis.set(new Jedis(hostname, port));
            }
        }
        throw new RuntimeException("Could not reconnect to Jedis!");
    }

}
