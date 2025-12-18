import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { getIngredients, addIngredient, updateIngredient, deleteIngredient, type Ingredient } from "@/lib/store"

const SimpleDialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-input rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

export function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(getIngredients())
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    packWeight: "",
  })

  const refreshIngredients = () => {
    setIngredients(getIngredients())
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setEditingId(null)
      setFormData({ name: "", price: "", packWeight: "" })
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.packWeight) {
      alert("Please fill in all fields")
      return
    }

    if (editingId) {
      const ingredient = ingredients.find((i) => i.id === editingId)
      if (ingredient) {
        const updated = {
          ...ingredient,
          name: formData.name,
          price: parseFloat(formData.price),
          packWeight: parseFloat(formData.packWeight),
        }
        updateIngredient(editingId, updated)
      }
    } else {
      const newIngredient: Ingredient = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        packWeight: parseFloat(formData.packWeight),
      }
      addIngredient(newIngredient)
    }

    handleOpenChange(false)
    refreshIngredients()
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id)
    setFormData({
      name: ingredient.name,
      price: ingredient.price.toString(),
      packWeight: ingredient.packWeight.toString(),
    })
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      deleteIngredient(id)
      refreshIngredients()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ingredients Management</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      <SimpleDialog open={open} onOpenChange={handleOpenChange}>
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Ingredient" : "Add New Ingredient"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editingId
                ? "Update the ingredient details"
                : "Add a new ingredient to your inventory"}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ingredient Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Flour"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price per Pack</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pack Weight (grams)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.packWeight}
                onChange={(e) =>
                  setFormData({ ...formData, packWeight: e.target.value })
                }
                placeholder="1000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? "Update" : "Add"} Ingredient
            </Button>
          </div>
        </div>
      </SimpleDialog>

      <div className="rounded-lg border border-input bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-input">
              <th className="p-4 text-left text-sm font-medium">Name</th>
              <th className="p-4 text-left text-sm font-medium">Price per Pack</th>
              <th className="p-4 text-left text-sm font-medium">Pack Weight</th>
              <th className="p-4 text-left text-sm font-medium">Cost per Gram</th>
              <th className="p-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">
                  No ingredients added yet. Add one to get started!
                </td>
              </tr>
            ) : (
              ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="border-b border-input hover:bg-muted/50">
                  <td className="p-4 text-sm">{ingredient.name}</td>
                  <td className="p-4 text-sm">${ingredient.price.toFixed(2)}</td>
                  <td className="p-4 text-sm">{ingredient.packWeight}g</td>
                  <td className="p-4 text-sm">
                    ${(ingredient.price / ingredient.packWeight).toFixed(4)}
                  </td>
                  <td className="p-4 text-sm flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(ingredient)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ingredient.id)}
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
    </div>
  )
}
