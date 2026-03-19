import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./hooks/useAuth";
import App from "./App";
import LoginPage from "./auth/loginPage";
import SignupPage from "./auth/signupPage";
import NewChatPage from "./predictions/newChatPage";
import PredictionPage from "./predictions/predictionPage";
import DoctorPage from "./doctor/DoctorPage";
import DoctorRecordsPage from "./doctor/DoctorRecordsPage";
import DoctorLoginPage from "./doctor/doctorLoginPage";
import SetupPage from "./auth/initialSetup";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth — full-screen, no sidebar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Doctor workbench — full-screen, no sidebar */}
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/doctor/login" element={<DoctorLoginPage />} />
          <Route path="/doctor/records" element={<DoctorRecordsPage />} />

          {/* App — with sidebar */}
          <Route path="/" element={<App />}>
            <Route path="/" element={<NewChatPage />} />
            <Route path="newchat" element={<NewChatPage />} />
            <Route path="prediction/:id" element={<PredictionPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
