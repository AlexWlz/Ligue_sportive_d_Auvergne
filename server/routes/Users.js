const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middleware/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findByPk(id);
  res.json(user);
});

router.post("/", async (req, res) => {
  const { email, password, first_name, last_name, phone } = req.body;
  if (email && password && first_name && last_name && phone) {
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        email: email,
        password: hash,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
      });
      res.json("SUCCESS");
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await Users.findOne({ where: { email: email } });

    if (!user) res.json({ error: "Email Doesn't Exist" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword === false) {
      res.json({ error: "Wrong email And Password Combination" });
    } else {
      if (validPassword === true) {
        const accessToken = sign(
          { email: user.email, id: user.id, first_name: user.first_name },
          "importantsecret"
        );

        res.json({
          token: accessToken,
          email: email,
          id: user.id,
          first_name: user.first_name,
          admin: user.admin,
        });
      }
    }
  }
});

router.get("/auth", validateToken, (req, res) => {
  console.log(req.user);
  res.json(req.user);
});

router.put("/firstName", async (req, res) => {
  const { newFirstName, id } = req.body;
  await Users.update({ first_name: newFirstName }, { where: { id: id } });
  res.json(newFirstName);
});

router.put("/lastName", async (req, res) => {
  const { newLastName, id } = req.body;
  await Users.update({ last_name: newLastName }, { where: { id: id } });
  res.json(newLastName);
});

router.put("/phone", async (req, res) => {
  const { newPhone, id } = req.body;
  await Users.update({ phone: newPhone }, { where: { id: id } });
  res.json(newPhone);
});

router.put("/email", async (req, res) => {
  const { newEmail, id } = req.body;
  await Users.update({ email: newEmail }, { where: { id: id } });
  res.json(newEmail);
});

router.put("/admin", async (req, res) => {
  const { newAdmin, id } = req.body;
  await Users.update({ admin: newAdmin }, { where: { id: id } });
  res.json(newAdmin);
});

router.put("/password", async (req, res) => {
  const { newPassword, id } = req.body;
  bcrypt.hash(newPassword, 10).then((hash) => {
    Users.update({ password: hash }, { where: { id: id } });
    res.json(newPassword);
  });
});

router.delete("/:userId", validateToken, async (req, res) => {
  const userId = req.params.userId;
  await Users.destroy({
    where: {
      id: userId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
