import { Category, Dish } from "@/lib/stores/useARMenu";
import menuJson from "./menu.json";

const colorMapping: Record<string, { color: string; neonColor: string; emoji: string }> = {
  paneer: { color: "#FF9933", neonColor: "#FFB366", emoji: "🧀" },
  kofta: { color: "#138808", neonColor: "#4CAF50", emoji: "🥘" },
  mushroom: { color: "#8B4513", neonColor: "#B8733D", emoji: "🍄" },
  kaju: { color: "#FFD700", neonColor: "#FFC700", emoji: "🌰" },
  chole: { color: "#DC2626", neonColor: "#EF4444", emoji: "🫘" },
  vegetables: { color: "#10B981", neonColor: "#6EE7B7", emoji: "🥗" },
  breads: { color: "#D4A574", neonColor: "#E6C8A0", emoji: "🫓" },
  rice: { color: "#8B4513", neonColor: "#B8733D", emoji: "🍚" },
  dal: { color: "#F59E0B", neonColor: "#FCD34D", emoji: "🍲" },
  salads: { color: "#10B981", neonColor: "#6EE7B7", emoji: "🥙" },
  desserts: { color: "#EC4899", neonColor: "#F9A8D4", emoji: "🍬" }
};

export const categories: Category[] = menuJson.categories.map((cat: any) => ({
  id: cat.id,
  name: cat.name,
  color: colorMapping[cat.id]?.color || "#FF9933",
  neonColor: colorMapping[cat.id]?.neonColor || "#FFB366",
  emoji: colorMapping[cat.id]?.emoji || "🍽️"
}));

function createIngredientsList(dishName: string): string[] {
  const commonIngredients: Record<string, string[]> = {
    paneer: ["Paneer", "Tomatoes", "Onions", "Cream", "Spices"],
    dal: ["Lentils", "Ghee", "Cumin", "Turmeric", "Coriander"],
    rice: ["Basmati Rice", "Spices", "Ghee", "Saffron"],
    naan: ["Flour", "Yogurt", "Butter", "Yeast"],
    kofta: ["Vegetables", "Paneer", "Cream", "Cashews", "Spices"]
  };
  
  for (const [key, ingredients] of Object.entries(commonIngredients)) {
    if (dishName.toLowerCase().includes(key)) {
      return ingredients;
    }
  }
  
  return ["Fresh Ingredients", "Indian Spices", "Herbs"];
}

function createDescription(dishName: string, categoryName: string): string {
  const descriptions: Record<string, string> = {
    "Paneer": "Delicious cottage cheese curry",
    "Dal": "Traditional lentil dish",
    "Rice": "Aromatic rice preparation",
    "Naan": "Soft Indian flatbread",
    "Kofta": "Vegetable dumplings in rich gravy",
    "Salad": "Fresh and healthy accompaniment"
  };
  
  for (const [key, desc] of Object.entries(descriptions)) {
    if (dishName.includes(key) || categoryName.includes(key)) {
      return desc;
    }
  }
  
  return `Authentic ${categoryName} dish`;
}

function createAllergensList(dishName: string): string[] {
  const allergenMapping: Record<string, string[]> = {
    paneer: ["Dairy", "Milk"],
    dal: ["Legumes"],
    rice: ["None"],
    naan: ["Gluten", "Dairy"],
    kofta: ["Dairy", "Nuts", "Milk"],
    gulab: ["Dairy", "Milk", "Gluten"],
    mushroom: ["Mushrooms"],
    salad: ["None"]
  };
  
  for (const [key, allergens] of Object.entries(allergenMapping)) {
    if (dishName.toLowerCase().includes(key)) {
      return allergens;
    }
  }
  
  return ["Check with staff"];
}

function getVideoUrl(dishName: string): string | undefined {
  return undefined;
}

export const dishes: Dish[] = menuJson.categories.flatMap((cat: any) => 
  cat.dishes.map((dish: any, index: number) => ({
    id: dish.id,
    categoryId: cat.id,
    name: dish.name,
    description: createDescription(dish.name, cat.name),
    calories: Math.round(dish.price * 2.5),
    ingredients: createIngredientsList(dish.name),
    allergens: createAllergensList(dish.name),
    videoUrl: getVideoUrl(dish.name),
    emoji: colorMapping[cat.id]?.emoji || "🍽️",
    image: dish.image || cat.image,
    modelPath: dish.model || cat.model
  }))
);

export function getDishesForCategory(categoryId: string): Dish[] {
  return dishes.filter(dish => dish.categoryId === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(cat => cat.id === categoryId);
}

export function getDishById(dishId: string): Dish | undefined {
  return dishes.find(dish => dish.id === dishId);
}
