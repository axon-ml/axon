package axon.data.api;

import axon.AxonImmutable;
import org.immutables.value.Value;

@Value.Immutable
@AxonImmutable
public interface IStarCount {
    String modelId();
    long count();
}
