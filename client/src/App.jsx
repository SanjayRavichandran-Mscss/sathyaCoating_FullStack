// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CreateCompanyProject from "./components/CreateCompany";
// import CreateReckoner from "./components/ServiceProjects/CreateReckoner";
// import DisplayReckoner from "./components/ServiceProjects/DisplayReckoner";
// import Worksheets from "./components/ServiceProjects/WorkSheets";
// import ServiceDashboard from "./components/ServiceProjects/ServiceDashboard";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<ServiceDashboard />} />
//           <Route path="/create-reckoner/:site_id" element={<CreateReckoner />} />
//           <Route path="/display-reckoner" element={<DisplayReckoner />} />
//           <Route
//             path="/worksheets/:site_id/:report_type_id"
//             element={<Worksheets />}
//           />
//           <Route
//             path="/worksheets"
//             element={<div>Please select a site and report type</div>}
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;







import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import CreateReckoner from "./components/ServiceProjects/CreateReckoner";
import DisplayReckoner from "./components/ServiceProjects/DisplayReckoner";
import Worksheets from "./components/ServiceProjects/WorkSheets";
import ServiceDashboard from "./components/ServiceProjects/ServiceDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/service-dashboard" element={<ServiceDashboard />} />
          <Route path="/create-reckoner" element={<CreateReckoner />} />
          <Route path="/display-reckoner" element={<DisplayReckoner />} />
          <Route
            path="/worksheets/:site_id/:report_type_id"
            element={<Worksheets />}
          />
          <Route
            path="/worksheets"
            element={<div>Please select a site and report type</div>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;