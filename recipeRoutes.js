const express = require("express");
const router = express.Router();
const Recipe = require("./entities/recipe.js");

router.post("/", async (req, res) => {
  const { title, ingredients, servings, instructions, images } = req.body;
  const username = req.session.username;

  try {
    const newRecipe = new Recipe({
      username,
      title,
      ingredients,
      servings,
      instructions,
      images: images.split(",").map((url) => url.trim()),
    });

    await newRecipe.save();
    res.redirect("/home");
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Error adding recipe" });
  }
});

router.post("/:recipeId/update", async (req, res) => {
  const recipeId = req.params.recipeId;
  const { editTitle, editIngredients, editServings, editInstructions } =
    req.body;

  try {
    const currentDate = new Date();
    await Recipe.findByIdAndUpdate(recipeId, {
      title: editTitle,
      ingredients: editIngredients,
      servings: editServings,
      instructions: editInstructions,
      updatedAt: currentDate,
    });
    res.redirect("/profile");
  } catch (error) {
    console.error("Ошибка при обновлении рецепта:", error);
    res.status(500).send("Ошибка при обновлении рецепта");
  }
});

router.post("/:recipeId/delete", async (req, res) => {
  const recipeId = req.params.recipeId;

  try {
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect("/profile");
  } catch (error) {
    console.error("Ошибка при удалении рецепта:", error);
    res.status(500).send("Ошибка при удалении рецепта");
  }
});

module.exports = router;
