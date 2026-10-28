import { createContext } from "react";

// Kept in its own module so AuthProvider.jsx exports only a component
// (React fast refresh requirement) and consumers can import the context
// without pulling in the provider implementation.
export const AuthContext = createContext();
