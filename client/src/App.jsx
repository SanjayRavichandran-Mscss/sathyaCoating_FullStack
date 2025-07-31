// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/Login/Login";
// import CreateReckoner from "./components/ServiceProjects/CreateReckoner";
// import DisplayReckoner from "./components/ServiceProjects/DisplayReckoner";
// import Worksheets from "./components/ServiceProjects/WorkSheets";
// import AdminDashboard from "./components/Dashboard/AdminDashboard/AdminDashboard";
// import SuperAdminDashboard from "./components/Dashboard/SuperAdminDashboard/SuperAdminDashboard";
// import SiteInchargeDashboard from "./components/Dashboard/SiteInchargeDashboard/SiteInchargeDashboard";
// import AccountantDashboard from "./components/Dashboard/AccountantDashboard/AccountantDashboard";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>  
//           <Route path="/" element={<Login />} />
//           <Route
//             path="/superadmin/:encodedUserId"
//             element={
//               <ProtectedRoute role="superadmin">
//                 <SuperAdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/:encodedUserId"
//             element={
//               <ProtectedRoute role="admin">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/site-incharge/:encodedUserId"
//             element={
//               <ProtectedRoute role="site incharge">
//                 <SiteInchargeDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/accounts-team/:encodedUserId"
//             element={
//               <ProtectedRoute role="accounts_team">
//                 <AccountantDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/create-reckoner" element={<CreateReckoner />} />
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

// Existing imports
import Login from "./components/Login/Login";
import CreateReckoner from "./components/ServiceProjects/CreateReckoner";
import DisplayReckoner from "./components/ServiceProjects/DisplayReckoner";
import Worksheets from "./components/ServiceProjects/WorkSheets";
import AdminDashboard from "./components/Dashboard/AdminDashboard/AdminDashboard";
import SuperAdminDashboard from "./components/Dashboard/SuperAdminDashboard/SuperAdminDashboard";
import SiteInchargeDashboard from "./components/Dashboard/SiteInchargeDashboard/SiteInchargeDashboard";
import AccountantDashboard from "./components/Dashboard/AccountantDashboard/AccountantDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>  
          <Route path="/" element={<Login />} />
          <Route
            path="/superadmin/:encodedUserId"
            element={
              <ProtectedRoute role="superadmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/:encodedUserId"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/site-incharge/:encodedUserId"
            element={
              <ProtectedRoute role="site incharge">
                <SiteInchargeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts-team/:encodedUserId"
            element={
              <ProtectedRoute role="accounts_team">
                <AccountantDashboard />
              </ProtectedRoute>
            }
          />
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