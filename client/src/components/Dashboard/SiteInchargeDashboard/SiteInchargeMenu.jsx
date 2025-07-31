import React, { useState } from "react";
import {
  SquareMenu,
  X,
  LayoutDashboard,
  IndianRupee,
} from "lucide-react";

const SiteInchargeMenu = ({ onMenuSelect, activeMenu }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "expenseEntry",
      label: "Expense Entry",
      icon: <IndianRupee size={20} />,
      active: activeMenu === "expenseEntry",
    },
  ];

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
    setIsMobileMenuOpen(false);
  };

  const handleOutsideClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col md:w-64">
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-3 sm:p-4 bg-white/80 backdrop-blur-md shadow-md">
        <div className="flex items-center text-gray-800">
          <LayoutDashboard className="mr-2" size={24} />
          <span className="font-semibold text-lg sm:text-xl">Site Incharge Dashboard</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <SquareMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
          onClick={handleOutsideClick}
        >
          <div
            className="w-72 max-h-[80vh] bg-white/90 backdrop-blur-lg shadow-xl rounded-r-xl p-4 flex flex-col animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-gray-800">
                <LayoutDashboard size={24} className="mr-2" />
                <h2 className="text-lg sm:text-xl font-bold">Site Incharge Dashboard</h2>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-2 text-sm sm:text-base
                    ${item.active ? "bg-indigo-100 text-indigo-800 shadow-md" : "text-gray-800 hover:bg-indigo-50"}
                    focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                  aria-label={item.label}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="ml-3 truncate">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-white/90 backdrop-blur-lg shadow-lg">
        <div className="p-3 sm:p-4 flex items-center border-b border-gray-200">
          <LayoutDashboard size={24} className="mr-2 text-gray-800" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Site Incharge Dashboard</h2>
        </div>
        <nav className="flex-1 p-2 sm:p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 mb-2 text-sm sm:text-base
                ${item.active ? "bg-indigo-100 text-indigo-800 shadow-md" : "text-gray-800 hover:bg-indigo-50"}
                focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              aria-label={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-3 truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SiteInchargeMenu;