package edu.stanford.axon;

import edu.stanford.axon.resources.KVStoreResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

public class AxonApplication extends Application<AxonConfigurationWrapper> {

    public static void main(String[] args) throws Exception {
        new AxonApplication().run(args);
    }

    @Override
    public void run(AxonConfigurationWrapper configuration, Environment environment) throws Exception {
        // Setup Redis connection
        RedisConfiguration DEFAULT_REDIS_CONFIG = ImmutableRedisConfiguration.builder()
                .hostname("localhost")
                .port(6379)
                .build();

        RedisConfiguration redisConfiguration = configuration.config.redis().orElse(DEFAULT_REDIS_CONFIG);
        JedisWrapper redis = new JedisWrapper(redisConfiguration.hostname(), redisConfiguration.port());

        // Create the storage system.
        environment.jersey().register(new KVStoreResource(redis)); /* Register backend service resource */
    }
}
