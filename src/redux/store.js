import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageModule from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/bookingSlice";

// Handle ESM/CJS interop for redux-persist/lib/storage in Vite
const createFallbackStorage = () => ({
  getItem: (key) =>
    Promise.resolve(typeof window !== "undefined" ? localStorage.getItem(key) : null),
  setItem: (key, value) =>
    Promise.resolve(typeof window !== "undefined" ? localStorage.setItem(key, value) : undefined),
  removeItem: (key) =>
    Promise.resolve(typeof window !== "undefined" ? localStorage.removeItem(key) : undefined),
});

const storage =
  storageModule && typeof storageModule.getItem === "function"
    ? storageModule
    : storageModule?.default && typeof storageModule.default.getItem === "function"
    ? storageModule.default
    : createFallbackStorage();

const persistConfig = {
  key: "mamala_hotel_auth",
  version: 1,
  storage,
  whitelist: ["auth"], // booking state is NOT persisted (ephemeral)
};

const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
