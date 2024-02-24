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


function App() {
  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/form-aggiungi-richiesta" element={<FormTitolareDiritti />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
