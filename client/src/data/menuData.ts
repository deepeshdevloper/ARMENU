import { Category, Dish } from "@/lib/stores/useARMenu";

export const categories: Category[] = [
  {
    id: "starters",
    name: "शुरुआत / Starters",
    color: "#FF9933",
    neonColor: "#FFB366",
    emoji: "🥟"
  },
  {
    id: "veg",
    name: "शाकाहारी / Veg Curry",
    color: "#138808",
    neonColor: "#4CAF50",
    emoji: "🥘"
  },
  {
    id: "nonveg",
    name: "मांसाहारी / Non-Veg",
    color: "#DC2626",
    neonColor: "#EF4444",
    emoji: "🍗"
  },
  {
    id: "breads",
    name: "रोटी / Breads",
    color: "#D4A574",
    neonColor: "#E6C8A0",
    emoji: "🫓"
  },
  {
    id: "rice",
    name: "चावल / Rice & Biryani",
    color: "#8B4513",
    neonColor: "#B8733D",
    emoji: "🍚"
  },
  {
    id: "desserts",
    name: "मिठाई / Desserts",
    color: "#EC4899",
    neonColor: "#F9A8D4",
    emoji: "🍬"
  },
  {
    id: "beverages",
    name: "पेय / Beverages",
    color: "#06B6D4",
    neonColor: "#67E8F9",
    emoji: "🥤"
  }
];

const modelPaths = [
  "/models/samosa.glb",
  "/models/paneer_tikka.glb",
  "/models/palak_paneer.glb",
  "/models/butter_chicken.glb",
  "/models/naan.glb",
  "/models/biryani.glb",
  "/models/gulab_jamun.glb",
  "/models/lassi.glb"
];

const dishImages = {
  starters: [
    "/images/samosa_indian_appeti_61c753a0.jpg",
    "/images/samosa_indian_appeti_51297875.jpg",
    "/images/paneer_tikka_indian__01dee1e2.jpg",
    "/images/paneer_tikka_indian__a19e47f9.jpg"
  ],
  veg: [
    "/images/palak_paneer_spinach_b32aa6e1.jpg",
    "/images/palak_paneer_spinach_0330167f.jpg",
    "/images/palak_paneer_spinach_88ee8bae.jpg",
    "/images/palak_paneer_spinach_9b576870.jpg"
  ],
  nonveg: [
    "/images/butter_chicken_curry_b3ee8d64.jpg",
    "/images/butter_chicken_curry_a02fbf41.jpg",
    "/images/butter_chicken_curry_482a21bc.jpg",
    "/images/butter_chicken_curry_7740a7d4.jpg"
  ],
  breads: [
    "/images/naan_bread_indian_fl_d9f6ba58.jpg",
    "/images/naan_bread_indian_fl_34555510.jpg",
    "/images/naan_bread_indian_fl_c00e2033.jpg",
    "/images/naan_bread_indian_fl_093b2f1a.jpg"
  ],
  rice: [
    "/images/biryani_rice_indian__43785596.jpg",
    "/images/biryani_rice_indian__ef5eaa75.jpg",
    "/images/biryani_rice_indian__793333e1.jpg",
    "/images/biryani_rice_indian__4a18e5dd.jpg"
  ],
  desserts: [
    "/images/gulab_jamun_indian_d_ac32ec73.jpg",
    "/images/gulab_jamun_indian_d_0f10d8af.jpg",
    "/images/gulab_jamun_indian_d_ebf9deaf.jpg",
    "/images/gulab_jamun_indian_d_6cc93511.jpg"
  ],
  beverages: [
    "/images/lassi_mango_indian_b_aecf5eba.jpg",
    "/images/lassi_mango_indian_b_c5b61635.jpg",
    "/images/lassi_mango_indian_b_ce6a32a5.jpg",
    "/images/lassi_mango_indian_b_f01e9328.jpg"
  ]
};

const dishTemplates = {
  starters: [
    { name: "समोसा / Samosa", desc: "Crispy triangular pastry filled with spiced potatoes and peas", emoji: "🥟", ingredients: ["Potatoes", "Peas", "Cumin", "Coriander", "Pastry", "Green Chili"] },
    { name: "आलू टिक्की / Aloo Tikki", desc: "Golden potato patties with tangy tamarind chutney", emoji: "🥔", ingredients: ["Potatoes", "Chickpeas", "Tamarind", "Chaat Masala", "Coriander"] },
    { name: "पनीर टिक्का / Paneer Tikka", desc: "Marinated cottage cheese grilled in tandoor", emoji: "🧀", ingredients: ["Paneer", "Yogurt", "Tandoori Masala", "Bell Peppers", "Onions"] },
    { name: "वेज पकोड़ा / Veg Pakora", desc: "Mixed vegetable fritters with mint chutney", emoji: "🌶️", ingredients: ["Mixed Vegetables", "Gram Flour", "Spices", "Mint", "Coriander"] },
  ],
  veg: [
    { name: "पालक पनीर / Palak Paneer", desc: "Cottage cheese in creamy spinach gravy", emoji: "🥘", ingredients: ["Paneer", "Spinach", "Cream", "Ginger", "Garlic", "Garam Masala"] },
    { name: "दाल मखनी / Dal Makhani", desc: "Black lentils slow-cooked with butter and cream", emoji: "🍲", ingredients: ["Black Lentils", "Kidney Beans", "Butter", "Cream", "Tomatoes", "Spices"] },
    { name: "शाही पनीर / Shahi Paneer", desc: "Royal cottage cheese curry in rich cashew gravy", emoji: "👑", ingredients: ["Paneer", "Cashews", "Cream", "Tomatoes", "Cardamom", "Saffron"] },
    { name: "बैंगन भर्ता / Baingan Bharta", desc: "Smoky roasted eggplant mash with spices", emoji: "🍆", ingredients: ["Eggplant", "Onions", "Tomatoes", "Green Chili", "Coriander", "Cumin"] },
  ],
  nonveg: [
    { name: "बटर चिकन / Butter Chicken", desc: "Tandoori chicken in creamy tomato gravy", emoji: "🍗", ingredients: ["Chicken", "Butter", "Cream", "Tomatoes", "Fenugreek", "Spices"] },
    { name: "चिकन टिक्का मसाला / Chicken Tikka Masala", desc: "Grilled chicken in spiced tomato curry", emoji: "🔥", ingredients: ["Chicken", "Yogurt", "Tomatoes", "Cream", "Garam Masala", "Kasuri Methi"] },
    { name: "रोगन जोश / Rogan Josh", desc: "Aromatic lamb curry from Kashmir", emoji: "🍖", ingredients: ["Lamb", "Yogurt", "Kashmiri Chili", "Fennel", "Ginger", "Cardamom"] },
    { name: "कड़ाही चिकन / Kadai Chicken", desc: "Chicken cooked with bell peppers in karahi", emoji: "🌶️", ingredients: ["Chicken", "Bell Peppers", "Tomatoes", "Onions", "Coriander Seeds", "Dry Red Chili"] },
  ],
  breads: [
    { name: "बटर नान / Butter Naan", desc: "Soft leavened bread brushed with butter", emoji: "🫓", ingredients: ["Flour", "Yogurt", "Yeast", "Butter", "Nigella Seeds"] },
    { name: "लहसुन नान / Garlic Naan", desc: "Naan topped with garlic and coriander", emoji: "🧄", ingredients: ["Flour", "Garlic", "Butter", "Coriander", "Yeast"] },
    { name: "तंदूरी रोटी / Tandoori Roti", desc: "Whole wheat flatbread from tandoor", emoji: "🍞", ingredients: ["Whole Wheat Flour", "Water", "Salt"] },
    { name: "लच्छा पराठा / Laccha Paratha", desc: "Layered whole wheat flatbread", emoji: "🥞", ingredients: ["Whole Wheat Flour", "Ghee", "Salt", "Water"] },
  ],
  rice: [
    { name: "हैदराबादी बिरयानी / Hyderabadi Biryani", desc: "Fragrant basmati rice with spiced chicken", emoji: "🍚", ingredients: ["Basmati Rice", "Chicken", "Yogurt", "Saffron", "Fried Onions", "Whole Spices"] },
    { name: "वेज बिरयानी / Veg Biryani", desc: "Aromatic rice with mixed vegetables", emoji: "🥗", ingredients: ["Basmati Rice", "Mixed Vegetables", "Yogurt", "Saffron", "Mint", "Spices"] },
    { name: "जीरा राइस / Jeera Rice", desc: "Basmati rice tempered with cumin", emoji: "🌾", ingredients: ["Basmati Rice", "Cumin Seeds", "Ghee", "Bay Leaf"] },
    { name: "पुलाव / Pulao", desc: "Mildly spiced vegetable rice", emoji: "🍛", ingredients: ["Basmati Rice", "Peas", "Carrots", "Whole Spices", "Ghee"] },
  ],
  desserts: [
    { name: "गुलाब जामुन / Gulab Jamun", desc: "Sweet milk dumplings in rose-cardamom syrup", emoji: "🍬", ingredients: ["Milk Powder", "Flour", "Sugar", "Rose Water", "Cardamom", "Saffron"] },
    { name: "रसमलाई / Rasmalai", desc: "Cottage cheese patties in sweetened milk", emoji: "🥛", ingredients: ["Paneer", "Milk", "Sugar", "Cardamom", "Saffron", "Pistachios"] },
    { name: "खीर / Kheer", desc: "Traditional rice pudding with nuts", emoji: "🍚", ingredients: ["Rice", "Milk", "Sugar", "Cardamom", "Almonds", "Raisins"] },
    { name: "जलेबी / Jalebi", desc: "Crispy sweet pretzel in sugar syrup", emoji: "🌀", ingredients: ["Flour", "Yogurt", "Sugar", "Saffron", "Cardamom"] },
  ],
  beverages: [
    { name: "आम का लस्सी / Mango Lassi", desc: "Sweet yogurt drink blended with mango", emoji: "🥭", ingredients: ["Yogurt", "Mango", "Sugar", "Cardamom", "Ice"] },
    { name: "मीठी लस्सी / Sweet Lassi", desc: "Traditional churned yogurt beverage", emoji: "🥤", ingredients: ["Yogurt", "Sugar", "Rose Water", "Ice"] },
    { name: "मसाला चाय / Masala Chai", desc: "Spiced milk tea with aromatic herbs", emoji: "☕", ingredients: ["Tea Leaves", "Milk", "Ginger", "Cardamom", "Cinnamon", "Sugar"] },
    { name: "नींबू पानी / Nimbu Pani", desc: "Refreshing Indian lemonade with spices", emoji: "🍋", ingredients: ["Lemon", "Water", "Sugar", "Black Salt", "Cumin Powder", "Mint"] },
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
    const templates = dishTemplates[category.id as keyof typeof dishTemplates] || dishTemplates.starters;
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
