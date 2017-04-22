package axon.data;

import axon.AxonImmutable;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import io.dropwizard.Configuration;
import org.immutables.value.Value;

public class AxonDataConfigurationWrapper extends Configuration {
    @JsonUnwrapped
    public AxonDataConfig config;
}
