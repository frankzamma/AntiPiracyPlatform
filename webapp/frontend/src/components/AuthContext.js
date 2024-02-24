import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // <-- Add a loading state
    const [orgName, setOrgName] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        const storedOrg = sessionStorage.getItem("orgName");
        setOrgName(storedOrg);
        setLoading(false); // Mark loading as complete after setting the token
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken, loading, orgName, setOrgName}}>
            {children}
        </AuthContext.Provider>
    );
};