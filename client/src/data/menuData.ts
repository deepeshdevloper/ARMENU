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
  },
  {
    id: "asian",
    name: "Asian",
    color: "#8B5CF6",
    neonColor: "#C4B5FD",
    emoji: "🥢"
  },
  {
    id: "mexican",
    name: "Mexican",
    color: "#F97316",
    neonColor: "#FDBA74",
    emoji: "🌮"
  },
  {
    id: "american",
    name: "American",
    color: "#3B82F6",
    neonColor: "#93C5FD",
    emoji: "🍔"
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    color: "#14B8A6",
    neonColor: "#5EEAD4",
    emoji: "🫒"
  },
  {
    id: "seafood",
    name: "Seafood",
    color: "#0EA5E9",
    neonColor: "#7DD3FC",
    emoji: "🦞"
  },
  {
    id: "grill",
    name: "Grill",
    color: "#DC2626",
    neonColor: "#FCA5A5",
    emoji: "🥩"
  },
  {
    id: "pasta",
    name: "Pasta",
    color: "#FBBF24",
    neonColor: "#FDE68A",
    emoji: "🍜"
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    color: "#A78BFA",
    neonColor: "#C4B5FD",
    emoji: "🥪"
  },
  {
    id: "soups",
    name: "Soups",
    color: "#F472B6",
    neonColor: "#F9A8D4",
    emoji: "🍲"
  },
  {
    id: "appetizers",
    name: "Appetizers",
    color: "#FB923C",
    neonColor: "#FDBA74",
    emoji: "🍤"
  },
  {
    id: "bbq",
    name: "BBQ",
    color: "#92400E",
    neonColor: "#D97706",
    emoji: "🍖"
  },
  {
    id: "sushi",
    name: "Sushi",
    color: "#059669",
    neonColor: "#34D399",
    emoji: "🍣"
  },
  {
    id: "indian",
    name: "Indian",
    color: "#EA580C",
    neonColor: "#FB923C",
    emoji: "🍛"
  },
  {
    id: "chinese",
    name: "Chinese",
    color: "#DC2626",
    neonColor: "#F87171",
    emoji: "🥟"
  },
  {
    id: "japanese",
    name: "Japanese",
    color: "#BE123C",
    neonColor: "#FB7185",
    emoji: "🍱"
  },
  {
    id: "french",
    name: "French",
    color: "#7C3AED",
    neonColor: "#A78BFA",
    emoji: "🥐"
  },
  {
    id: "greek",
    name: "Greek",
    color: "#0284C7",
    neonColor: "#38BDF8",
    emoji: "🧆"
  },
  {
    id: "thai",
    name: "Thai",
    color: "#C2410C",
    neonColor: "#FB923C",
    emoji: "🍜"
  },
  {
    id: "korean",
    name: "Korean",
    color: "#BE185D",
    neonColor: "#F472B6",
    emoji: "🍚"
  }
];

const modelPaths = ["/models/burger.glb", "/models/cake.glb", "/models/cocktail.glb", "/models/salad.glb", "/models/tacos.glb", "/models/pizza.glb", "/models/icecream.glb", "/models/smoothie.glb"];
const imagePaths = ["/attached_assets/stock_images/spicy_burger_with_fl_b4463bbf.jpg", "/attached_assets/stock_images/chocolate_cake_desse_b2a52d50.jpg", "/attached_assets/stock_images/colorful_tropical_dr_4ff61cd0.jpg", "/attached_assets/stock_images/fresh_green_salad_bo_986a8005.jpg", "/attached_assets/stock_images/tacos_spicy_mexican__efc48d2a.jpg", "/attached_assets/stock_images/pizza_slice_with_che_aee88a99.jpg", "/attached_assets/stock_images/ice_cream_sundae_des_e42339eb.jpg", "/attached_assets/stock_images/smoothie_drink_healt_e500e28a.jpg"];

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
  ],
  asian: [
    { name: "Pad Thai", desc: "Stir-fried rice noodles with shrimp", emoji: "🍜", ingredients: ["Rice Noodles", "Shrimp", "Peanuts", "Tamarind", "Bean Sprouts"] },
    { name: "Fried Rice", desc: "Wok-tossed rice with vegetables", emoji: "🍚", ingredients: ["Rice", "Eggs", "Peas", "Carrots", "Soy Sauce"] },
    { name: "Spring Rolls", desc: "Crispy vegetable spring rolls", emoji: "🥟", ingredients: ["Rice Paper", "Cabbage", "Carrots", "Bean Sprouts", "Sweet Chili Sauce"] },
    { name: "Ramen", desc: "Japanese noodle soup with pork", emoji: "🍜", ingredients: ["Noodles", "Pork Belly", "Miso", "Eggs", "Green Onions"] },
  ],
  mexican: [
    { name: "Tacos Al Pastor", desc: "Marinated pork with pineapple", emoji: "🌮", ingredients: ["Pork", "Pineapple", "Corn Tortillas", "Cilantro", "Onions"] },
    { name: "Quesadilla", desc: "Cheese-filled grilled tortilla", emoji: "🫓", ingredients: ["Flour Tortilla", "Cheese", "Chicken", "Bell Peppers", "Sour Cream"] },
    { name: "Burrito Bowl", desc: "Rice bowl with beans and guacamole", emoji: "🥙", ingredients: ["Rice", "Black Beans", "Guacamole", "Salsa", "Cheese"] },
    { name: "Enchiladas", desc: "Rolled tortillas with chili sauce", emoji: "🌮", ingredients: ["Tortillas", "Chicken", "Enchilada Sauce", "Cheese", "Onions"] },
  ],
  american: [
    { name: "Classic Burger", desc: "Juicy beef burger with all the fixings", emoji: "🍔", ingredients: ["Beef Patty", "Lettuce", "Tomato", "Onion", "Pickles", "Cheese"] },
    { name: "BBQ Ribs", desc: "Slow-cooked ribs with BBQ sauce", emoji: "🍖", ingredients: ["Pork Ribs", "BBQ Sauce", "Dry Rub", "Coleslaw"] },
    { name: "Mac and Cheese", desc: "Creamy macaroni and cheese", emoji: "🧀", ingredients: ["Macaroni", "Cheddar", "Milk", "Butter", "Breadcrumbs"] },
    { name: "Hot Dog", desc: "Classic American hot dog with toppings", emoji: "🌭", ingredients: ["Hot Dog", "Bun", "Mustard", "Ketchup", "Relish"] },
  ],
  mediterranean: [
    { name: "Greek Salad", desc: "Fresh vegetables with feta cheese", emoji: "🥗", ingredients: ["Tomatoes", "Cucumber", "Feta", "Olives", "Olive Oil"] },
    { name: "Falafel", desc: "Crispy chickpea fritters", emoji: "🧆", ingredients: ["Chickpeas", "Parsley", "Garlic", "Cumin", "Tahini"] },
    { name: "Hummus Platter", desc: "Creamy chickpea dip with pita", emoji: "🫓", ingredients: ["Chickpeas", "Tahini", "Lemon", "Garlic", "Pita Bread"] },
    { name: "Shawarma", desc: "Marinated meat wrap", emoji: "🌯", ingredients: ["Chicken", "Pita", "Tahini", "Pickles", "Tomatoes"] },
  ],
  seafood: [
    { name: "Grilled Salmon", desc: "Fresh Atlantic salmon with lemon", emoji: "🐟", ingredients: ["Salmon", "Lemon", "Dill", "Garlic", "Olive Oil"] },
    { name: "Shrimp Scampi", desc: "Garlic butter shrimp with pasta", emoji: "🍤", ingredients: ["Shrimp", "Garlic", "Butter", "White Wine", "Pasta"] },
    { name: "Fish Tacos", desc: "Battered fish in soft tortillas", emoji: "🌮", ingredients: ["White Fish", "Tortillas", "Cabbage", "Lime", "Chipotle Mayo"] },
    { name: "Lobster Roll", desc: "Maine lobster in a toasted bun", emoji: "🦞", ingredients: ["Lobster", "Mayo", "Celery", "Lemon", "Hot Dog Bun"] },
  ],
  grill: [
    { name: "Ribeye Steak", desc: "Premium cut grilled to perfection", emoji: "🥩", ingredients: ["Ribeye", "Salt", "Pepper", "Garlic", "Butter"] },
    { name: "Grilled Chicken", desc: "Marinated chicken breast", emoji: "🍗", ingredients: ["Chicken Breast", "Herbs", "Lemon", "Olive Oil"] },
    { name: "Lamb Chops", desc: "Herb-crusted lamb chops", emoji: "🍖", ingredients: ["Lamb Chops", "Rosemary", "Garlic", "Olive Oil"] },
    { name: "Pork Chops", desc: "Juicy grilled pork chops", emoji: "🥩", ingredients: ["Pork Chops", "Thyme", "Garlic", "Apple Sauce"] },
  ],
  pasta: [
    { name: "Alfredo", desc: "Creamy parmesan sauce with fettuccine", emoji: "🍝", ingredients: ["Fettuccine", "Cream", "Parmesan", "Butter", "Garlic"] },
    { name: "Bolognese", desc: "Rich meat sauce with spaghetti", emoji: "🍝", ingredients: ["Spaghetti", "Ground Beef", "Tomatoes", "Onions", "Wine"] },
    { name: "Pesto Pasta", desc: "Fresh basil pesto with linguine", emoji: "🍝", ingredients: ["Linguine", "Basil", "Pine Nuts", "Parmesan", "Olive Oil"] },
    { name: "Aglio e Olio", desc: "Garlic and olive oil spaghetti", emoji: "🍝", ingredients: ["Spaghetti", "Garlic", "Olive Oil", "Red Pepper Flakes", "Parsley"] },
  ],
  sandwiches: [
    { name: "Club Sandwich", desc: "Triple-decker with turkey and bacon", emoji: "🥪", ingredients: ["Turkey", "Bacon", "Lettuce", "Tomato", "Mayo", "Bread"] },
    { name: "BLT", desc: "Bacon, lettuce, and tomato classic", emoji: "🥪", ingredients: ["Bacon", "Lettuce", "Tomato", "Mayo", "Toast"] },
    { name: "Reuben", desc: "Corned beef with sauerkraut", emoji: "🥪", ingredients: ["Corned Beef", "Sauerkraut", "Swiss Cheese", "Russian Dressing", "Rye Bread"] },
    { name: "Philly Cheesesteak", desc: "Thinly sliced beef with cheese", emoji: "🥖", ingredients: ["Ribeye", "Provolone", "Onions", "Peppers", "Hoagie Roll"] },
  ],
  soups: [
    { name: "Tomato Soup", desc: "Creamy tomato soup with basil", emoji: "🍲", ingredients: ["Tomatoes", "Cream", "Basil", "Garlic", "Vegetable Stock"] },
    { name: "Chicken Noodle", desc: "Classic comfort soup", emoji: "🍜", ingredients: ["Chicken", "Noodles", "Carrots", "Celery", "Chicken Broth"] },
    { name: "Minestrone", desc: "Italian vegetable soup", emoji: "🍲", ingredients: ["Vegetables", "Beans", "Pasta", "Tomatoes", "Parmesan"] },
    { name: "French Onion", desc: "Caramelized onions with cheese", emoji: "🧅", ingredients: ["Onions", "Beef Stock", "Gruyere", "Bread", "Thyme"] },
  ],
  appetizers: [
    { name: "Mozzarella Sticks", desc: "Breaded and fried mozzarella", emoji: "🧀", ingredients: ["Mozzarella", "Breadcrumbs", "Eggs", "Marinara Sauce"] },
    { name: "Bruschetta", desc: "Toasted bread with tomato topping", emoji: "🍞", ingredients: ["Baguette", "Tomatoes", "Basil", "Garlic", "Olive Oil"] },
    { name: "Buffalo Wings", desc: "Spicy chicken wings with blue cheese", emoji: "🍗", ingredients: ["Chicken Wings", "Hot Sauce", "Butter", "Blue Cheese"] },
    { name: "Nachos", desc: "Tortilla chips with cheese and toppings", emoji: "🧀", ingredients: ["Tortilla Chips", "Cheese", "Jalapeños", "Salsa", "Sour Cream"] },
  ],
  bbq: [
    { name: "Pulled Pork", desc: "Slow-cooked shredded pork", emoji: "🍖", ingredients: ["Pork Shoulder", "BBQ Sauce", "Coleslaw", "Buns"] },
    { name: "Brisket", desc: "Smoked beef brisket", emoji: "🥩", ingredients: ["Beef Brisket", "Dry Rub", "BBQ Sauce", "Pickles"] },
    { name: "Smoked Ribs", desc: "Fall-off-the-bone ribs", emoji: "🍖", ingredients: ["Pork Ribs", "Dry Rub", "BBQ Sauce", "Apple Wood"] },
    { name: "BBQ Chicken", desc: "Grilled chicken with BBQ glaze", emoji: "🍗", ingredients: ["Chicken", "BBQ Sauce", "Dry Rub", "Butter"] },
  ],
  sushi: [
    { name: "California Roll", desc: "Crab and avocado roll", emoji: "🍣", ingredients: ["Crab", "Avocado", "Cucumber", "Rice", "Nori"] },
    { name: "Salmon Nigiri", desc: "Fresh salmon on rice", emoji: "🍣", ingredients: ["Salmon", "Sushi Rice", "Wasabi", "Soy Sauce"] },
    { name: "Spicy Tuna Roll", desc: "Tuna with spicy mayo", emoji: "🍣", ingredients: ["Tuna", "Spicy Mayo", "Cucumber", "Rice", "Nori"] },
    { name: "Dragon Roll", desc: "Eel and avocado roll", emoji: "🍣", ingredients: ["Eel", "Avocado", "Cucumber", "Rice", "Eel Sauce"] },
  ],
  indian: [
    { name: "Butter Chicken", desc: "Creamy tomato-based curry", emoji: "🍛", ingredients: ["Chicken", "Tomatoes", "Cream", "Butter", "Spices"] },
    { name: "Tikka Masala", desc: "Grilled chicken in spiced sauce", emoji: "🍛", ingredients: ["Chicken", "Yogurt", "Tomatoes", "Cream", "Garam Masala"] },
    { name: "Biryani", desc: "Fragrant rice with meat", emoji: "🍚", ingredients: ["Basmati Rice", "Chicken", "Saffron", "Spices", "Yogurt"] },
    { name: "Naan Bread", desc: "Fluffy Indian flatbread", emoji: "🫓", ingredients: ["Flour", "Yogurt", "Yeast", "Butter", "Garlic"] },
  ],
  chinese: [
    { name: "Kung Pao Chicken", desc: "Spicy chicken with peanuts", emoji: "🥘", ingredients: ["Chicken", "Peanuts", "Peppers", "Soy Sauce", "Chili"] },
    { name: "Sweet and Sour Pork", desc: "Crispy pork with tangy sauce", emoji: "🍖", ingredients: ["Pork", "Pineapple", "Peppers", "Sweet and Sour Sauce"] },
    { name: "Dumplings", desc: "Steamed pork dumplings", emoji: "🥟", ingredients: ["Pork", "Cabbage", "Ginger", "Soy Sauce", "Dumpling Wrappers"] },
    { name: "Lo Mein", desc: "Stir-fried noodles with vegetables", emoji: "🍜", ingredients: ["Noodles", "Vegetables", "Soy Sauce", "Sesame Oil"] },
  ],
  japanese: [
    { name: "Teriyaki Bowl", desc: "Grilled chicken with teriyaki sauce", emoji: "🍱", ingredients: ["Chicken", "Teriyaki Sauce", "Rice", "Broccoli"] },
    { name: "Tempura", desc: "Battered and fried seafood", emoji: "🍤", ingredients: ["Shrimp", "Vegetables", "Tempura Batter", "Dipping Sauce"] },
    { name: "Katsu Curry", desc: "Breaded pork with Japanese curry", emoji: "🍛", ingredients: ["Pork", "Curry Sauce", "Rice", "Cabbage"] },
    { name: "Miso Soup", desc: "Traditional Japanese soup", emoji: "🍲", ingredients: ["Miso Paste", "Tofu", "Seaweed", "Green Onions", "Dashi"] },
  ],
  french: [
    { name: "Croissant", desc: "Buttery flaky pastry", emoji: "🥐", ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar"] },
    { name: "Coq au Vin", desc: "Chicken braised in red wine", emoji: "🍗", ingredients: ["Chicken", "Red Wine", "Bacon", "Mushrooms", "Onions"] },
    { name: "Ratatouille", desc: "Provençal vegetable stew", emoji: "🍆", ingredients: ["Eggplant", "Zucchini", "Tomatoes", "Peppers", "Herbs"] },
    { name: "Crème Brûlée", desc: "Custard with caramelized sugar", emoji: "🍮", ingredients: ["Cream", "Eggs", "Sugar", "Vanilla"] },
  ],
  greek: [
    { name: "Moussaka", desc: "Layered eggplant and meat casserole", emoji: "🍆", ingredients: ["Eggplant", "Ground Beef", "Béchamel", "Tomatoes", "Cheese"] },
    { name: "Gyro", desc: "Sliced meat in pita with tzatziki", emoji: "🥙", ingredients: ["Lamb", "Pita", "Tzatziki", "Tomatoes", "Onions"] },
    { name: "Spanakopita", desc: "Spinach and feta pie", emoji: "🥧", ingredients: ["Spinach", "Feta", "Phyllo Dough", "Onions", "Dill"] },
    { name: "Souvlaki", desc: "Grilled meat skewers", emoji: "�串", ingredients: ["Pork", "Lemon", "Oregano", "Olive Oil", "Pita"] },
  ],
  thai: [
    { name: "Green Curry", desc: "Spicy coconut curry", emoji: "🍛", ingredients: ["Chicken", "Coconut Milk", "Green Curry Paste", "Bamboo", "Basil"] },
    { name: "Tom Yum", desc: "Hot and sour soup", emoji: "🍲", ingredients: ["Shrimp", "Lemongrass", "Lime", "Chili", "Mushrooms"] },
    { name: "Pad See Ew", desc: "Stir-fried wide noodles", emoji: "🍜", ingredients: ["Rice Noodles", "Soy Sauce", "Chinese Broccoli", "Eggs"] },
    { name: "Mango Sticky Rice", desc: "Sweet coconut rice with mango", emoji: "🥭", ingredients: ["Sticky Rice", "Mango", "Coconut Milk", "Sugar"] },
  ],
  korean: [
    { name: "Bibimbap", desc: "Mixed rice with vegetables and egg", emoji: "🍚", ingredients: ["Rice", "Vegetables", "Beef", "Egg", "Gochujang"] },
    { name: "Korean BBQ", desc: "Grilled marinated beef", emoji: "🥩", ingredients: ["Beef", "Soy Sauce", "Sesame Oil", "Garlic", "Sugar"] },
    { name: "Kimchi Stew", desc: "Spicy fermented cabbage stew", emoji: "🍲", ingredients: ["Kimchi", "Pork", "Tofu", "Gochugaru", "Green Onions"] },
    { name: "Tteokbokki", desc: "Spicy rice cakes", emoji: "🍘", ingredients: ["Rice Cakes", "Gochujang", "Fish Cakes", "Green Onions"] },
  ]
};

function generateDishes(): Dish[] {
  const allDishes: Dish[] = [];
  let dishCounter = 0;
  
  categories.forEach((category, catIndex) => {
    const templates = dishTemplates[category.id as keyof typeof dishTemplates] || dishTemplates.spicy;
    
    for (let i = 0; i < 100; i++) {
      const template = templates[i % templates.length];
      const variation = Math.floor(i / templates.length) + 1;
      const modelIndex = dishCounter % modelPaths.length;
      const imageIndex = dishCounter % imagePaths.length;
      
      const calorieBase = 200 + (i * 5) % 600;
      
      allDishes.push({
        id: `${category.id}-${i + 1}`,
        categoryId: category.id,
        name: variation > 1 ? `${template.name} ${variation}` : template.name,
        description: template.desc,
        calories: calorieBase,
        ingredients: template.ingredients,
        emoji: template.emoji,
        image: imagePaths[imageIndex],
        modelPath: modelPaths[modelIndex]
      });
      
      dishCounter++;
    }
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
