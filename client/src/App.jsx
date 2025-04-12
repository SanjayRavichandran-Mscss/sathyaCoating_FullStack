// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CreateCompanyProject from "./components/CreateCompany";
// import CreateReckoner from "./components/CreateReckoner";
// import DisplayReckoner from "./components/DisplayReckoner";
// import Worksheets from "./components/WorkSheets";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<CreateCompanyProject />} />
//           <Route path="/create-reckoner" element={<CreateReckoner />} />
//           <Route path="/display-reckoner" element={<DisplayReckoner />} />
//           <Route path="/worksheets" element={<Worksheets />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



























import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateCompanyProject from "./components/CreateCompany";
import CreateReckoner from "./components/CreateReckoner";
import DisplayReckoner from "./components/DisplayReckoner";
import Worksheets from "./components/WorkSheets";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CreateCompanyProject />} />
          <Route path="/create-reckoner" element={<CreateReckoner />} />
          <Route path="/display-reckoner" element={<DisplayReckoner />} />
          {/* Updated Worksheets route to include dynamic parameters */}
          <Route 
            path="/worksheets/:site_id/:report_type_id" 
            element={<Worksheets />} 
          />
          {/* Optional: Add a redirect or default view for /worksheets without parameters */}
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