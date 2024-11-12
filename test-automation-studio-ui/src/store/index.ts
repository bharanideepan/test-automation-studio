import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./rootReducer";

const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

export type AppStore = ReturnType<typeof setupStore>
export default setupStore();
