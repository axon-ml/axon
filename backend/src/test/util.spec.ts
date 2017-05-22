import {foldLeft} from "../utils";

import * as assert from "assert";

describe("foldLeft", () => {
    it("should work", () => {
        assert(10 === foldLeft([1, 2, 3, 4], 0, (b, a) => a + b), "Should just work");
    });
});
