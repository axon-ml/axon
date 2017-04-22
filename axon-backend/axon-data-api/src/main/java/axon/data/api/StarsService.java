package axon.data.api;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/api/stars")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface StarsService {

    @Path("/count/{id}")
    @GET
    StarCount starCount(@PathParam("id") String modelId);

    @Path("/star/{id}")
    @POST
    StarResponse star(@PathParam("id") String modelId, @HeaderParam("Auth-Token") String token);

}
