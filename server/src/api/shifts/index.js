import express from "express";
import moment from "moment";
import mongoose from "mongoose";

import controller from "./controller"

const router = express.Router();
export default router;

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

router.post("/", controller.create);

router.delete("/:id", controller.deleteById);

// TODO: put
