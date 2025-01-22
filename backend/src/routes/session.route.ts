import { Router } from "express";
import { getAllSessionsHandler,deleteSessionHandler } from "../controllers/session.controller";

const sessionRoute = Router();

// prefix: /sessions
sessionRoute.get('/',getAllSessionsHandler);
sessionRoute.delete('/:id',deleteSessionHandler);

export default sessionRoute