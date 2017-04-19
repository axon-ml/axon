package edu.stanford.axon;

import edu.stanford.axon.resources.BackendResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;
import redis.clients.jedis.Jedis;

public class AxonApplication extends Application<AxonConfigurationWrapper> {

    public static void main(String[] args) throws Exception {
        new AxonApplication().run(args);
    }

    @Override
    public void run(AxonConfigurationWrapper configuration, Environment environment) throws Exception {
        System.out.println("Running " + configuration.config.name());

        // Backend resource

        // Inject some things, like the storage system.
        configuration.config.storage().ifPresent(config -> {
            Jedis jedis = new Jedis(config.hostname(), config.port());
        });

        // Create the storage system.

        environment.jersey().register(new BackendResource()); /* Register backend service resource */
    }
}
