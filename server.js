const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./entities/user");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const adminRoutes = require("./adminRoutes");
const recipeRoutes = require("./recipeRoutes");
const request = require("request");
const path = require("path");
const Recipe = require("./entities/recipe.js");

const app = express();
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
const checkAdmin = (req, res, next) => {
  if (req.session.username === "artem") {
    next();
  } else {
    res.redirect("/home");
  }
};
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
app.use("/recipes", recipeRoutes);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/profile", async (req, res) => {
  try {
    const username = req.session.username;
    if (!username) {
      return res.redirect("/home");
    }

    let recipes;
    if (username === "artem") {
      recipes = await Recipe.find({ title: { $ne: "" } });
    } else {
      recipes = await Recipe.find({ username: username, title: { $ne: "" } });
    }

    console.log(recipes[0]);
    res.render("profile", { recipes: recipes });
  } catch (error) {
    console.error("Ошибка при получении рецептов:", error);
    res.redirect("/home");
  }
});

app.get("/recipes", (req, res) => {
  const apiKey = "bG/ihNFebjjUh5fQeZseCw==OFnRunQwztiKgww2";

  const searchQuery = req.query.query;

  if (!searchQuery) {
    res.render("recipes", { recipes: [] });
  } else {
    const url = `https://api.api-ninjas.com/v1/recipe?query=${searchQuery}`;
    request.get(
      {
        url: url,
        headers: {
          "X-Api-Key": apiKey,
        },
      },
      function (error, response, body) {
        if (error) {
          console.error("Request failed:", error);
          // res.redirect("/recipes");
        } else {
          const recipes = JSON.parse(body);
          res.render("recipes", { recipes: recipes });
        }
      }
    );
  }
});
app.get("/home", (req, res) => {
  const isAuth = req.session.username;
  res.render("home", { isAuth });
});

app.get("/admin", checkAdmin, async (req, res) => {
  try {
    const users = await User.find();

    res.render("admin", { users });
  } catch (error) {
    console.error("Ошибка при загрузке страницы администратора:", error);
    res.status(500).send("Ошибка при загрузке страницы администратора");
  }
});

app.get("/cocktails", (req, res) => {
  const apiKey = "bG/ihNFebjjUh5fQeZseCw==OFnRunQwztiKgww2";
  const searchQuery = req.query.query;

  if (!searchQuery) {
    res.render("cocktails", { cocktails: [] });
  } else {
    const url = `https://api.api-ninjas.com/v1/cocktail?name=${searchQuery}`;
    request.get(
      {
        url: url,
        headers: {
          "X-Api-Key": apiKey,
        },
      },
      function (error, response, body) {
        if (error) {
          console.error("Request failed:", error);
          res.redirect("/cocktails");
        } else {
          const cocktails = JSON.parse(body);
          res.render("cocktails", { cocktails: cocktails });
        }
      }
    );
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send("A user with that name already exists");
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

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/covid", (req, res) => {
  const country = "kazakhstan";
  const apiKey = "bG/ihNFebjjUh5fQeZseCw==OFnRunQwztiKgww2";

  const options = {
    url: `https://api.api-ninjas.com/v1/covid19?country=${country}`,
    headers: {
      "X-Api-Key": apiKey,
    },
  };

  request.get(options, (error, response, body) => {
    if (error) {
      console.error("Request failed:", error);
      res.status(500).send("Request failed");
      return;
    }

    const data = JSON.parse(body);

    res.render("covid", { data });
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === "artem" && password === "grents") {
      req.session.username = username;
      return res.redirect("/admin");
    }

    const user = await User.findOne({ username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.username = username;
        return res.redirect("/home");
      }
    }

    return res.redirect("/login");
  } catch (error) {
    console.error("Ошибка при входе пользователя:", error);
    res.status(500).send("Ошибка при входе пользователя");
  }
});

app.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Ошибка при выходе пользователя:", err);
        return res.status(500).send("Ошибка при выходе пользователя");
      }
      res.redirect("/home");
    });
  } catch (error) {
    console.error("Ошибка при выходе пользователя:", error);
    res.status(500).send("Ошибка при выходе пользователя");
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
