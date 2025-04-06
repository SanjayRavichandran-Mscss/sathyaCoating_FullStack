import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateCompanyProject from "./components/CreateCompany";
import CreateReckoner from "./components/CreateReckoner";
import DisplayReckoner from "./components/DisplayReckoner"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CreateCompanyProject />} />
          <Route path="/create-reckoner" element={<CreateReckoner />} />
          <Route path="/display-reckoner" element={<DisplayReckoner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;