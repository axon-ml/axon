package axon.data;

import axon.AxonImmutable;
import axon.config.RedisConfig;
import org.immutables.value.Value;

import java.util.Optional;

@Value.Immutable
@AxonImmutable
public interface IAxonDataConfig {
    Optional<RedisConfig> redis();
}
