/**
 * Typed representations for the different layers we allow the user to generate.
 * Here we include type specifications for the JSON we receive over the wire, as well as the
 * parameters for each individual node type.
 */


/**
 * Top-level schema description for a model.
 */
export interface IModel {
    layers: ILayer[];
    connections: IConnection[];
}

/**
 * Serialized object format for a layer.
 */
export interface ILayer {
    name: string;
    kind: LayerKind;
    params?: object;
}

/**
 * Representation of a connection between two INode's.
 */
export interface IConnection {
    head: string;
    tail: string;
}

/**
 * TypeAssertions is a group of methods for performing assertions on the "params" for each layer type to make sure they
 * have all required properties. Currently it does NOT check the types on each of the members of the params.
 */
export class TypeAssertions {
    static isInputParams(params: any): boolean {
        return (typeof params === "object") && params.hasOwnProperty("dimensions");
    }

    static isFullyConnectedParams(params: any): boolean {
        return (typeof params === "object") && params.hasOwnProperty("activation")
                                            && (typeof params.activation === "string")
                                            && params.hasOwnProperty("output_units")
                                            && (typeof params.output_units === "number");
    }

    static isConv2DParams(params: any): boolean {
        return (typeof params === "object") && params.hasOwnProperty("activation")
                                            && (typeof params.activation === "string")
                                            && params.hasOwnProperty("filters")
                                            && (typeof params.filters === "number")
                                            && params.hasOwnProperty("kernel_size")
                                            && (typeof params.kernel_size === "object")
                                            && params.hasOwnProperty("padding")
                                            && (typeof params.padding === "string");
    }

    static isPool2DParams(params: any): boolean {
        return (typeof params === "object") && params.hasOwnProperty("pool_size")
                                            && (typeof params.pool_size === "object")
                                            && params.hasOwnProperty("stride")
                                            && (typeof params.stride === "number");
    }

    static isDropoutParams(params: any): boolean {
        return (typeof params === "object") && params.hasOwnProperty("probability")
                                            && (typeof params.probability === "number");
    }

    static isSoftmaxParams(params: any): boolean {
        return (typeof params === "object") && params.hasOwnProperty("classes")
                                            && (typeof params.classes === "number");
    }
}

/**
 * Built-in layer types. All layers are a composition of thse 6 built-in types.
 */
export type LayerKind  = "Input" | "FullyConnected" | "Conv2D" | "Pool2D" | "Dropout" | "Softmax";

/**
 * Possible types of activation functions.
 */
export type Activation = "sigmoid" | "tanh" | "relu";

/**
 * Possible types of padding for Conv2D layers.
 */
export type Padding = "same" | "valid";

export interface IInputParams {
    dimensions: [number];
}

export interface IFullyConnectedParams {
    activation: Activation;
    output_units: number;
}

export interface IConv2DParams {
    activation: Activation;
    filters: number;
    kernel_size: [number];
    padding: Padding;
}

export interface IPool2DParams {
    pool_size: [number];
    stride: number;
}

export interface IDropoutParams {
    probability: number;
}

export interface ISoftmaxParams {
    classes: number;
}
