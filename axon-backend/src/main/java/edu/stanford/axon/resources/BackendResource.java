package edu.stanford.axon.resources;

import edu.stanford.axon.types.CompileRequest;
import edu.stanford.axon.types.CompileResponse;
import edu.stanford.axon.types.ImmutableCompileResponse;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BackendResource {

    /**
     * Request to compile a model
     */
    @Path("/compile")
    @POST
    public CompileResponse compileModel(CompileRequest request) {
        return ImmutableCompileResponse.builder()
                .status("success")
                .build();
    }

}
