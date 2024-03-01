import React, {useContext, useState} from "react";
import {AuthContext} from "../AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
import {string} from "prop-types";
import TitolareDeiServiziNav from "../titolareDeiServiziNav";

function FormTitolareDiritti() {
    const { token, loading, orgName} = useContext(AuthContext);
    const [ipAddress, setIpAddress] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null)
    const [categoria, setCategoria] = useState("");
    const [id, setId] = useState("")
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if(orgName != "Org1"){
        return <h1>Non sei autorizzato ad accedere a questa pagina</h1>
    }


    const handleIdChange = (e) =>{
        setId(e.target.value);
    }

    const handleIpAddressChange = (e) =>{
        setIpAddress(e.target.value);
    }

    const handleDscriptionChange = (e) =>{
        setDescription(e.target.value);
    }

    const handleImagesChange = (e) =>{
        setImage(e.target.files[0])
    }

    const handleCategoriaChange = (e) =>{
        setCategoria(e.target.value)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!image) {
                return;
            }

            const formData = new FormData()

            formData.append("id", id)
            formData.append("ipAddress", ipAddress)
            formData.append("description", description)
            formData.append("file", image)
            formData.append("categoria", categoria)

            console.log("test")
            axios.post("/save-request", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`
                }
            }).then( response =>{
                console.log(response)

                if(response.data.includes("Error")){
                    setErrorMessage(response.data);
                    window.scrollTo(0, 0);
                }else{
                    window.alert("Transazione eseguita:" + response.data)
                    navigate("/visulizza-richieste-effettuate")
                }

            })

        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Errore inaspettato. Riprovare");
            }

            console.log("ERRORE:" + error)
        }
    };

    return (
        <div>
            <TitolareDeiServiziNav></TitolareDeiServiziNav>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}{" "}
            <div style={{marginTop: '20px'}}></div>
            <div className="container" style={{backgroundColor: "white", borderRadius: '10px', padding: '20px'}}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="id" className="form-label">ID</label>
                        <input className="form-control" type="text" id="id" value={id}
                               onChange={handleIdChange} placeholder="ID" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ipInput" className="form-label">IP Address</label>
                        <input className="form-control" type="text" id="ipInput" value={ipAddress}
                               onChange={handleIpAddressChange} placeholder="IP Address" title="Indirizzo Ipv4"
                               pattern="[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" required/>
                    </div>
                    <div>
                        <label htmlFor="description" className="form-label">Description</label>
                        <input className="form-control" type="text" id="description" value={description}
                               onChange={handleDscriptionChange}
                               placeholder="description" required/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Immagini</label>
                        <input className="form-control" type="file" onChange={handleImagesChange} accept="image/*" required/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Categoria</label>
                        <select className="form-select" onChange={handleCategoriaChange}
                                aria-label="Default select example" required>
                            <option value="" selected>Open this select menu</option>
                            <option value="0">Basket</option>
                            <option value="1">Boxing</option>
                            <option value="2">Scherma</option>
                            <option value="3">Calcio</option>
                            <option value="4">Formula 1</option>
                            <option value="5">Moto Gp</option>
                            <option value="6">Nuoto</option>
                            <option value="7">Tennis</option>
                            <option value="8">Pallavolo</option>
                        </select>
                    </div>
                    <br/>
                    <button>Upload</button>
                </form>


                <br/>
                <br/>
            </div>
        </div>


    );


}

export default FormTitolareDiritti;