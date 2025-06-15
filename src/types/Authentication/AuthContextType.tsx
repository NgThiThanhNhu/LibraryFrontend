import type { UserInfo } from "../../response/Authentication/UserInfo";

export interface AuthContextType {
    user: UserInfo | null
    setUser: (user: UserInfo | null) => void,
    isLoading: boolean
}