const express = require("express");
const { createNewRole } = require("../controllers/roleController");

const roleRouter = express.Router();

roleRouter.post("/createrole", createNewRole);

module.exports = roleRouter;
