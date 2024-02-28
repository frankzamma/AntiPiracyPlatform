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
            <div className="container">
                <h1>Richieste Effettuate</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ip Address</th>
                        <th>Description</th>
                        <th>Categoria</th>
                        <th>Image</th>
                        <th>Verified</th>
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