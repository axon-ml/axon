package edu.stanford.axon.types;

import org.immutables.value.Value;

/**
 * Types for the VersionResource.
 */
@ImmutableStyle
public class KVStoreTypes {
    @Value.Immutable
    interface AbstractSetRequest {
        String key();

        String value();
    }

    @Value.Immutable
    interface AbstractGetRequest {
        String key();
    }

    @Value.Immutable
    interface AbstractGetResponse {
        String key();

        String value();
    }
}