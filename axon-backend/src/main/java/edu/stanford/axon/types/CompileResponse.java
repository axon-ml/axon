package edu.stanford.axon.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonDeserialize(as = ImmutableCompileResponse.class)
@JsonSerialize(as = ImmutableCompileResponse.class)
public interface CompileResponse {
    String status();
}
