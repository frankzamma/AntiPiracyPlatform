import {useContext, useState, useEffect} from "react";
import {AuthContext} from "./AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import TitolareDeiServiziNav from "./titolareDeiServiziNav";
import OperatoreNav from "./OperatoreNav";

function  VisualizzaRichiesteConfermateOperatore(){
    const {token, loading, orgName} = useContext(AuthContext);
    const [requests, setRequests] = useState([])


    useEffect(() =>{
        const storedToken = localStorage.getItem("token");
        const storedOrg = sessionStorage.getItem("OrgName");

        console.log(storedToken)
        axios.get('http://localhost:3000/requests-by-op?opid=' + storedOrg, {
            headers: {
                'authorization': `${storedToken}`
            }
        }).then(response => {
                console.log(response.data)
                setRequests(JSON.parse(response.data.substring(10)));
            }).catch(error => {
            console.error('Errore durante la richiesta:', error);
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
            <div className="container">
                <h1>Richieste Confermate</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ip Address</th>
                        <th>Description</th>
                        <th>Categoria</th>
                        <th>Image</th>
                        <th>Verified</th>
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
                                {request.Category}
                            </td>
                            <td>
                                <img src={request.PathImages} alt="Request" style={{maxWidth: "100px"}}/>
                            </td>
                            <td>
                                {request.Verified ? "True" : "False"}
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