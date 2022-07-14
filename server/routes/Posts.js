const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { validateToken } = require("../middleware/AuthMiddleware");
const fileUpload = require("express-fileupload");

router.get("/", async (req, res) => {
  const listOfPosts = await Posts.findAll();
  res.json(listOfPosts);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.post("/img", fileUpload(), async (req, res) => {
  const file = req.files.file;

  file.mv(`${__dirname}/public/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });
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

const fs = require("fs");

router.put("/url", async (req, res) => {
  const { newUrl, id } = req.body;

  const post = await Posts.findByPk(id);
  const image = post.dataValues.url;
  if (image) {
    fs.unlink(`${__dirname}/public/${image}`, (err) => {
      if (err) throw err;
    });
  }

  if (newUrl != null) {
    const url = newUrl;
    await Posts.update({ url: url }, { where: { id: id } });
    res.json(url);
  } else {
    await Posts.update({ url: null }, { where: { id: id } });
    res.json(null);
  }
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
