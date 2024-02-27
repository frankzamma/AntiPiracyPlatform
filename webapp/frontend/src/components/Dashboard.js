import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import TitolareDeiServiziNav from "./titolareDeiServiziNav";
import OperatoreNav from "./OperatoreNav";

function Dashboard() {
    const { token, loading, orgName} = useContext(AuthContext);
    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if(orgName == "Org1"){
        return (
            <div>
                <TitolareDeiServiziNav/> {/* Includi la Navbar qui */}
                <h1>"Benvenuto utente di: Org1"</h1>
            </div>)
    }else if(orgName == "Org2"){
        return (
            <div>
                <OperatoreNav/> {/* Includi la Navbar qui */}
                <h1>"Benvenuto utente di: Org2"</h1>
            </div>)
    }else{
        return <Navigate to="/login" replace />;
    }

}

export default Dashboard;