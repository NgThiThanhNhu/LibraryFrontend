import { createContext, useContext } from "react";
import type { AuthContextType } from "../../types/Authentication/AuthContextType";

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
