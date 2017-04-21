package edu.stanford.axon;

import org.immutables.value.Value;

@Value.Immutable
public interface RedisConfiguration {
    String hostname();
    int port();
}
