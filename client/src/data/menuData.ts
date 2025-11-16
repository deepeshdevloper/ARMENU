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
  },
  {
    id: "breakfast",
    name: "Breakfast",
    color: "#F59E0B",
    neonColor: "#FCD34D",
    emoji: "🍳"
  },
  {
    id: "italian",
    name: "Italian",
    color: "#EF4444",
    neonColor: "#FCA5A5",
    emoji: "🍝"
  }
];

const modelPaths = ["/models/burger.glb", "/models/cake.glb", "/models/cocktail.glb", "/models/salad.glb", "/models/tacos.glb", "/models/pizza.glb", "/models/icecream.glb", "/models/smoothie.glb"];

const dishImages = {
  spicy: [
    "/images/spicy_burger_with_fl_297b2588.jpg",
    "/images/spicy_chicken_wings__dd08c127.jpg",
    "/images/spicy_ramen_noodle_b_a3a20037.jpg",
    "/images/pizza_slice_with_che_f20b399c.jpg"
  ],
  dessert: [
    "/images/chocolate_cake_desse_5162c25e.jpg",
    "/images/ice_cream_sundae_wit_b2371b6a.jpg",
    "/images/cheesecake_with_berr_2c90d9b7.jpg",
    "/images/tiramisu_dessert_67605694.jpg"
  ],
  drinks: [
    "/images/colorful_tropical_dr_0340aff3.jpg",
    "/images/smoothie_drink_healt_1adabfb8.jpg",
    "/images/mojito_cocktail_with_f0507286.jpg",
    "/images/berry_smoothie_bowl_59659683.jpg"
  ],
  veg: [
    "/images/fresh_green_salad_bo_39e5747b.jpg",
    "/images/buddha_bowl_with_qui_d038e486.jpg",
    "/images/veggie_wrap_with_hum_aa279a4e.jpg",
    "/images/caprese_salad_tomato_72ff8752.jpg"
  ],
  breakfast: [
    "/images/fluffy_pancakes_with_97483bd5.jpg",
    "/images/avocado_toast_on_sou_8e9e6073.jpg",
    "/images/eggs_benedict_with_h_d4c1e7da.jpg",
    "/images/french_toast_with_ci_17c2c51c.jpg"
  ],
  italian: [
    "/images/margherita_pizza_fre_59cb691e.jpg",
    "/images/pasta_carbonara_crea_e282f522.jpg",
    "/images/lasagna_with_meat_sa_893d0494.jpg",
    "/images/mushroom_risotto_cre_5f94a090.jpg"
  ]
};

const dishTemplates = {
  spicy: [
    { name: "Inferno Burger", desc: "Blazing hot burger with ghost pepper sauce", emoji: "🔥", ingredients: ["Beef Patty", "Ghost Pepper", "Jalapeños", "Spicy Mayo", "Lettuce", "Tomato"] },
    { name: "Dragon Wings", desc: "Crispy wings with habanero glaze", emoji: "🌶️", ingredients: ["Chicken Wings", "Habanero Sauce", "Garlic", "Butter"] },
    { name: "Fire Noodles", desc: "Ultra spicy Korean-style instant noodles", emoji: "🍜", ingredients: ["Noodles", "Chili Powder", "Sesame Oil", "Green Onions"] },
    { name: "Volcano Pizza", desc: "Spicy pepperoni with chili flakes", emoji: "🍕", ingredients: ["Pizza Dough", "Spicy Pepperoni", "Mozzarella", "Chili Oil", "Jalapeños"] },
  ],
  dessert: [
    { name: "Velvet Dream Cake", desc: "Rich chocolate layer cake with ganache", emoji: "🍰", ingredients: ["Chocolate", "Butter", "Eggs", "Sugar", "Cream", "Cocoa"] },
    { name: "Paradise Sundae", desc: "Triple scoop ice cream with toppings", emoji: "🍨", ingredients: ["Vanilla Ice Cream", "Chocolate Sauce", "Whipped Cream", "Cherry", "Sprinkles"] },
    { name: "Cheesecake Bliss", desc: "New York style cheesecake with berries", emoji: "🍰", ingredients: ["Cream Cheese", "Graham Crackers", "Strawberries", "Sugar"] },
    { name: "Tiramisu Tower", desc: "Classic Italian coffee-soaked dessert", emoji: "☕", ingredients: ["Mascarpone", "Coffee", "Ladyfingers", "Cocoa Powder"] },
  ],
  drinks: [
    { name: "Tropical Sunset", desc: "Colorful fruity cocktail with rum", emoji: "🍹", ingredients: ["Rum", "Pineapple Juice", "Orange Juice", "Grenadine", "Ice"] },
    { name: "Green Energy Smoothie", desc: "Healthy green smoothie with superfoods", emoji: "🥤", ingredients: ["Spinach", "Banana", "Mango", "Chia Seeds", "Coconut Water"] },
    { name: "Mojito Magic", desc: "Refreshing mint and lime cocktail", emoji: "🍹", ingredients: ["White Rum", "Lime", "Mint", "Sugar", "Soda Water"] },
    { name: "Berry Blast", desc: "Mixed berry smoothie bowl", emoji: "🫐", ingredients: ["Blueberries", "Strawberries", "Yogurt", "Honey"] },
  ],
  veg: [
    { name: "Garden Fresh Bowl", desc: "Crispy mixed greens with vinaigrette", emoji: "🥗", ingredients: ["Lettuce", "Cucumber", "Tomato", "Carrots", "Olive Oil", "Lemon"] },
    { name: "Buddha Bowl", desc: "Quinoa and roasted vegetable bowl", emoji: "🥙", ingredients: ["Quinoa", "Sweet Potato", "Chickpeas", "Avocado", "Tahini"] },
    { name: "Veggie Wrap", desc: "Grilled vegetables in whole wheat wrap", emoji: "🌯", ingredients: ["Tortilla", "Bell Peppers", "Zucchini", "Hummus", "Spinach"] },
    { name: "Caprese Salad", desc: "Fresh mozzarella with tomatoes and basil", emoji: "🍅", ingredients: ["Mozzarella", "Tomatoes", "Basil", "Balsamic", "Olive Oil"] },
  ],
  breakfast: [
    { name: "Classic Pancakes", desc: "Fluffy buttermilk pancakes with syrup", emoji: "🥞", ingredients: ["Flour", "Eggs", "Milk", "Butter", "Maple Syrup"] },
    { name: "Avocado Toast", desc: "Smashed avocado on sourdough", emoji: "🥑", ingredients: ["Avocado", "Sourdough Bread", "Lemon", "Salt", "Pepper"] },
    { name: "Eggs Benedict", desc: "Poached eggs with hollandaise sauce", emoji: "🍳", ingredients: ["Eggs", "English Muffin", "Ham", "Hollandaise", "Chives"] },
    { name: "French Toast", desc: "Cinnamon-spiced French toast", emoji: "🍞", ingredients: ["Bread", "Eggs", "Cinnamon", "Vanilla", "Powdered Sugar"] },
  ],
  italian: [
    { name: "Margherita Pizza", desc: "Classic tomato, mozzarella, and basil", emoji: "🍕", ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Basil", "Olive Oil"] },
    { name: "Carbonara", desc: "Creamy pasta with pancetta", emoji: "🍝", ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"] },
    { name: "Lasagna", desc: "Layered pasta with meat sauce", emoji: "🍝", ingredients: ["Lasagna Noodles", "Beef", "Ricotta", "Mozzarella", "Tomato Sauce"] },
    { name: "Risotto", desc: "Creamy arborio rice with mushrooms", emoji: "🍚", ingredients: ["Arborio Rice", "Mushrooms", "Parmesan", "White Wine", "Butter"] },
  ]
};

const nameVariations = [
  "", "Classic", "Premium", "Deluxe", "Special", "Ultimate", "Signature", 
  "Gourmet", "Traditional", "Modern", "Artisan", "Homemade", "Chef's",
  "House", "Royal", "Imperial", "Supreme", "Divine", "Heavenly", "Perfect"
];

function generateDishes(): Dish[] {
  const allDishes: Dish[] = [];
  
  categories.forEach((category) => {
    const templates = dishTemplates[category.id as keyof typeof dishTemplates] || dishTemplates.spicy;
    const images = dishImages[category.id as keyof typeof dishImages];
    
    templates.forEach((template, templateIndex) => {
      const modelIndex = allDishes.length % modelPaths.length;
      const imageIndex = templateIndex;
      const calorieBase = 200 + (templateIndex * 20);
      
      allDishes.push({
        id: `${category.id}-${templateIndex}`,
        categoryId: category.id,
        name: template.name,
        description: template.desc,
        calories: calorieBase,
        ingredients: template.ingredients,
        emoji: template.emoji,
        image: images[imageIndex],
        modelPath: modelPaths[modelIndex]
      });
    });
  });
  
  return allDishes;
}

export const dishes: Dish[] = generateDishes();

export function getDishesForCategory(categoryId: string): Dish[] {
  return dishes.filter(dish => dish.categoryId === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(cat => cat.id === categoryId);
}

export function getDishById(dishId: string): Dish | undefined {
  return dishes.find(dish => dish.id === dishId);
}
