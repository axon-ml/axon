import {IModel,
        ILayer,
        TypeAssertions,
        IInputParams,
        IFullyConnectedParams,
        IDropoutParams,
        IConv2DParams,
        IPool2DParams,
        IZeroPadParams} from "./types";
import {mapWithIndex} from "../utils";

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
    private genLayers(model: IModel, input_shape: number[]): string[] {
        return mapWithIndex(model.layers, (i, layer) => {
            if (i === 0) {
                return this.genLayer(layer, input_shape);
            } else {
                return this.genLayer(layer);
            }
        });
    }

    // Generate Keras code for a layer definition.
    private genLayer(layer: ILayer, input?: number[]): string {
        const params = layer.params;
        const name = layer.name;

        // Extra params that we need to place at the end of the layer constructor.
        // TODO: This code makes me feel cold and empty on the inside :'(
        const extraParams = input === undefined ? "" : `input_shape=(${input.join(", ")},)`;

        switch (layer.kind) {
            case "Input":
                if (!TypeAssertions.isInputParams(params)) {
                    throw errorLayerParams(name, "IInputParams");
                }
                // Generate code for an input layer
                return this.genInputLayer(name, params as IInputParams, extraParams);

            case "FullyConnected":
                if (!TypeAssertions.isFullyConnectedParams(params)) {
                    throw errorLayerParams(name, "IFullyConnectedParams");
                }
                return this.genFullyConnectedLayer(name, params as IFullyConnectedParams, extraParams);

            case "Dropout":
                if (!TypeAssertions.isDropoutParams(params)) {
                    throw errorLayerParams(name, "IDropoutParams");
                }
                return this.genDropoutLayer(name, params as IDropoutParams, extraParams);

            case "Conv2D":
                if (!TypeAssertions.isConv2DParams(params)) {
                    throw errorLayerParams(name, "IConv2DParams");
                }
                return this.genConv2DLayer(name, params as IConv2DParams, extraParams);

            case "Pool2D":
                if (!TypeAssertions.isPool2DParams(params)) {
                    throw errorLayerParams(name, "IPool2DParams");
                }
                return this.genPool2DLayer(name, params as IPool2DParams, extraParams);

            case "ZeroPad":
                if (!TypeAssertions.isZeroPadParams(params)) {
                    throw errorLayerParams(name, "IZeroPadParams");
                }
                return this.genZeroPadLayer(name, params as IZeroPadParams, extraParams);

            case "Flatten":
                return this.genFlattenLayer(name, extraParams);

            default:
                throw `Invalid layer type: "${layer.kind}" for layer "${layer.name}"`;
        }
    }

    // Generate keras code for an input layer with the specified name.
    private genInputLayer(name: string, params: IInputParams, extraParams: string): string {
        return `${name} = Input(shape=(${params.dimensions[0]},), dtype='float32'${extraParams ? ", " + extraParams : ""})`;
    }

    private genFullyConnectedLayer(name: string, params: IFullyConnectedParams, extraParams: string): string {
        return `${name} = Dense(${params.output_units}, activation='${params.activation}'${extraParams ? ", " + extraParams : ""})`;
    }

    private genDropoutLayer(name: string, params: IDropoutParams, extraParams: string): string {
        return `${name} = Dropout(${params.probability}${extraParams ? ", " + extraParams : ""})`;
    }

    private genConv2DLayer(name: string, params: IConv2DParams, extraParams: string): string {
        const padding = params.padding || "valid";
        let activation = undefined;
        if (params.activation) {
            activation = `"${params.activation}"`;
        } else {
            activation = "None";
        }

        let stride = undefined;
        if (params.stride === undefined) {
            stride = "(1, 1)";
        } else if (typeof params.stride === "number") {
            stride = params.stride;
        } else {
            stride = `(${params.stride.join(", ")},)`;
        }

        let kernel_size = undefined;
        if (typeof params.kernel_size === "number") {
            kernel_size = params.kernel_size;
        } else {
            kernel_size = `(${params.kernel_size.join(", ")},)`;
        }

        const filters = Math.floor(params.filters);
        return `${name} = Conv2D(${filters}, ${kernel_size}, padding="${padding}", activation=${activation}${extraParams ? ", " + extraParams : ""})`;
    }

    private genPool2DLayer(name: string, params: IPool2DParams, extraParams: string): string {
        let stride = undefined;
        if (typeof params.stride === "number") {
            stride = params.stride;
        } else if (typeof params.stride === "object") {
            stride = `(${params.stride.join(", ")},)`;
        } else {
            stride = "None";
        }
        return `${name} = MaxPooling2D(pool_size=(${params.pool_size.join(", ")},), strides=${stride}${extraParams ? ", " + extraParams : ""})`;
    }

    private genZeroPadLayer(name: string, params: IZeroPadParams, extraParams: string): string {
        const top = Math.floor(params.top || 0);
        const bottom = Math.floor(params.bottom || 0);
        const left = Math.floor(params.left || 0);
        const right = Math.floor(params.right || 0);
        return `${name} = ZeroPadding2D(padding=((${top}, ${bottom}), (${left}, ${right}))${extraParams ? ", " + extraParams : ""})`;
    }

    private genFlattenLayer(name: string, extraParams: string): string {
        return `${name} = Flatten(${extraParams})`;
    }

    // Generate the model given the definition of the layers.
    private genModel(model: IModel): string {
        const layers = model.layers;
        let loss_func = undefined;
        if (model.loss === "mse") {
            loss_func = `"mean_squared_error"`;
        } else if (model.loss === "xent") {
            loss_func = `"categorical_crossentropy"`;
        } else {
            loss_func = "None";
        }
        const optimizer = model.optimizer || "adam";

        let code = `model = Sequential()`;
        layers.forEach(l => {
            code += `
model.add(${l.name})`;
        });

        // Add optimizer
        code += `
# Train model with ${loss_func} loss, ${optimizer} optimizer.
model.compile(loss=${loss_func}, optimizer="${optimizer}")`;

        return code;
    }

    // Normalize all the names into something Python-friendly.
    private normalizeNames(model: IModel): IModel {
        model.layers.forEach(l => {
            l.name = l.name.toLowerCase().split(" ").join("_");
        });
        return model;
    }

    generate(input: IModel): string {

        // Go through and normalize all the names of each layer.
        const normalized = this.normalizeNames(input);

        const header = this.genHeader();
        const layers = this.genLayers(normalized, input.input).join("\n");
        const model = this.genModel(normalized);
        return `
# Imports
${header}

# Layer definitions.
${layers}

# Model creation.
${model}
`;
    }

}

// TODO:
// (1) Ensure that the graph is a singly connected component that is rooted at an Input node
// (2) Input node cannot have any incoming connections
// (3) All names for layers must be unique
// (4) Make sure final layer has valid output (i.e. softmax activation, or something like that)
// (5) All references in the connections section of IModel refer to valid layer names
