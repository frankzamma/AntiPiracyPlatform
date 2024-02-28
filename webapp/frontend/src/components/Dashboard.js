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
            <div style={{textAlign: 'center'}}>
                <TitolareDeiServiziNav/>
                <div style={{marginTop: '20px'}}></div>
                <div className="card" style={{display: 'inline-block', width: '50%', maxWidth: '400px'}}>
                    <div className="card-header">
                        <strong>Benvenuto!</strong>
                    </div>
                    <div className="card-body">
                        <blockquote className="blockquote mb-0">
                            <p>Benvenuto utente di: Org1</p>
                        </blockquote>
                    </div>
                </div>
            </div>
        )
    } else if (orgName == "Org2") {
        return (
            <div style={{textAlign: 'center'}}>
                <OperatoreNav/>
                <div style={{marginTop: '20px'}}></div>
                <div className="card" style={{display: 'inline-block', width: '50%', maxWidth: '400px'}}>
                    <div className="card-header">
                        <strong>Benvenuto!</strong>
                    </div>
                    <div className="card-body">
                        <blockquote className="blockquote mb-0">
                            <p>Benvenuto utente di: Org2</p>
                        </blockquote>
                    </div>
                </div>
            </div>


        )
    } else {
        return <Navigate to="/login" replace/>;
    }

}

export default Dashboard;