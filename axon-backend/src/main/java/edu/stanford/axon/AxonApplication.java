package edu.stanford.axon;

import edu.stanford.axon.resources.BackendResource;
import edu.stanford.axon.resources.impl.BackendResourceImpl;
import io.dropwizard.Application;
import io.dropwizard.setup.Environment;

public class AxonApplication extends Application<AxonConfiguration> {

    public static void main(String[] args) throws Exception {
        new AxonApplication().run(args);
    }

    @Override
    public void run(AxonConfiguration configuration, Environment environment) throws Exception {
        environment.jersey().register(new BackendResourceImpl());
    }
}
