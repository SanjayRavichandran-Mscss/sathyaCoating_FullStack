// import React, { useState } from "react";
// import {
//   Calculator,
//   ClipboardList,
//   Building2,
//   ListTree,
//   SquareMenu,
//   X,
//   LayoutDashboard,
// } from "lucide-react";

// const ServiceMenu = ({ onMenuSelect, activeMenu }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const menuItems = [
//     {
//       id: "createReckoner",
//       label: "Create Reckoner",
//       icon: <Calculator size={24} />,
//       active: activeMenu === "createReckoner",
//     },
//     {
//       id: "displayReckoner",
//       label: "View Reckoners",
//       icon: <ClipboardList size={24} />,
//       active: activeMenu === "displayReckoner",
//     },
//     {
//       id: "viewCompanies",
//       label: "Manage Companies",
//       icon: <Building2 size={24} />,
//       active: activeMenu === "viewCompanies",
//     },
//     {
//       id: "viewProjects",
//       label: "Manage Projects",
//       icon: <ListTree size={24} />,
//       active: activeMenu === "viewProjects",
//     },
//   ];

//   const handleMenuClick = (menuId) => {
//     onMenuSelect(menuId);
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-indigo-700 to-blue-700 shadow-lg">
//         <div className="flex items-center text-white">
//           <LayoutDashboard className="mr-2" size={28} />
//           <span className="font-semibold text-xl">Dashboard</span>
//         </div>
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="p-2 rounded-full text-white hover:bg-indigo-800 transition-all duration-200"
//           aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <SquareMenu size={24} />}
//         </button>
//       </div>

//       <div
//         className={`h-full transition-all duration-300 flex flex-col bg-gradient-to-b from-indigo-700 to-blue-700 shadow-2xl
//           ${isMobileMenuOpen ? "block absolute top-0 left-0 w-72 z-50" : "hidden md:flex"}
//           ${isExpanded ? "w-72" : "w-20"}`}
//         onMouseEnter={() => setIsExpanded(true)}
//         onMouseLeave={() => setIsExpanded(false)}
//       >
//         <div className="p-5 flex items-center text-white border-b border-indigo-600/30">
//           <LayoutDashboard size={30} className="mr-3" />
//           {isExpanded && <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>}
//         </div>

//         <nav className="flex-1 pt-4 px-3 space-y-2">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`w-full flex items-center p-3 rounded-xl transition-all duration-200
//                 ${item.active ? "bg-white/20 text-white shadow-lg" : "text-white/90 hover:bg-white/15 hover:text-white"}`}
//               title={isExpanded ? "" : item.label}
//             >
//               <span className={`${item.active ? "text-white" : "text-white/90"}`}>{item.icon}</span>
//               {isExpanded && (
//                 <span className="ml-4 text-base font-medium tracking-wide">{item.label}</span>
//               )}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default ServiceMenu;









import React, { useState } from "react";
import {
  Calculator,
  ClipboardList,
  Building2,
  ListTree,
  SquareMenu,
  X,
  LayoutDashboard,
} from "lucide-react";

const ServiceMenu = ({ onMenuSelect, activeMenu }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "createReckoner",
      label: "Create Reckoner",
      icon: <Calculator size={24} />,
      active: activeMenu === "createReckoner",
    },
    {
      id: "displayReckoner",
      label: "View Reckoners",
      icon: <ClipboardList size={24} />,
      active: activeMenu === "displayReckoner",
    },
    {
      id: "viewCompanies",
      label: "Manage Companies",
      icon: <Building2 size={24} />,
      active: activeMenu === "viewCompanies",
    },
    {
      id: "viewProjects",
      label: "Manage Projects",
      icon: <ListTree size={24} />,
      active: activeMenu === "viewProjects",
    },
  ];

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-indigo-700 to-blue-700 shadow-lg">
        <div className="flex items-center text-white">
          <LayoutDashboard className="mr-2" size={28} />
          <span className="font-semibold text-xl tracking-tight">Dashboard</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full text-white hover:bg-indigo-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <SquareMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`h-full transition-all duration-300 flex flex-col bg-gradient-to-b from-indigo-700 to-blue-700 shadow-2xl
          ${isMobileMenuOpen ? "block absolute top-0 right-0 w-72 z-50" : "hidden md:flex"}
          ${isExpanded ? "w-72" : "w-16"}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4 flex items-center text-white border-b border-indigo-600/30">
          <LayoutDashboard size={28} className="mr-3" />
          {isExpanded && <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>}
        </div>

        <nav className="flex-1 pt-4 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-800">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-2
                ${item.active ? "bg-white/20 text-white shadow-md" : "text-white/90 hover:bg-white/15 hover:text-white"}
                focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              title={isExpanded ? "" : item.label}
              aria-label={item.label}
            >
              <span className={`${item.active ? "text-white" : "text-white/90"}`}>{item.icon}</span>
              {isExpanded && (
                <span className="ml-4 text-sm font-medium tracking-wide">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ServiceMenu;