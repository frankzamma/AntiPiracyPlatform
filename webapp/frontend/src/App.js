import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/LoginForm"
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./components/AuthContext";
import FormTitolareDiritti from "./components/Form/FormTitolareDiritti";
import VisualizerRichiesteTitolare from "./components/VisualizerRichiesteTitolare";
import FormOperatore from "./components/Form/FormOperatore";


function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/board-conferma-richieste" element={<FormOperatore/>}/>
            <Route path="/form-aggiungi-richiesta" element={<FormTitolareDiritti />} />
            <Route path="/visulizza-richieste-effettuate" element={<VisualizerRichiesteTitolare />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
