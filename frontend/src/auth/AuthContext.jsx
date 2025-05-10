import { createContext, useContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// react native state management

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user-profile`, {
                method: "GET",
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                console.log("Full user data fetched:", data);
            } else {
                setUser(null); 
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    return (
        <AuthContext.Provider value={{ user, isAuthLoading, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);