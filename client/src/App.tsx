import { AnimatePresence } from "framer-motion";
import { useARMenu } from "./lib/stores/useARMenu";
import { LoadingScreen } from "./components/LoadingScreen";
import { CategoryRingsScreen } from "./components/CategoryRingsScreen";
import { DishListScreen } from "./components/DishListScreen";
import { DishDetailScreen } from "./components/DishDetailScreen";
import { ARScreen } from "./components/ARScreen";
import "@fontsource/inter";

function App() {
  const currentScreen = useARMenu(state => state.currentScreen);
  
  console.log('App: Current screen is', currentScreen);

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {currentScreen === "loading" && <LoadingScreen key="loading" />}
        {currentScreen === "categories" && <CategoryRingsScreen key="categories" />}
        {currentScreen === "dishList" && <DishListScreen key="dishList" />}
        {currentScreen === "dishDetail" && <DishDetailScreen key="dishDetail" />}
        {currentScreen === "ar" && <ARScreen key="ar" />}
      </AnimatePresence>
    </div>
  );
}

export default App;
