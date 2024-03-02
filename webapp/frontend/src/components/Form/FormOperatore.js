import React, {useContext, useState, useEffect} from "react";
import {AuthContext} from "../AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";

import {element, string} from "prop-types";
import OperatoreNav from "../OperatoreNav";



function  FormOperatore(){
    const { token, loading, orgName} = useContext(AuthContext);
    const [Requests, setRequests] = useState([])
    const [errorMessage, setErrorMessage] = useState(null);


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

                if(response.data.includes("Error")){
                    setErrorMessage(response.data);
                    window.scrollTo(0, 0);
                }else {
                    if(!response.data.includes("{")){
                        setErrorMessage("Non ci sono richieste da confermare!")
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
            button.setAttribute("disabled", "disabled")


            let formData = {
                idRequest: idRequest
            }

            const response = await axios.post("/confirm-request", formData, {
                headers: {
                    'authorization' : token
                }
            }).then(response => {
                console.log(response.data)
                if(response.data.includes("Error")){
                    setErrorMessage(response.data);
                    window.scrollTo(0, 0);
                    button.enable()
                }else{
                    let td = document.getElementById("td" + idRequest)
                    td.appendChild(document.createTextNode("Confirmed!"))
                    button.remove()

                    window.alert("Conferma registrata correttamente!")

                }
            })
        } catch (error) {
            console.error("Send Failed", error);
        }
    };


    return (
        <div>
            <OperatoreNav/>
            <div style={{marginTop: '20px'}}></div>
            <div className="container">
                {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}{" "}
                <div style={{marginTop: '20px'}}></div>
                <h1 className="text-center">Richieste Operatore</h1>
                <div style={{marginTop: '10px'}}></div>
                <table className="table table-striped text-center">
                    <thead>
                    <tr>
                        <th>Ip Address</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Categoria</th>
                        <th>SenderOrganizationID</th>
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
                            <td>
                                {request.SenderOrganizationID}
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