package axon;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@JsonSerialize
@JsonDeserialize
@Value.Style(typeAbstract = "I*", typeImmutable = "*")
public @interface AxonImmutable {}
