package edu.stanford.axon.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

/**
 * Request to compile a specific class to a Tensorflow model.
 */
@Value.Immutable
@JsonSerialize(as = ImmutableCompileRequest.class)
@JsonDeserialize(as = ImmutableCompileRequest.class)
public interface CompileRequest {
    String projectName();
}
