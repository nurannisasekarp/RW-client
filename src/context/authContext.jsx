import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    useEffect(() => {
        const verifyUser = async () => {
            if (cookies.access_token) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/auth/profile`, {
                        headers: { Authorization: `Bearer ${cookies.access_token}` }
                    });
                    if (response.status === 200) {
                        setUser({ 
                            name: response.data.data.name,
                            id: response.data.data.id,
                            role: {
                                id: response.data.data.role.id,
                                name: response.data.data.role.name,
                            },
                            image_url: response.data.data.image_url,
                         });
                    } else {
                        logout();
                    }
                } catch {
                    logout();
                }
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };
        verifyUser();
    }, [cookies.access_token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/auth/login`, {
                email,
                password
            });

            if (response.status === 200) {
                const { access_token } = response.data;
                
                // Set cookie with the access token
                setCookie('access_token', access_token, {
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });

                // Verify and set user
                const profileResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/auth/profile`, {
                    headers: { Authorization: `Bearer ${access_token}` }
                });

                setUser({ 
                    name: profileResponse.data.data.name,
                    id: profileResponse.data.data.id,
                    role: {
                        id: profileResponse.data.data.role.id,
                        name: profileResponse.data.data.role.name,
                    },
                    image_url: profileResponse.data.data.image_url,
                });

                return true;
            }
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        removeCookie('access_token', { path: '/' });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);