import { useState, useEffect } from "react";
import axios from "axios";
import {
  Warehouse,
  MapPin,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";

const ViewProjects = () => {
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCompanies, setExpandedCompanies] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedSites, setExpandedSites] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [companiesResponse, projectsResponse] = await Promise.all([
          axios.get("http://localhost:5000/project/companies"),
          axios.get("http://localhost:5000/project/projects-with-sites"),
        ]);
        setCompanies(companiesResponse.data || []);
        setProjects(projectsResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMsg =
          error.response?.data?.error ||
          error.response?.status === 500
            ? "Server error: Unable to fetch data. Please check the server and try again."
            : "Failed to load data. Please try again.";
        setError(errorMsg);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCompany = (companyId) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const toggleSite = (siteId) => {
    setExpandedSites((prev) => ({
      ...prev,
      [siteId]: !prev[siteId],
    }));
  };

  const filteredProjects = selectedCompany === "all"
    ? projects
    : projects.filter((project) => project.company_id === selectedCompany);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Projects by Company</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
          </div>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="all">All Companies</option>
            {companies.map((company) => (
              <option key={company.company_id} value={company.company_id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm animate-fade-in">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
          No companies found.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {companies.map((company) => {
            const companyProjects = filteredProjects.filter(
              (project) => project.company_id === company.company_id
            );
            if (selectedCompany !== "all" && selectedCompany !== company.company_id) {
              return null;
            }
            return (
              <div key={company.company_id}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCompany(company.company_id)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedCompanies[company.company_id] ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-800">
                      {company.company_name}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {companyProjects.length} {companyProjects.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                {expandedCompanies[company.company_id] && (
                  <ul className="ml-4 border-l-2 border-gray-200 divide-y divide-gray-200">
                    {companyProjects.length === 0 ? (
                      <li className="p-3 text-sm text-gray-500 italic">
                        No projects available for {company.company_name}
                      </li>
                    ) : (
                      companyProjects.map((project) => (
                        <li
                          key={project.project_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() => toggleProject(project.project_id)}
                          >
                            <div className="flex items-center space-x-3">
                              {expandedProjects[project.project_id] ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                              )}
                              <Warehouse className="h-5 w-5 text-blue-500" />
                              <span className="font-medium text-gray-800">
                                {project.project_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({project.project_type})
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.sites?.length || 0} {project.sites?.length === 1 ? "site" : "sites"}
                              </span>
                            </div>
                          </div>

                          {expandedProjects[project.project_id] && (
                            <ul className="ml-8 border-l-2 border-gray-200 divide-y divide-gray-200">
                              {!project.sites || project.sites.length === 0 ? (
                                <li className="p-3 text-sm text-gray-500 italic">
                                  No sites available
                                </li>
                              ) : (
                                project.sites.map((site) => (
                                  <li
                                    key={site.site_id}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <div
                                      className="flex items-center justify-between p-3 pl-4 cursor-pointer"
                                      onClick={() => toggleSite(site.site_id)}
                                    >
                                      <div className="flex items-center space-x-3">
                                        {expandedSites[site.site_id] ? (
                                          <ChevronDown className="h-4 w-4 text-gray-500" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-gray-500" />
                                        )}
                                        <MapPin className="h-4 w-4 text-green-500" />
                                        <span className="text-gray-700">
                                          {site.site_name}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                                        <span>PO NUMBER: {site.po_number || "N/A"}</span>
                                      </div>
                                    </div>

                                    {expandedSites[site.site_id] && (
                                      <div className="ml-6 p-3 pl-6 bg-gray-50 text-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <p className="font-medium text-gray-700">
                                              Dates
                                            </p>
                                            <p className="text-gray-600">
                                              Start: {site.start_date ? new Date(site.start_date).toLocaleDateString() : "N/A"}
                                            </p>
                                            <p className="text-gray-600">
                                              End: {site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A"}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="font-medium text-gray-700">
                                              Details
                                            </p>
                                            <p className="text-gray-600">
                                              Incharge: {site.incharge_type || "N/A"}
                                            </p>
                                            <p className="text-gray-600">
                                              Location: {site.location_name || "N/A"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </li>
                                ))
                              )}
                            </ul>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewProjects;