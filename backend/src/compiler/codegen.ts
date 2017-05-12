import {IModel, ILayer, TypeAssertions, IInputParams, IFullyConnectedParams, IDropoutParams, IConv2DParams, IPool2DParams} from "./types";

/**
 * Backend-agnostic code generation interface. All backends must support this interface.
 * Currently we are mainly planning on having Keras support, if we have a good infrastructure then others may pop up.
 */
export interface ICodegenBackend {
    /**
     * Convert the AST stored in an IModel into the source code.
     */
    generate(input: IModel): string;
}

//
// Implementation of different compiler backends.
//

function errorLayerParams(layerName: string, expectedType: string): string {
    return `Params for layer "${layerName}" are not a valid ${expectedType} as expected.`;
}

export class KerasBackend implements ICodegenBackend {
    private genHeader(): string {
        return `
from keras.layers import *
from keras.models import *
`;
    }

    // Generate code for all layers as separate Keras variables using the Layers functional API.
    private genLayers(model: IModel): string[] {
        return model.layers.map((layer) => (this.genLayer(layer)));
    }

    // Generate Keras code for a layer definition.
    private genLayer(layer: ILayer): string {
        const params = layer.params;
        const name = layer.name;
        switch (layer.kind) {
            case "Input":
                if (!TypeAssertions.isInputParams(params)) {
                    throw errorLayerParams(name, "IInputParams");
                }
                // Generate code for an input layer
                return this.genInputLayer(name, params as IInputParams);

            case "FullyConnected":
                if (!TypeAssertions.isFullyConnectedParams(params)) {
                    throw errorLayerParams(name, "IFullyConnectedParams");
                }
                return this.genFullyConnectedLayer(name, params as IFullyConnectedParams);

            case "Dropout":
                if (!TypeAssertions.isDropoutParams(params)) {
                    throw errorLayerParams(name, "IDropoutParams");
                }
                return this.genDropoutLayer(name, params as IDropoutParams);

            case "Conv2D":
                if (!TypeAssertions.isConv2DParams(params)) {
                    throw errorLayerParams(name, "IConv2DParams");
                }
                return this.genConv2DLayer(name, params as IConv2DParams);

            case "Pool2D":
                if (!TypeAssertions.isPool2DParams(params)) {
                    throw errorLayerParams(name, "IPool2DParams");
                }
                return this.genPool2DLayer(name, params as IPool2DParams);

            default:
                throw `Invalid layer type: "${layer.kind}" for layer "${layer.name}"`;
        }
    }

    // Generate keras code for an input layer with the specified name.
    private genInputLayer(name: string, params: IInputParams): string {
        return `${name} = Input(shape=(${params.dimensions[0]},), dtype='float32')`;
    }

    private genFullyConnectedLayer(name: string, params: IFullyConnectedParams): string {
        return `${name} = Dense(${params.output_units}, activation='${params.activation}')`;
    }

    private genDropoutLayer(name: string, params: IDropoutParams): string {
        return `${name} = Dropout(${params.probability})`;
    }

    private genConv2DLayer(name: string, params: IConv2DParams): string {
        // TODO: fill this in!
        return `${name} = None`;
    }

    private genPool2DLayer(name: string, params: IPool2DParams): string {
        // TODO: fill this in!
        return `${name} = None`;
    }

    // Generate the model given the definition of the layers.
    private genModel(): string {
        // TODO: Piece together the model based on the IModel.connections list of connections.
        return "";
    }

    // Normalize all the names into something Python-friendly.
    private normalizeNames(model: IModel): IModel {
        const names = model.layers.map(l => l.name);
        const fixed = names.map(n => n.toLowerCase().split(" ").join("_"));

        // Map to the model.

        return model;
    }

    generate(input: IModel): string {

        // Go through and normalize all the names of each layer.
        const normalized = this.normalizeNames(input);

        const header = this.genHeader();
        const layers = this.genLayers(normalized).join("\n");
        const model = this.genModel();
        return `
# Imports
${header}

# Layer definitions.
${layers}

# Model creation.
${model}

# Insert some code for training here
`;
    }

}

// TODO:
// (1) Ensure that the graph is a singly connected component that is rooted at an Input node
// (2) Input node cannot have any incoming connections
// (3) All names for layers must be unique
// (4) Make sure final layer has valid output (i.e. softmax activation, or something like that)
// (5) All references in the connections section of IModel refer to valid layer names
