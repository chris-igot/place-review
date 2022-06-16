import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginReg from "./pages/loginReg";
import Home from "./pages/home";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginReg />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
