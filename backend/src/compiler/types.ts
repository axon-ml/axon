
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

export interface InputParams {
    dimensions: [number];
}

export interface FullyConnectedParams {
    activation: Activation;
    output_units: number;
}

export interface Conv2DParams {
    filters: number;
    kernel_size: [number];
    padding: Padding;
    activation: Activation;
}

export interface Pool2DParams {
    pool_size: [number];
    strides: number;
}

/**
 * Node in a raw graph that needs to be compiled.
 */
export interface INode {
    name: string;
    kind: LayerKind;
    params?: object;
}

/**
 * An IGraph is the JSON interface we expect to receive over the wire in a request to compile.
 * Nodes are a collection of INode JSON objects, and edges is a list of
 */
export interface IGraph {
    nodes: INode[];
    edges: {[key: string]: string};
}
