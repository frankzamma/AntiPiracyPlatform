import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Login.css"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const { setToken } = useContext(AuthContext);
    const { setOrgName } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/login", {
                username,
                password,
            });
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);

            setOrgName(response.data.org);
            sessionStorage.setItem("orgName", response.data.org)
            navigate("/");
        } catch (error) {
            console.error("Authentication failed:", error);
            setToken(null);
            localStorage.removeItem("token");
            sessionStorage.removeItem("orgName")
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Errore inaspettato. Riprovare");
            }
        }
    };

    return (
        <div className="container text-center">
            <div className="row align-items-center"></div>
            <br/>
            {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}{" "}
            <div className="row align-items-center">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>

                    <input className="form-control"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           placeholder="Username"
                           type="text"
                           required
                    />
                    <br/>
                    <input className="form-control"
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="Password"
                           required
                    />
                    <br/>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;