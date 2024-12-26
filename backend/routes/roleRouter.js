const express = require("express");
const { createNewRole } = require("../controllers/roleController");
const roleRouter = express.Router();

roleRouter.post("/", createNewRole);
module.exports = roleRouter;
