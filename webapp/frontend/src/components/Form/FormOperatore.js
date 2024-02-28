import {useContext, useState, useEffect} from "react";
import {AuthContext} from "../AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";

import {element, string} from "prop-types";
import OperatoreNav from "../OperatoreNav";



function  FormOperatore(){
    const { token, loading, orgName} = useContext(AuthContext);
    const navigate = useNavigate();
    const [Requests, setRequests] = useState([])

    useEffect(() =>{
        const storedToken = localStorage.getItem("token");
        const orgNameStored = sessionStorage.getItem("orgName");

        console.log(orgNameStored)
        axios.get('http://localhost:3000/requests-not-confirmed-by-op?opid='+orgNameStored, {
            headers: {
                'Authorization': `${storedToken}`
            }
        })
            .then(response => {
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

    const confirmRequest = async (idRequest) => {
        try {

            console.log(idRequest)
            let button = document.getElementById("button" + idRequest)
            button.remove()
            let td = document.getElementById("td" + idRequest)
            td.appendChild(document.createTextNode("Confirmed!"))

            let formData = {
                idRequest: idRequest
            }

            const response = await axios.post("/confirm-request", formData, {
                headers: {
                    'authorization' : token
                }
            })
        } catch (error) {
            console.error("Send Failed", error);
        }
    };

       const handleFormSubmit = async (requestData) => {
        try {
            // Effettua una chiamata API per gestire la sottomissione della form
            const response = await axios.post("/handle-request", requestData); // Sostituisci con l'endpoint corretto
            console.log("Form submitted successfully", response.data);
        } catch (error) {
            console.error("Form submission failed", error);
        }
    };

    return (
        <div>
            <OperatoreNav />
            <div className="container">
                <h1>Richieste Operatore</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Ip Address</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Categoria</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Requests.map((request) => (
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
                            <td id={"td" + request.ID}>
                                <button id={"button" + request.ID} onClick={() => confirmRequest(request.ID)}>Conferma
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );


}

export default FormOperatore;