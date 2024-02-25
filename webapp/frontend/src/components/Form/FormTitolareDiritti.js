import {useContext, useState} from "react";
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
    const navigate = useNavigate();

    if (loading) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if(orgName != "Org1"){
        return <h1>Non sei autorizzato ad accedere a questa pagina</h1>
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
        setCategoria(e.target.selected)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!image) {
                return;
            }

            const formData = new FormData()

            formData.append("ipAddress", ipAddress)
            formData.append("description", description)
            formData.append("file", image)
            formData.append("categoria", categoria)


            const response = await axios.post("/save-request", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`
                }
            })
            navigate("/dashboard")
        } catch (error) {
            window.alert("ERRORE:" + error)
        }
    };

    return (
        <div>
            <TitolareDeiServiziNav></TitolareDeiServiziNav>
            <div className="container" style={{backgroundColor: "white"}}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="ipInput" className="form-label">Ip address</label>
                        <input className="form-control" type="text" id="ipInput" value={ipAddress}
                               onChange={handleIpAddressChange} placeholder="IpAddress"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="form-label">Description</label>
                        <input className="form-control" type="text" id="description" value={description}
                               onChange={handleDscriptionChange}
                               placeholder="description"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Immagini</label>
                        <input className="form-control" type="file" onChange={handleImagesChange}/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Categoria</label>
                        <select className="form-select" onChange={handleCategoriaChange}  aria-label="Default select example">
                            <option selected>Open this select menu</option>
                            <option value="0">Basket</option>
                            <option value="1">Boxing</option>
                            <option value="2">Fencing</option>
                            <option value="3">Football</option>
                            <option value="4">Formula 1</option>
                            <option value="5">Moto Gp</option>
                            <option value="6">Swimming</option>
                            <option value="7">Tennis</option>
                            <option value="8">Volleyball</option>
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