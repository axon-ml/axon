import {Router} from "express";

/**
 * A service is any class type that exposes an interface for routes
 * that can then be added to an express app.
 */
export interface IService {
    router(): Router; /* Returns the router object that has been setup for the service. */
}
