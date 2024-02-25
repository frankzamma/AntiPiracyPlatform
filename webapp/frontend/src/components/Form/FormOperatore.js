import {useContext, useState, useEffect} from "react";
import {AuthContext} from "../AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";

import {string} from "prop-types";
import OperatoreNav from "../OperatoreNav";



function  FormOperatore(){
    const { token, loading, orgName} = useContext(AuthContext);
    const[IDrichiesta, setIDrichiesta] = useState("")
    const navigate = useNavigate();
    const [Requests, setRequests] = useState(null)

    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if(orgName != "Org2"){
        return <h1>Non sei autorizzato ad accedere a questa pagina</h1>
    }

    const handleIDrichiesta = (e) =>{
        setIDrichiesta(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!image) {
                return;
            }

            const formData = new FormData()

            formData.append("categoria", categoria)


            const response = await axios.post("/save-request", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            navigate("/dashboard")
        } catch (error) {
            console.error("Send Failed", error);
        }
    };

    useEffect(() => {
        // Effettua una chiamata API per ottenere le richieste
        const fetchRequests = async () => {
            try {
                const response = await axios.get("/get-requests");
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching requests", error);
            }
        };

        fetchRequests();
    }, []);

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
                {requests.map((request) => (
                    <tr key={request.id}>
                        <td>{request.ipAddress}</td>
                        <td>{request.description}</td>
                        <td>
                            <img src={request.imageUrl} alt="Request" style={{ maxWidth: "100px" }} />
                        </td>
                        <td>{request.categoria}</td>
                        <td>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleFormSubmit({ requestId: request.id, /* altre informazioni necessarie */ });
                            }}>
                                {/* Aggiungi qui i campi della form necessari */}
                                <input type="hidden" value={request.id}></input>
                                <button type="submit">Submit</button>
                            </form>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );




}

export default FormOperatore;