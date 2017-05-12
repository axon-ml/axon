import * as assert from "assert";
import * as mocha from "mocha";

import {IModel} from "../compiler/types";
import {ICodegenBackend, KerasBackend} from "../compiler/codegen";

const TEST_GRAPH: IModel = {
    connections: [{
        head: "Input1",
        tail: "Conv",
    }],
    layers: [{
        kind: "Input",
        name: "Input1",
        params: {
            dimensions: [1024, 1024],
        },
    }, {
        kind: "FullyConnected",
        name: "myconnection",
        params: {
            activation: "tanh",
            output_units: 4,
        },
    }],
};


describe("Compiler Backends", () => {
    it("should print the header", () => {
        const backend: ICodegenBackend = new KerasBackend();

        // Return the output of the thing.
        const sourceCode = backend.generate(TEST_GRAPH);

        console.log(sourceCode);
    });
});
