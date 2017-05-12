import * as assert from "assert";
import * as mocha from "mocha";

import {Service} from "../services/service";
import {Router} from "express";

describe("Service tests", () => {
    it("should return the same router after two calls", () => {

        class MyService extends Service {
            protected setupRoutes(): Router {
                return Router().get("/testing", () => {});
            }
        }

        const service = new MyService();
        const router1 = service.router();
        const router2 = service.router();

        assert(router1 === router2, "routers should be strictly equal");
    });
});
