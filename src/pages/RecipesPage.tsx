import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2, Calculator, X } from "lucide-react"

const SimpleDialog = ({ open, onOpenChange, children, maxWidth = "max-w-2xl" }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; maxWidth?: string }) => {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`bg-background border border-input rounded-lg shadow-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto relative`}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    </>
  )
}
import {
  getRecipes,
  getIngredients,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  calculateRecipe,
  type Recipe,
  type RecipeIngredient,
  type RecipeResult,
} from "@/lib/store"

export function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes())
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    extraCosts: "",
    ingredients: [] as RecipeIngredient[],
  })
  const [calculationOpen, setCalculationOpen] = useState(false)
  const [profitPercentage, setProfitPercentage] = useState("25")
  const [calculationResult, setCalculationResult] = useState<RecipeResult | null>(null)

  const ingredients = getIngredients()

  const refreshRecipes = () => {
    setRecipes(getRecipes())
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setEditingId(null)
      setFormData({
        name: "",
        extraCosts: "",
        ingredients: [],
      })
    }
  }

  const handleAddIngredientToRecipe = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        {
          ingredientId: ingredients[0]?.id || "",
          usedWeight: 0,
        },
      ],
    })
  }

  const handleUpdateRecipeIngredient = (
    index: number,
    ingredientId: string,
    usedWeight: number
  ) => {
    const updated = [...formData.ingredients]
    updated[index] = { ingredientId, usedWeight }
    setFormData({ ...formData, ingredients: updated })
  }

  const handleRemoveRecipeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = () => {
    if (!formData.name || formData.ingredients.length === 0) {
      alert("Please fill in recipe name and add at least one ingredient")
      return
    }

    if (editingId) {
      const recipe = recipes.find((r) => r.id === editingId)
      if (recipe) {
        const updated = {
          ...recipe,
          name: formData.name,
          extraCosts: parseFloat(formData.extraCosts) || 0,
          ingredients: formData.ingredients,
        }
        updateRecipe(editingId, updated)
      }
    } else {
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: formData.name,
        extraCosts: parseFloat(formData.extraCosts) || 0,
        ingredients: formData.ingredients,
      }
      addRecipe(newRecipe)
    }

    handleOpenChange(false)
    refreshRecipes()
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingId(recipe.id)
    setFormData({
      name: recipe.name,
      extraCosts: recipe.extraCosts.toString(),
      ingredients: recipe.ingredients,
    })
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe(id)
      refreshRecipes()
    }
  }

  const handleCalculate = (recipeId: string) => {
    const result = calculateRecipe(recipeId, parseFloat(profitPercentage))
    setCalculationResult(result)
    setCalculationOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Recipe
        </Button>
      </div>

      <SimpleDialog open={open} onOpenChange={handleOpenChange} maxWidth="max-w-2xl">
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Recipe" : "Add New Recipe"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editingId
                ? "Update the recipe details"
                : "Create a new recipe with ingredients"}
            </p>
          </div>
          <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipe Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Chocolate Cake"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Extra Costs (electricity, gas, etc)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.extraCosts}
                  onChange={(e) =>
                    setFormData({ ...formData, extraCosts: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Recipe Ingredients</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddIngredientToRecipe}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Ingredient
                  </Button>
                </div>

                {formData.ingredients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ingredients added yet</p>
                ) : (
                  formData.ingredients.map((ing, index) => {
                    const ingredient = ingredients.find((i) => i.id === ing.ingredientId)
                    return (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">Ingredient</label>
                          <select
                            value={ing.ingredientId}
                            onChange={(e) =>
                              handleUpdateRecipeIngredient(
                                index,
                                e.target.value,
                                ing.usedWeight
                              )
                            }
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            {ingredients.map((i) => (
                              <option key={i.id} value={i.id}>
                                {i.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-muted-foreground">Used (grams)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={ing.usedWeight}
                            onChange={(e) =>
                              handleUpdateRecipeIngredient(
                                index,
                                ing.ingredientId,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                        {ingredient && (
                          <div className="text-xs text-muted-foreground">
                            ${((ingredient.price / ingredient.packWeight) * ing.usedWeight).toFixed(2)}
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveRecipeIngredient(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingId ? "Update" : "Add"} Recipe
              </Button>
            </div>
        </div>
      </SimpleDialog>

      <div className="rounded-lg border border-input bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-input">
              <th className="p-4 text-left text-sm font-medium">Name</th>
              <th className="p-4 text-left text-sm font-medium">Ingredients</th>
              <th className="p-4 text-left text-sm font-medium">Extra Costs</th>
              <th className="p-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-sm text-muted-foreground">
                  No recipes added yet. Add one to get started!
                </td>
              </tr>
            ) : (
              recipes.map((recipe) => (
                <tr key={recipe.id} className="border-b border-input hover:bg-muted/50">
                  <td className="p-4 text-sm font-medium">{recipe.name}</td>
                  <td className="p-4 text-sm">{recipe.ingredients.length} ingredients</td>
                  <td className="p-4 text-sm">${recipe.extraCosts.toFixed(2)}</td>
                  <td className="p-4 text-sm flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalculate(recipe.id)}
                      className="gap-1"
                    >
                      <Calculator className="h-4 w-4" />
                      Calculate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(recipe)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Calculation Dialog */}
      <SimpleDialog open={calculationOpen} onOpenChange={setCalculationOpen} maxWidth="max-w-4xl">
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-semibold">Recipe Cost Calculation</h2>

          {calculationResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-input bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Ingredients Cost</p>
                  <p className="text-2xl font-bold">
                    ${calculationResult.ingredientsTotalCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border border-input bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Extra Costs</p>
                  <p className="text-2xl font-bold">
                    ${calculationResult.extraCosts.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border border-input bg-muted p-4">
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">
                    ${calculationResult.totalCost.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Profit Margin (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={profitPercentage}
                  onChange={(e) => setProfitPercentage(e.target.value)}
                />
              </div>

              <div className="rounded-lg border-2 border-accent bg-accent/5 p-4">
                <p className="text-sm text-muted-foreground">Final Price with {profitPercentage}% profit</p>
                <p className="text-3xl font-bold text-accent">
                  ${(calculationResult.totalCost * (1 + parseFloat(profitPercentage) / 100)).toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-3">Ingredients Breakdown</h3>
                <div className="rounded-lg border border-input">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-input">
                        <th className="p-3 text-left">Ingredient</th>
                        <th className="p-3 text-left">Used</th>
                        <th className="p-3 text-left">Pack Weight</th>
                        <th className="p-3 text-left">Cost/g</th>
                        <th className="p-3 text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.ingredients.map((ing, index) => (
                        <tr key={index} className="border-b border-input hover:bg-muted/50">
                          <td className="p-3">{ing.ingredientName}</td>
                          <td className="p-3">{ing.usedWeight.toFixed(2)}g</td>
                          <td className="p-3">{ing.packWeight.toFixed(2)}g</td>
                          <td className="p-3">${ing.costPerGram.toFixed(4)}</td>
                          <td className="p-3 text-right font-medium">
                            ${ing.ingredientCost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button onClick={() => setCalculationOpen(false)}>Close</Button>
          </div>
        </div>
      </SimpleDialog>
    </div>
  )
}
