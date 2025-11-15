import { Category, Dish } from "@/lib/stores/useARMenu";

export const categories: Category[] = [
  {
    id: "spicy",
    name: "Spicy",
    color: "#DC2626",
    neonColor: "#EF4444",
    emoji: "🔥"
  },
  {
    id: "dessert",
    name: "Dessert",
    color: "#EC4899",
    neonColor: "#F9A8D4",
    emoji: "🍫"
  },
  {
    id: "drinks",
    name: "Drinks",
    color: "#06B6D4",
    neonColor: "#67E8F9",
    emoji: "🍹"
  },
  {
    id: "veg",
    name: "Veg",
    color: "#10B981",
    neonColor: "#6EE7B7",
    emoji: "🥗"
  }
];

export const dishes: Dish[] = [
  {
    id: "spicy-burger",
    categoryId: "spicy",
    name: "Inferno Burger",
    description: "Blazing hot burger with ghost pepper sauce",
    calories: 850,
    ingredients: ["Beef Patty", "Ghost Pepper", "Jalapeños", "Spicy Mayo", "Lettuce", "Tomato"],
    emoji: "🔥",
    image: "/attached_assets/stock_images/spicy_burger_with_fl_b4463bbf.jpg",
    modelPath: "/models/burger.glb"
  },
  {
    id: "spicy-tacos",
    categoryId: "spicy",
    name: "Dragon Tacos",
    description: "Triple-spiced Mexican tacos with habanero salsa",
    calories: 620,
    ingredients: ["Corn Tortilla", "Spiced Beef", "Habanero Salsa", "Cheese", "Cilantro"],
    emoji: "🌶️",
    image: "/attached_assets/stock_images/tacos_spicy_mexican__efc48d2a.jpg",
    modelPath: "/models/tacos.glb"
  },
  {
    id: "spicy-pizza",
    categoryId: "spicy",
    name: "Volcano Pizza",
    description: "Spicy pepperoni with chili flakes",
    calories: 720,
    ingredients: ["Pizza Dough", "Spicy Pepperoni", "Mozzarella", "Chili Oil", "Jalapeños"],
    emoji: "🍕",
    image: "/attached_assets/stock_images/pizza_slice_with_che_aee88a99.jpg",
    modelPath: "/models/pizza.glb"
  },
  {
    id: "dessert-cake",
    categoryId: "dessert",
    name: "Velvet Dream Cake",
    description: "Rich chocolate layer cake with ganache",
    calories: 540,
    ingredients: ["Chocolate", "Butter", "Eggs", "Sugar", "Cream", "Cocoa"],
    emoji: "🍰",
    image: "/attached_assets/stock_images/chocolate_cake_desse_b2a52d50.jpg",
    modelPath: "/models/cake.glb"
  },
  {
    id: "dessert-icecream",
    categoryId: "dessert",
    name: "Paradise Sundae",
    description: "Triple scoop ice cream with toppings",
    calories: 480,
    ingredients: ["Vanilla Ice Cream", "Chocolate Sauce", "Whipped Cream", "Cherry", "Sprinkles"],
    emoji: "🍨",
    image: "/attached_assets/stock_images/ice_cream_sundae_des_e42339eb.jpg",
    modelPath: "/models/icecream.glb"
  },
  {
    id: "drink-cocktail",
    categoryId: "drinks",
    name: "Tropical Sunset",
    description: "Colorful fruity cocktail with rum",
    calories: 280,
    ingredients: ["Rum", "Pineapple Juice", "Orange Juice", "Grenadine", "Ice"],
    emoji: "🍹",
    image: "/attached_assets/stock_images/colorful_tropical_dr_4ff61cd0.jpg",
    modelPath: "/models/cocktail.glb"
  },
  {
    id: "drink-smoothie",
    categoryId: "drinks",
    name: "Green Energy Smoothie",
    description: "Healthy green smoothie with superfoods",
    calories: 220,
    ingredients: ["Spinach", "Banana", "Mango", "Chia Seeds", "Coconut Water"],
    emoji: "🥤",
    image: "/attached_assets/stock_images/smoothie_drink_healt_e500e28a.jpg",
    modelPath: "/models/smoothie.glb"
  },
  {
    id: "veg-salad",
    categoryId: "veg",
    name: "Garden Fresh Bowl",
    description: "Crispy mixed greens with vinaigrette",
    calories: 180,
    ingredients: ["Lettuce", "Cucumber", "Tomato", "Carrots", "Olive Oil", "Lemon"],
    emoji: "🥗",
    image: "/attached_assets/stock_images/fresh_green_salad_bo_986a8005.jpg",
    modelPath: "/models/salad.glb"
  }
];

export function getDishesForCategory(categoryId: string): Dish[] {
  return dishes.filter(dish => dish.categoryId === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(cat => cat.id === categoryId);
}

export function getDishById(dishId: string): Dish | undefined {
  return dishes.find(dish => dish.id === dishId);
}
