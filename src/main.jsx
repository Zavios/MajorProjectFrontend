import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from "./App"
import PredictionPage from "./predictions/predictionPage"


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>
          <Route path="prediction" element={<PredictionPage />} />
        </Route>

      </Routes>
    </BrowserRouter>

  </React.StrictMode>
)