import React, { useEffect, useState } from 'react'
import { AutheticationInfo } from '../../apis'
import type { UserInfo } from '../../response/Authentication/UserInfo'
import { AuthContext } from './AuthContext'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userProvider, setUserProvider] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchDataInfo = async () => {

            try {

                const response = await AutheticationInfo.getInfo();
                if (!response.data) {
                    alert("Bạn chưa đăng nhập")
                }
                setUserProvider(response.data)

            } catch (error) {
                alert("Lỗi" + error)
                setUserProvider(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDataInfo();

    }, [])
    return (
        <AuthContext.Provider value={{ user: userProvider, setUser: setUserProvider, isLoading }}>

            {children}
        </AuthContext.Provider>
    )
}
