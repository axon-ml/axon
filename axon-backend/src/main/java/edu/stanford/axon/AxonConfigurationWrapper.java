package edu.stanford.axon;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.dropwizard.Configuration;
import org.immutables.value.Value;

import java.util.Optional;

public class AxonConfigurationWrapper extends Configuration {
    @JsonUnwrapped
    public AxonConfig config;
}

@Value.Immutable
@JsonSerialize(as = ImmutableAxonConfig.class)
@JsonDeserialize(as = ImmutableAxonConfig.class)
interface AxonConfig {
    String name();
    Optional<RedisConfiguration> redis();
}
