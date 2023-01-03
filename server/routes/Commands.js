const express = require("express");
const router = express.Router();
const { Commands } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/", async (req, res) => {
  const listOfCommands = await Commands.findAll();
  res.json(listOfCommands);
});

router.post("/", async (req, res) => {
  const command = req.body;
  await Commands.create(command);
  res.json(command);
});

router.delete("/:commandId", validateToken, async (req, res) => {
  const commandId = req.params.commandId;
  await Commands.destroy({
    where: {
      id: commandId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;