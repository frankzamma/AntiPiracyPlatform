import {useContext, useState, useEffect} from "react";
import {AuthContext} from "./AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import TitolareDeiServiziNav from "./titolareDeiServiziNav";

function  VisualizzaRichiesteTitolare(){
    const {token, loading, orgName} = useContext(AuthContext);
    const [requests, setRequests] = useState([])


    useEffect(() =>{
        const storedToken = localStorage.getItem("token");
        console.log(storedToken)
        axios.get('http://localhost:3000/requests', {
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

    if(orgName != "Org1"){
        return <h1>Non sei autorizzato ad accedere a questa pagina</h1>
    }


        // Effettua una richiesta GET per ottenere i post


    return (
        <div>
            <TitolareDeiServiziNav/>
            <div style={{marginTop: '20px'}}></div>
            <div className="container">
                <h1 className="text-center">Richieste Effettuate</h1>
                <div style={{marginTop: '10px'}}></div>
                <table className="table table-striped text-center">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ip Address</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Verified</th>
                        <th>SenderOrganization</th>
                        <th>Confirmed</th>
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
                            <td>
                                {request.SenderOrganizationID}
                            </td>
                            <td>
                                {Object.entries(request.Confirmed).map(([key, value]) =>

                                    key + ":" + (value ? "True" : "False")
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );


}

export default VisualizzaRichiesteTitolare;