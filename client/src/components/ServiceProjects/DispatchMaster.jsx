import React, { useState } from "react";
import AssignSiteIncharge from "./AssignSiteIncharge";
import AssignMaterial from "./AssignMaterial";
import AssignLabour from "./AssignLabour";
import ViewAssignedIncharges from "./ViewAssignedIncharges";
import ViewAssignedMaterial from "./ViewAssignedMaterial";

const DispatchMaster = () => {
  const [activeSection, setActiveSection] = useState("siteIncharge");

  const renderSection = () => {
    switch (activeSection) {
      // case "siteIncharge":
      //   return <AssignSiteIncharge />;
      case "material":
        return <AssignMaterial />;
      case "labour":
        return <AssignLabour />;
      case "viewIncharges":
        return <ViewAssignedIncharges />;
      case "viewMaterials":
        return <ViewAssignedMaterial />;
      default:
        return <AssignMaterial/>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-3">
          {/* <button
            onClick={() => setActiveSection("siteIncharge")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeSection === "siteIncharge" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-teal-50"}
              focus:outline-none focus:ring-2 focus:ring-teal-400`}
          >
            Assign Site Incharge
          </button> */}
          <button
            onClick={() => setActiveSection("material")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeSection === "material" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-teal-50"}
              focus:outline-none focus:ring-2 focus:ring-teal-400`}
          >
            Assign Material
          </button>
          {/* <button
            onClick={() => setActiveSection("labour")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeSection === "labour" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-teal-50"}
              focus:outline-none focus:ring-2 focus:ring-teal-400`}
          >
            Assign Labour
          </button> */}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* <button
            onClick={() => setActiveSection("viewIncharges")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeSection === "viewIncharges" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-teal-50"}
              focus:outline-none focus:ring-2 focus:ring-teal-400`}
          >
            View Incharge Details
          </button> */}
          <button
            onClick={() => setActiveSection("viewMaterials")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeSection === "viewMaterials" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-teal-50"}
              focus:outline-none focus:ring-2 focus:ring-teal-400`}
          >
            View Material Details
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 min-h-[500px]">
        {renderSection()}
      </div>
    </div>
  );
};

export default DispatchMaster;