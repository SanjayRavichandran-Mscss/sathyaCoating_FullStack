// import React, { useRef, useEffect } from "react";
// import {
//   Calculator,
//   ClipboardList,
//   Contact,
//   IndianRupee,
//   HardHat,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
// } from "lucide-react";

// const ServiceMenu = ({ onMenuSelect, activeMenu }) => {
//   const menuRef = useRef(null);

//   const menuItems = [
//     {
//       id: "createReckoner",
//       label: "Create Reckoner",
//       icon: <Calculator size={20} />,
//     },
//     {
//       id: "displayReckoner",
//       label: "View Reckoners",
//       icon: <ClipboardList size={20} />,
//     },
//     {
//       id: "viewCompanyProjectSite",
//       label: "View Company/Project/Site",
//       icon: <Building2 size={20} />,
//     },
//     {
//       id: "employeeDetails",
//       label: "Employee Details",
//       icon: <Contact size={20} />,
//     },

//     {
//       id: "expenseDetails",
//       label: "Expense Details",
//       icon: <IndianRupee size={20} />,
//     },
//   ];

//   const handleMenuClick = (menuId) => {
//     onMenuSelect(menuId);
//   };

//   const renderDesktopMenu = () => {
//     const [showLeftArrow, setShowLeftArrow] = React.useState(false);
//     const [showRightArrow, setShowRightArrow] = React.useState(false);

//     const scrollMenu = (direction) => {
//       if (menuRef.current) {
//         const scrollAmount = direction === "left" ? -200 : 200;
//         menuRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//       }
//     };

//     const checkScrollArrows = () => {
//       if (menuRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
//         setShowLeftArrow(scrollLeft > 0);
//         setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
//       }
//     };

//     useEffect(() => {
//       checkScrollArrows();
//       const handleResize = () => checkScrollArrows();
//       window.addEventListener("resize", handleResize);
//       menuRef.current?.addEventListener("scroll", checkScrollArrows);
//       return () => {
//         window.removeEventListener("resize", handleResize);
//         menuRef.current?.removeEventListener("scroll", checkScrollArrows);
//       };
//     }, []);

//     return (
//       <div className="relative hidden md:flex items-center justify-center w-full">
//         {showLeftArrow && (
//           <button
//             onClick={() => scrollMenu("left")}
//             className="absolute left-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
//             aria-label="Scroll Left"
//           >
//             <ChevronLeft size={20} />
//           </button>
//         )}
//         <nav
//           ref={menuRef}
//           className="flex overflow-x-auto scrollbar-hidden space-x-2 sm:space-x-3 px-10"
//         >
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap
//                 ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//               aria-label={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               <span className="ml-2 truncate">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//         {showRightArrow && (
//           <button
//             onClick={() => scrollMenu("right")}
//             className="absolute right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
//             aria-label="Scroll Right"
//           >
//             <ChevronRight size={20} />
//           </button>
//         )}
//       </div>
//     );
//   };

//   const renderMobileMenu = () => {
//     return (
//       <div className="relative flex md:hidden items-center justify-center w-full px-4">
//         <div
//           className="flex flex-col items-center gap-2 mobile-menu"
//           style={{ width: "fit-content", margin: "0 auto" }}
//         >
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm w-full max-w-xs
//                 ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
//                 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//               aria-label={item.label}
//             >
//               <span className="flex-shrink-0">{item.icon}</span>
//               <span className="ml-2 truncate">{item.label}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full">
//       {renderMobileMenu()}
//       {renderDesktopMenu()}
//     </div>
//   );
// };

// export default ServiceMenu;













import React, { useRef, useEffect } from "react";
import {
  Calculator,
  ClipboardList,
  Contact,
  IndianRupee,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
} from "lucide-react";

const ServiceMenu = ({ onMenuSelect, activeMenu }) => {
  const menuRef = useRef(null);

  const menuItems = [
    {
      id: "createReckoner",
      label: "Create Reckoner",
      icon: <Calculator size={20} />,
    },
    {
      id: "displayReckoner",
      label: "View Reckoners",
      icon: <ClipboardList size={20} />,
    },
    {
      id: "viewCompanyProjectSite",
      label: "View Company/Project/Site",
      icon: <Building2 size={20} />,
    },
    {
      id: "employeeDetails",
      label: "Employee Details",
      icon: <Contact size={20} />,
    },
    {
      id: "expenseDetails",
      label: "Expense Details",
      icon: <IndianRupee size={20} />,
    },
    {
      id: "viewDispatchDetails",
      label: "Dispatch Details",
      icon: <Package size={20} />,
    },
  ];

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
  };

  const renderDesktopMenu = () => {
    const [showLeftArrow, setShowLeftArrow] = React.useState(false);
    const [showRightArrow, setShowRightArrow] = React.useState(false);

    const scrollMenu = (direction) => {
      if (menuRef.current) {
        const scrollAmount = direction === "left" ? -200 : 200;
        menuRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    const checkScrollArrows = () => {
      if (menuRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    useEffect(() => {
      checkScrollArrows();
      const handleResize = () => checkScrollArrows();
      window.addEventListener("resize", handleResize);
      menuRef.current?.addEventListener("scroll", checkScrollArrows);
      return () => {
        window.removeEventListener("resize", handleResize);
        menuRef.current?.removeEventListener("scroll", checkScrollArrows);
      };
    }, []);

    return (
      <div className="relative hidden md:flex items-center justify-center w-full">
        {showLeftArrow && (
          <button
            onClick={() => scrollMenu("left")}
            className="absolute left-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <nav
          ref={menuRef}
          className="flex overflow-x-auto scrollbar-hidden space-x-2 sm:space-x-3 px-10"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base whitespace-nowrap
                ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
                focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              aria-label={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-2 truncate">{item.label}</span>
            </button>
          ))}
        </nav>
        {showRightArrow && (
          <button
            onClick={() => scrollMenu("right")}
            className="absolute right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    );
  };

  const renderMobileMenu = () => {
    return (
      <div className="relative flex md:hidden items-center justify-center w-full px-4">
        <div
          className="flex flex-col items-center gap-2 mobile-menu"
          style={{ width: "fit-content", margin: "0 auto" }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm w-full max-w-xs
                ${item.id === activeMenu ? "bg-indigo-600 text-white shadow-md" : "text-gray-800 hover:bg-indigo-100"}
                focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              aria-label={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-2 truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderMobileMenu()}
      {renderDesktopMenu()}
    </div>
  );
};

export default ServiceMenu;