package edu.stanford.axon.resources;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import edu.stanford.axon.JedisWrapper;
import org.immutables.value.Value;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BackendResource {

    private final JedisWrapper redis;

    public BackendResource(JedisWrapper redis) {
        this.redis = redis;
    }

    @Path("/version/set")
    @POST
    public String setVersion(SetVersionRequest request) {
        return redis.withReconnect(r -> r.set(request.key(), request.value()));
    }

    @Path("/version/get")
    @POST
    public GetVersionResponse getVersion(GetVersionRequest request) {
        String response = redis.withReconnect(r -> r.get(request.key()));
        if (response == null) {
            return ImmutableGetVersionResponse.builder()
                    .key(request.key())
                    .value("nothing!!")
                    .build();
        }
        return ImmutableGetVersionResponse.builder()
                .key(request.key())
                .value(response)
                .build();
    }

}

@Value.Immutable
@JsonSerialize(as = ImmutableSetVersionRequest.class)
@JsonDeserialize(as = ImmutableSetVersionRequest.class)
interface SetVersionRequest {
    String key();
    String value();
}

@Value.Immutable
@JsonSerialize(as = ImmutableGetVersionRequest.class)
@JsonDeserialize(as = ImmutableGetVersionRequest.class)
interface GetVersionRequest {
    String key();
}

@Value.Immutable
@JsonSerialize(as = ImmutableGetVersionResponse.class)
@JsonDeserialize(as = ImmutableGetVersionResponse.class)
interface GetVersionResponse {
    String key();
    String value();
}

