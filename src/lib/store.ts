export interface Ingredient {
  id: string
  name: string
  price: number // price per full pack
  packWeight: number // weight of full pack in grams
}

export interface RecipeIngredient {
  ingredientId: string
  usedWeight: number // how much used in grams
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  extraCosts: number // electricity, gas, etc
}

export interface RecipeCalculation {
  ingredientName: string
  usedWeight: number
  packWeight: number
  ingredientPrice: number
  ingredientCost: number
  costPerGram: number
}

export interface RecipeResult {
  recipeId: string
  recipeName: string
  ingredients: RecipeCalculation[]
  ingredientsTotalCost: number
  extraCosts: number
  totalCost: number
  profitPercentage: number
  finalPrice: number
}

// In-memory data store
let ingredients: Ingredient[] = []
let recipes: Recipe[] = []

// Initialize with some sample data
export function initializeStore() {
  ingredients = []
  recipes = []
}

// Ingredient functions
export function addIngredient(ingredient: Ingredient) {
  ingredients.push(ingredient)
  return ingredient
}

export function updateIngredient(id: string, ingredient: Ingredient) {
  const index = ingredients.findIndex((i) => i.id === id)
  if (index !== -1) {
    ingredients[index] = ingredient
  }
  return ingredient
}

export function deleteIngredient(id: string) {
  ingredients = ingredients.filter((i) => i.id !== id)
}

export function getIngredients() {
  return [...ingredients]
}

export function getIngredient(id: string) {
  return ingredients.find((i) => i.id === id)
}

// Recipe functions
export function addRecipe(recipe: Recipe) {
  recipes.push(recipe)
  return recipe
}

export function updateRecipe(id: string, recipe: Recipe) {
  const index = recipes.findIndex((r) => r.id === id)
  if (index !== -1) {
    recipes[index] = recipe
  }
  return recipe
}

export function deleteRecipe(id: string) {
  recipes = recipes.filter((r) => r.id !== id)
}

export function getRecipes() {
  return [...recipes]
}

export function getRecipe(id: string) {
  return recipes.find((r) => r.id === id)
}

// Calculate recipe cost
export function calculateRecipe(recipeId: string, profitPercentage: number): RecipeResult | null {
  const recipe = getRecipe(recipeId)
  if (!recipe) return null

  const ingredientCalculations: RecipeCalculation[] = recipe.ingredients.map((recipeIng) => {
    const ingredient = getIngredient(recipeIng.ingredientId)
    if (!ingredient) throw new Error(`Ingredient ${recipeIng.ingredientId} not found`)

    const costPerGram = ingredient.price / ingredient.packWeight
    const ingredientCost = costPerGram * recipeIng.usedWeight

    return {
      ingredientName: ingredient.name,
      usedWeight: recipeIng.usedWeight,
      packWeight: ingredient.packWeight,
      ingredientPrice: ingredient.price,
      ingredientCost,
      costPerGram,
    }
  })

  const ingredientsTotalCost = ingredientCalculations.reduce(
    (sum, calc) => sum + calc.ingredientCost,
    0
  )

  const totalCost = ingredientsTotalCost + recipe.extraCosts
  const profitAmount = (totalCost * profitPercentage) / 100
  const finalPrice = totalCost + profitAmount

  return {
    recipeId,
    recipeName: recipe.name,
    ingredients: ingredientCalculations,
    ingredientsTotalCost,
    extraCosts: recipe.extraCosts,
    totalCost,
    profitPercentage,
    finalPrice,
  }
}
