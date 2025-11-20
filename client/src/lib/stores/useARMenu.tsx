import { create } from "zustand";

export type Category = {
  id: string;
  name: string;
  color: string;
  neonColor: string;
  emoji: string;
  description?: string;
};

export type Dish = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  calories: number;
  ingredients: string[];
  emoji: string;
  image: string;
  modelPath: string;
};

export type AppScreen = 
  | "loading" 
  | "categories" 
  | "dishList" 
  | "dishDetail" 
  | "ar";

interface ARMenuState {
  currentScreen: AppScreen;
  selectedCategory: Category | null;
  selectedDish: Dish | null;
  isLoading: boolean;
  
  setScreen: (screen: AppScreen) => void;
  selectCategory: (category: Category) => void;
  selectDish: (dish: Dish) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useARMenu = create<ARMenuState>((set) => ({
  currentScreen: "loading",
  selectedCategory: null,
  selectedDish: null,
  isLoading: false,
  
  setScreen: (screen) => {
    console.log(`useARMenu: setScreen called with "${screen}"`);
    set({ currentScreen: screen });
  },
  selectCategory: (category) => {
    console.log('useARMenu: selectCategory called', category.name);
    set({ selectedCategory: category, currentScreen: "dishList" });
  },
  selectDish: (dish) => {
    console.log('useARMenu: selectDish called', dish.name);
    set({ selectedDish: dish, currentScreen: "dishDetail" });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ 
    currentScreen: "categories", 
    selectedCategory: null, 
    selectedDish: null,
    isLoading: false 
  })
}));
