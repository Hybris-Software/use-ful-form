import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";

import Simple from "./pages/simple";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/simple" element={<Simple />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
