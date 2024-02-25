const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  ingredients: { type: String, required: true },
  servings: { type: String },
  instructions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
