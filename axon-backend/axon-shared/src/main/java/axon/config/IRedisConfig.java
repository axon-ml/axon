package axon.config;

import axon.AxonImmutable;
import org.immutables.value.Value;

@Value.Immutable
@AxonImmutable
public interface IRedisConfig {
    String hostname();
    int port();
}
