import { Router } from 'express';

export default class baseRoute {
    path = '/';
    router = Router();


    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(this.path, (req, res) => {
            res.status(200).json({
                message: 'Hello World!'
                });
        });
    }
}