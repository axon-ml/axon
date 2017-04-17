package edu.stanford.axon.resources.impl;

import edu.stanford.axon.resources.BackendResource;
import edu.stanford.axon.types.CompileRequest;
import edu.stanford.axon.types.CompileResponse;
import edu.stanford.axon.types.ImmutableCompileResponse;

public class BackendResourceImpl implements BackendResource {
    @Override
    public CompileResponse compileModule(CompileRequest request) {
        return ImmutableCompileResponse.builder().status("success!").build();
    }
}
