const express = require("express");
const router = express.Router();
const Recipe = require("./entities/recipe.js");

router.post("", async (req, res) => {
  const { title, ingredients, servings, instructions } = req.body;

  const username = req.session.username;

  try {
    const newRecipe = new Recipe({
      username,
      title,
      ingredients,
      servings,
      instructions,
    });

    await newRecipe.save();

    res.redirect("/home");
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Error adding recipe" });
  }
});

module.exports = router;
