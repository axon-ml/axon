package edu.stanford.axon;

import org.immutables.value.Value;

@Value.Immutable
public interface StorageConfiguration {
    String hostname();
    int port();
}
