import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "./navbar";

function Dashboard() {
    const { token, loading } = useContext(AuthContext);
    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <Navbar/> {/* Includi la Navbar qui */}
            <h1>"Dashboard: Protected Content Here"</h1>
        </div>)
}

export default Dashboard;