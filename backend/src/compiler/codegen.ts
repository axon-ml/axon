/**
 * Perform code-generation.
 */
import {IModel} from "./types";

/**
 * Backend-agnostic code generation interface. All backends must support this interface.
 * Currently we are mainly planning on having Tensorflow support, if we have a good infrastructure then others may pop up.
 */
export interface ICodegenBackend {
    // Any codegen backend fundamentally just needs to convert the AST representation
    // into a string.
    generate(input: IModel): string;
}

//
// Implementation of different compiler backends.
//

export class KerasBackend implements ICodegenBackend {
    genHeader(): string {
        return `
import tensorflow as tf
sess = tf.Session()

from keras import backend as K
K.set_session(sess)
`;
    }
    generate(input: IModel): string {
        const header = this.genHeader();
        return `
${header}
`;
    }
}

// TODO:
// (1) Ensure that the graph is a singly connected component that is rooted at an Input node
// (2) Input node cannot have any incoming connections

const be = new KerasBackend();
const output = be.generate({
    connections: [],
    layers: [{
        kind: "Input",
        name: "Input1",
        params: {
            dimensions: [1024, 1024],
        },
    }, {
        kind: "Conv2D",
        name: "Conv",
        params: {

        },
    }],
});

console.log(output);
