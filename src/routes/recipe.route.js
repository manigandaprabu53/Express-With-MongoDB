import express from "express";
import recipeController from "../controller/recipe.controller.js";

const router = express.Router();

router.post('/createRecipe', recipeController.createRecipe);
router.get('/getAllRecipes', recipeController.getAllRecipes);
router.get('/getAllRecipesByUserId/:id', recipeController.getAllRecipesByUserId);

export default router;