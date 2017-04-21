package edu.stanford.axon.resources;

import edu.stanford.axon.JedisWrapper;
import edu.stanford.axon.types.GetRequest;
import edu.stanford.axon.types.GetResponse;
import edu.stanford.axon.types.SetRequest;
import org.immutables.value.Value;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class KVStoreResource {

    private final JedisWrapper redis;

    public KVStoreResource(JedisWrapper redis) {
        this.redis = redis;
    }

    @Path("/version/set")
    @POST
    public String setVersion(SetRequest request) {
        return redis.withReconnect(r -> r.set(request.key(), request.value()));
    }

    @Path("/version/get")
    @POST
    public GetResponse getVersion(GetRequest request) {
        String response = redis.withReconnect(r -> r.get(request.key()));
        if (response == null) {
            return GetResponse.builder()
                    .key(request.key())
                    .value("nothing!!")
                    .build();
        }
        return GetResponse.builder()
                .key(request.key())
                .value(response)
                .build();
    }

}

