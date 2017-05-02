/**
 * Perform code-generation.
 */
import * as types from "./types";

/**
 * Backend-agnostic code generation interface. All backends must support this interface.
 * Currently we are mainly planning on having Tensorflow support, if we have a good infrastructure then others may pop up.
 */
export interface CodegenBackend {
    // TODO(a10y): fill this in with some methods for code-gen.
}
