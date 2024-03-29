import React, {useContext, useState, useEffect} from "react";
import {AuthContext} from "./AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import TitolareDeiServiziNav from "./titolareDeiServiziNav";
import OperatoreNav from "./OperatoreNav";
import getCategoryName from "./CategoryNameConverter";

function  VisualizzaRichiesteConfermateOperatore(){
    const {token, loading, orgName} = useContext(AuthContext);
    const [requests, setRequests] = useState([])
    const [errorMessage, setErrorMessage] = useState(null);


    useEffect(() =>{
        const storedToken = localStorage.getItem("token");
        const storedOrg = sessionStorage.getItem("orgName");

        console.log(storedToken)
        axios.get('http://localhost:3000/requests-by-op?opid=' + storedOrg, {
            headers: {
                'authorization': `${storedToken}`
            }
        }).then(response => {
                console.log(response.data)
                if(response.data.includes("Error")){
                    setErrorMessage(response.data);
                    window.scrollTo(0, 0);
                }else{
                    if(!response.data.includes("{")){
                        setErrorMessage("Non ci sono richieste confermate!")
                    }else{
                        setRequests(JSON.parse(response.data.substring(10)));
                    }

                }
            }).catch(error => {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Errore inaspettato. Riprovare");
            }

            console.log("ERRORE:" + error)
        });
    }, [])
    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if(orgName != "Org2"){
        return <h1>Non sei autorizzato ad accedere a questa pagina</h1>
    }


    return (
        <div>
            <OperatoreNav/>
            <div style={{marginTop: '20px'}}></div>
            <div className="container">

                {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}{" "}

                <div style={{marginTop: '20px'}}></div>
                <h1 className="text-center">Richieste Confermate</h1>
                <div style={{marginTop: '10px'}}></div>
                <table className="table table-striped text-center">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ip Address</th>
                        <th>Description</th>
                        <th>Categoria</th>
                        <th>Image</th>
                        <th>Verified</th>
                        <th>SenderOrganization</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((request) => (
                        <tr key={request.ID}>
                            <td>
                                {request.ID}</td>
                            <td>
                                {request.IpAddress}
                            </td>
                            <td>
                                {request.Description}
                            </td>
                            <td>
                                {getCategoryName(request.Category)}                            </td>
                            <td>
                                <img src={request.PathImages} alt="Request" style={{maxWidth: "100px"}}/>
                            </td>
                            <td>
                                {request.Verified ? "True" : "False"}
                            </td>
                            <td>
                                {request.SenderOrganizationID}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );


}

export default VisualizzaRichiesteConfermateOperatore;