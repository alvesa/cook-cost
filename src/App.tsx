import { useState } from "react"
import { IngredientsPage } from "@/pages/IngredientsPage"
import { RecipesPage } from "@/pages/RecipesPage"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, ShoppingCart } from "lucide-react"
import "@/index.css"

type Page = "ingredients" | "recipes"

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("ingredients")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="border-b border-input bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold">Cook Cost Calculator</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentPage === "ingredients" ? "default" : "outline"}
              onClick={() => setCurrentPage("ingredients")}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Ingredients
            </Button>
            <Button
              variant={currentPage === "recipes" ? "default" : "outline"}
              onClick={() => setCurrentPage("recipes")}
              className="gap-2"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Recipes & Calculator
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === "ingredients" && <IngredientsPage />}
        {currentPage === "recipes" && <RecipesPage />}
      </main>
    </div>
  )
}

export default App
