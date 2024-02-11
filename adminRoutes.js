const express = require("express");
const router = express.Router();
const User = require("./entities/user");

router.post("/add", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = new User({
      username,
      password,
      isAdmin: false,
    });
    await user.save();

    res.redirect("/admin");
  } catch (error) {
    console.error("Ошибка при добавлении пользователя:", error);
    res.status(500).send("Ошибка при добавлении пользователя");
  }
});

router.post("/:userId/delete", async (req, res) => {
  const userId = req.params.userId;

  try {
    await User.findByIdAndDelete(userId);

    res.redirect("/admin");
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).send("Ошибка при удалении пользователя");
  }
});

module.exports = router;
