const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./entities/user");
const bcrypt = require("bcryptjs");
const adminRoutes = require("./adminRoutes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose
  .connect(
    "mongodb+srv://gggrents:RPFWKZoABcOLS9rl@assignment-3.wblfoqa.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Подключение к MongoDB успешно"))
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));

app.use("/admin/users", adminRoutes);

app.get("/", (req, res) => {
  res.redirect("/register");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/admin", async (req, res) => {
  try {
    const users = await User.find();

    res.render("admin", { users });
  } catch (error) {
    console.error("Ошибка при загрузке страницы администратора:", error);
    res.status(500).send("Ошибка при загрузке страницы администратора");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send("Пользователь с таким именем уже существует");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res.status(500).send("Ошибка при регистрации пользователя");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === "artem" && password === "grents") {
      return res.redirect("/admin");
    }

    const user = await User.findOne({ username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return res.redirect("/home");
      }
    }

    return res.redirect("/login");
  } catch (error) {
    console.error("Ошибка при входе пользователя:", error);
    res.status(500).send("Ошибка при входе пользователя");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/admin", (req, res) => {
  res.render("adminPanel");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});
