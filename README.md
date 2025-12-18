# Cook Cost Calculator

A modern web application for calculating pastry and recipe production costs with detailed ingredient tracking and profit margin analysis.

## Overview

Cook Cost Calculator is a professional tool designed for bakers, pastry chefs, and food entrepreneurs to accurately calculate the cost of their recipes and determine optimal pricing with profit margins. The app provides detailed cost breakdowns, ingredient tracking, and real-time calculations.

## Features

### 🥘 Ingredients Management
- **Add/Edit/Delete Ingredients**: Manage your ingredient inventory with ease
- **Cost Tracking**: Track ingredient name, price per full pack, and pack weight
- **Cost Per Gram**: Automatic calculation of ingredient cost per gram for easy reference
- **Clean Interface**: Organized table view with all ingredient details at a glance

### 📋 Recipe Management
- **Create Recipes**: Build recipes with multiple ingredients
- **Ingredient Quantities**: Specify exactly how much of each ingredient is used (in grams)
- **Extra Costs**: Add overhead costs like electricity, gas, labor, packaging, etc.
- **Edit/Delete**: Modify or remove recipes as needed

### 💰 Cost Calculation & Breakdown
- **Detailed Breakdown**: See costs for each ingredient in your recipe:
  - Ingredient name
  - Amount used (grams)
  - Full pack weight (grams)
  - Cost per gram
  - Total cost for that ingredient
- **Subtotals**: View totals for:
  - Total ingredient costs
  - Extra costs (overhead)
  - Combined total cost
- **Profit Margin Calculator**: Adjustable profit percentage to calculate final selling price
- **Real-time Updates**: See final price change instantly as you adjust profit margins

### 🎨 Modern User Interface
- Clean, professional design with Tailwind CSS
- Responsive layout that works on all devices
- Intuitive navigation with clear tabs
- Modal dialogs for adding/editing data
- Lucide React icons for visual clarity

## Technology Stack

### Frontend
- **React 19**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript for better code quality
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icon library

### Architecture
- **Component-Based**: Modular, reusable React components
- **In-Memory State Management**: Data stored in memory for instant access
- **TypeScript Interfaces**: Strong typing for data structures

## Project Structure

```
cookCost/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx          # Reusable button component
│   │       ├── input.tsx           # Reusable input component
│   │       └── dialog.tsx          # Modal dialog component
│   ├── pages/
│   │   ├── IngredientsPage.tsx     # Ingredient management page
│   │   └── RecipesPage.tsx         # Recipe calculation page
│   ├── lib/
│   │   ├── store.ts               # In-memory data store & calculations
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # React app entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Project dependencies
└── README.md                        # This file
```

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

1. Clone the repository:
```bash
cd /home/alvesa/Andre/lab/cookCost
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5174/` (or next available port)

## Usage

### Adding Ingredients

1. Click the **"Add Ingredient"** button on the Ingredients page
2. Fill in the form:
   - **Ingredient Name**: e.g., "Flour", "Sugar", "Butter"
   - **Price per Pack**: Total cost of one pack (e.g., 2.50)
   - **Pack Weight**: Weight of one full pack in grams (e.g., 1000)
3. Click **"Add Ingredient"** to save

The cost per gram will be calculated automatically (Price ÷ Pack Weight)

### Creating a Recipe

1. Navigate to the **"Recipes & Calculator"** tab
2. Click **"Add Recipe"** button
3. Fill in the recipe details:
   - **Recipe Name**: e.g., "Chocolate Cake"
   - **Extra Costs**: Add any overhead costs like electricity, gas, labor (e.g., 0.50)
4. Add ingredients to the recipe:
   - Click **"Add Ingredient"** in the dialog
   - Select the ingredient from the dropdown
   - Enter how much is used in grams (e.g., 200g of flour)
5. Click **"Add Recipe"** to save

### Calculating Recipe Cost

1. In the Recipes table, click the **"Calculate"** button for a recipe
2. A detailed cost breakdown dialog will open showing:
   - Ingredients cost
   - Extra costs
   - Total cost
   - Ingredients breakdown table with per-item costs
3. Adjust the **"Profit Margin (%)"** slider to see the final price change in real-time
4. The final selling price updates automatically based on the formula:
   ```
   Final Price = Total Cost × (1 + Profit% / 100)
   ```

## Data Model

### Ingredient
```typescript
interface Ingredient {
  id: string
  name: string
  price: number           // Price per full pack
  packWeight: number      // Weight of full pack in grams
}
```

### Recipe
```typescript
interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  extraCosts: number     // Additional costs (electricity, gas, etc)
}
```

### Recipe Ingredient
```typescript
interface RecipeIngredient {
  ingredientId: string
  usedWeight: number     // Amount used in grams
}
```

### Recipe Calculation Result
```typescript
interface RecipeResult {
  recipeId: string
  recipeName: string
  ingredients: RecipeCalculation[]
  ingredientsTotalCost: number
  extraCosts: number
  totalCost: number
  profitPercentage: number
  finalPrice: number
}
```

## Calculation Logic

### Cost Per Ingredient
```
Cost Per Gram = Ingredient Price ÷ Pack Weight
Ingredient Cost = Cost Per Gram × Amount Used
```

### Recipe Total Cost
```
Total Ingredient Cost = Sum of all ingredient costs
Total Cost = Total Ingredient Cost + Extra Costs
```

### Final Price with Profit
```
Profit Amount = Total Cost × (Profit Percentage ÷ 100)
Final Price = Total Cost + Profit Amount
            = Total Cost × (1 + Profit% / 100)
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR)

### Production Build
```bash
npm run build
```
Builds the app for production to the `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Persistence

Currently, all data is stored **in-memory**, which means:
- ✅ Fast access and instant calculations
- ✅ No database setup required
- ⚠️ Data resets when the page is refreshed

### Future Enhancement: Persistent Storage
To add persistence, you can extend the app with:
- **localStorage**: Browser local storage for client-side persistence
- **IndexedDB**: For larger data storage
- **Backend API**: Connect to a server with database

## Customization

### Styling
- Tailwind CSS configuration: `tailwind.config.ts`
- Global styles: `src/index.css`
- Theme colors defined as CSS variables in `:root`

### Colors
The app uses a professional color scheme:
- **Primary**: Dark gray (#161616)
- **Accent**: Red/Orange (#EF4444)
- **Background**: White
- **Muted**: Light gray for secondary elements

### Theme Variables
Edit `:root` in `src/index.css` to customize:
- `--primary`: Main color
- `--secondary`: Secondary color
- `--accent`: Highlight/action color
- `--destructive`: Delete/warning color
- `--background`: Background color
- `--foreground`: Text color

## Performance

- Lightweight bundle with minimal dependencies
- Fast calculations using TypeScript functions
- Efficient React rendering with hooks
- Tailwind CSS for optimized styling

## Future Features

Potential enhancements for the app:

- [ ] **Export to CSV/PDF**: Download recipe calculations
- [ ] **Recipe Templates**: Save and reuse common recipes
- [ ] **Unit Conversion**: Support for different weight units (kg, oz, lb)
- [ ] **Price History**: Track ingredient price changes over time
- [ ] **Multiple Currencies**: Support different currency symbols
- [ ] **Batch Calculations**: Calculate costs for multiple batches
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Database Integration**: Persistent storage with backend
- [ ] **User Accounts**: Save recipes across sessions
- [ ] **Recipe Sharing**: Export and share recipes with others

## Troubleshooting

### Port Already in Use
If port 5173 or 5174 is in use:
```bash
# Vite will automatically try the next available port
npm run dev
```

### Dependencies Not Installing
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working
- Make sure you're editing files in the `src/` folder
- Check that Vite server is running
- Refresh the browser if needed

## Contributing

This is a personal project. Feel free to fork and modify as needed!

## License

Free to use and modify for personal or commercial projects.

## Support

For issues or questions, check:
1. The troubleshooting section above
2. Console errors in browser developer tools
3. Vite documentation: https://vitejs.dev
4. React documentation: https://react.dev
5. Tailwind CSS documentation: https://tailwindcss.com

## Project Info

- **Created**: December 2025
- **Version**: 1.0.0
- **Language**: TypeScript + React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

---

**Ready to calculate your recipe costs?** Start by adding your ingredients, then create a recipe and calculate its production cost!
