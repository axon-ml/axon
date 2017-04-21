package edu.stanford.axon.resources;

import edu.stanford.axon.JedisWrapper;
import edu.stanford.axon.types.GetRequest;
import edu.stanford.axon.types.GetResponse;
import edu.stanford.axon.types.SetRequest;
import edu.stanford.axon.types.SetResponse;
import redis.clients.jedis.Jedis;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.function.Function;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class KVStoreResource {

    private final JedisWrapper redis;

    public KVStoreResource(JedisWrapper redis) {
        this.redis = redis;
    }

    @Path("/kv/set")
    @POST
    public SetResponse setVersion(SetRequest request) {
        return redis.executeWithRetries(r -> {
            String status = r.set(request.key(), request.value());
            return SetResponse.builder()
                    .status(status)
                    .build();
        });
    }

    @Path("/kv/get")
    @POST
    public GetResponse getVersion(GetRequest request) {
        String response = redis.executeWithRetries(r -> r.get(request.key()));
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

