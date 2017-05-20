import {Router} from "express";

/**
 * A service is any class type that exposes an interface for routes
 * that can then be added to an express app.
 */
export abstract class Service {
    private provider: LazyProvider<Router> = LazyProvider.of(() => this.setupRoutes());

    /**
     * Setup the routes for the returned router.
     * The user will want to override this method.
     */
    protected abstract setupRoutes(): Router;

    /**
     * Returns the router, lazily initialized for this instance.
     */
    router(): Router {
        return this.provider.get();
    }
}

/**
 * Simple lazy initialization provider.
 */
class LazyProvider<T> {
    private initializer: () => T;
    private value: T | undefined;

    private constructor(initializer: () => T) {
        this.value = undefined;
        this.initializer = initializer;
    }

    get(): T {
        if (this.value === undefined) {
            this.value = this.initializer();
        }
        return this.value;
    }

    static of<T>(func: () => T): LazyProvider<T> {
        return new LazyProvider(func);
    }
}
