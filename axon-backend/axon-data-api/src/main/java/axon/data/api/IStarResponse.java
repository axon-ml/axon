package axon.data.api;

import axon.AxonImmutable;
import org.immutables.value.Value;

/**
 * Type of a response for a user that stars a status.
 */
@Value.Immutable
@AxonImmutable
public interface IStarResponse {
    boolean success();
}
