package axon.data;

import axon.JedisWrapper;
import axon.config.RedisConfig;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

public class AxonDataApplication extends Application<AxonDataConfigurationWrapper> {

    public static void main(String[] args) throws Exception {
        new AxonDataApplication().run(args);
    }

    @Override
    public void run(AxonDataConfigurationWrapper configuration, Environment environment) throws Exception {
        /*
         * Setup StarsResource to be able to connect to Redis for caching.
         */
        JedisWrapper redis = setupRedis(configuration.config);

        environment.jersey().register(new StarsResource(redis));
    }

    private JedisWrapper setupRedis(AxonDataConfig config) {
        RedisConfig DEFAULT_CONFIG = RedisConfig.builder()
                .hostname("localhost")
                .port(6379)
                .build();
        RedisConfig redisConfig = config.redis().orElse(DEFAULT_CONFIG);
        return new JedisWrapper(redisConfig.hostname(), redisConfig.port());
    }
}
