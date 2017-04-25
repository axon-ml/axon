import {Router} from "express";
import {contentType} from "../middleware";
import {IService} from "./service";

/**
 * DataService is a facade in front of the database. We'll want to add routes for things like
 * accessing the number of stars for a particular user, etc.
 */
export class DataService implements IService {

    private serviceRouter: Router;

    constructor() {
        this.serviceRouter = Router();
        this.setupRoutes();
    }

    public router(): Router {
        return this.serviceRouter;
    }

    private setupRoutes() {
        // Filter JSON content only for these routes
        this.serviceRouter.use(contentType("application/json"));
        this.serviceRouter.get("/hello", (req, res) => {
            res.write("world");
            res.end();
        });
    }
}
