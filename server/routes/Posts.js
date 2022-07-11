const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll();
  res.json(listOfPosts);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.post("/", async (req, res) => {
  const post = req.body;
  await Posts.create(post);
  res.json(post);
});

router.put("/produce", async (req, res) => {
  const { newProduce, id } = req.body;
  await Posts.update({ produce: newProduce }, { where: { id: id } });
  res.json(newProduce);
});

router.put("/description", async (req, res) => {
  const { newDescription, id } = req.body;
  await Posts.update({ description: newDescription }, { where: { id: id } });
  res.json(newDescription);
});

router.put("/price", async (req, res) => {
  const { newPrice, id } = req.body;
  await Posts.update({ price: newPrice }, { where: { id: id } });
  res.json(newPrice);
});

router.put("/stock", async (req, res) => {
  const { newStock, id } = req.body;
  await Posts.update({ stock: newStock }, { where: { id: id } });
  res.json(newStock);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
