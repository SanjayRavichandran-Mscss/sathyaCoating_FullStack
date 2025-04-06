import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  PlusCircle,
  X,
  Edit,
  FolderPlus,
  Network,
  Table,
  MapPin,
  PlusSquare,
} from "lucide-react";
import Swal from "sweetalert2";

const CreateCompanyProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    address: "",
    location_name: "",
    spoc_name: "",
    spoc_contact_no: "",
  });
  const [projectFormData, setProjectFormData] = useState({
    project_type: "",
    project_name: "",
    site_name: "",
    po_number: "",
    start_date: "",
    end_date: "",
    incharge_type: "",
    workforce_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCompanyId, setEditCompanyId] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [visibleCompanies, setVisibleCompanies] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [workforceTypes, setWorkforceTypes] = useState([]);
  const [siteIncharges, setSiteIncharges] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [groupedProjects, setGroupedProjects] = useState({});

  console.log(projectsList);

  const navigateToReckoner = (site) => {
    navigate("/create-reckoner", {
      state: {
        companyName: companies.find((c) => c.company_id === selectedCompanyId)
          ?.company_name,
        locationName: companies.find((c) => c.company_id === selectedCompanyId)
          ?.location_name,
        projectName: site.project_name,
        siteName: site.site_name,
        poNumber: site.po_number,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get(
          "http://localhost:5000/project/companies"
        );
        setCompanies(companiesResponse.data);

        const projectTypesResponse = await axios.get(
          "http://localhost:5000/project/project-type"
        );
        setProjectTypes(projectTypesResponse.data);

        const workforceTypesResponse = await axios.get(
          "http://localhost:5000/project/workforce-types"
        );
        setWorkforceTypes(workforceTypesResponse.data);

        const siteInchargesResponse = await axios.get(
          "http://localhost:5000/project/site-incharges"
        );
        setSiteIncharges(siteInchargesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchProjects = async (companyId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/project/projects-with-sites/${companyId}`
      );
      setProjectsList(response.data);
      const grouped = response.data.reduce((acc, project) => {
        const key = `${project.project_name}|${project.project_type}`;
        if (!acc[key]) {
          acc[key] = {
            project_name: project.project_name,
            project_type: project.project_type,
            sites: [...project.sites],
          };
        } else {
          acc[key].sites = [...acc[key].sites, ...project.sites];
        }
        return acc;
      }, {});

      setGroupedProjects(grouped);
      setSelectedCompanyId(companyId);
      setShowProjects(true);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch projects. Please try again.",
      });
    }
  };

  const viewProjectDetails = (projectKey) => {
    const project = groupedProjects[projectKey];
    setSelectedProjectDetails([project]);
    setShowProjectDetails(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (e) => {
    setProjectFormData({ ...projectFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (editMode) {
        response = await axios.put(
          `http://localhost:5000/project/update/${editCompanyId}`,
          formData
        );
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Company details updated successfully!",
        });
        setCompanies(
          companies.map((company) =>
            company.company_id === editCompanyId
              ? { ...company, ...formData }
              : company
          )
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/project/create",
          formData
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Project Created! Company ID: ${response.data.company_id}, Location ID: ${response.data.location_id}`,
        });
        setCompanies([...companies, response.data]);
      }
      setFormData({
        company_name: "",
        address: "",
        location_name: "",
        spoc_name: "",
        spoc_contact_no: "",
      });
      setShowForm(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to process request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...projectFormData,
        company_name: selectedCompanyName,
      };
      const response = await axios.post(
        "http://localhost:5000/project/create-project-site",
        projectData
      );
      Swal.fire({
        icon: "success",
        title: "Project Created!",
        text: `Project ${response.data.project_name} created successfully for ${selectedCompanyName}`,
      });
      setProjectFormData({
        project_type: "",
        project_name: "",
        site_name: "",
        po_number: "",
        start_date: "",
        end_date: "",
        incharge_type: "",
        workforce_type: "",
      });
      setShowProjectForm(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to create project. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setFormData({ ...company });
    setEditCompanyId(company.company_id);
    setEditMode(true);
    setShowForm(true);
  };

  const handleAddProject = (company) => {
    setSelectedCompanyName(company.company_name);
    setShowProjectForm(true);
  };

  const toggleVisibility = (companyId) => {
    setVisibleCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  return (
    <div className="flex h-screen">
      {/* Companies List Container */}
      <div className="w-1/4 m-2 bg-gray-100 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
            }}
            className="text-blue-600 flex items-center text-lg font-semibold"
          >
            <PlusCircle size={24} className="mr-2" /> Create New Company
          </button>
        </div>
        <ul>
          {companies.map((company) => (
            <li
              key={company.company_id}
              className="p-3 bg-white rounded-lg shadow mb-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                  {company.company_name}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleVisibility(company.company_id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                    aria-label="View details"
                  >
                    <Eye
                      size={20}
                      className={
                        visibleCompanies.includes(company.company_id)
                          ? "text-emerald-500"
                          : "text-gray-400 hover:text-gray-600"
                      }
                    />
                  </button>

                  <button
                    onClick={() => fetchProjects(company.company_id)}
                    className="p-1 rounded hover:bg-blue-50 transition-colors"
                    aria-label="View projects"
                  >
                    <Network
                      size={20}
                      className="text-blue-500 hover:text-blue-600"
                    />
                  </button>

                  <button
                    onClick={() => handleEdit(company)}
                    className="p-1 rounded hover:bg-blue-50 transition-colors"
                    aria-label="Edit company"
                  >
                    <Edit
                      size={20}
                      className="text-blue-500 hover:text-blue-600"
                    />
                  </button>

                  <button
                    onClick={() => handleAddProject(company)}
                    className="p-1 rounded hover:bg-purple-50 transition-colors"
                    aria-label="Add project"
                  >
                    <FolderPlus
                      size={20}
                      className="text-purple-500 hover:text-purple-600"
                    />
                  </button>
                </div>
              </div>
              {visibleCompanies.includes(company.company_id) && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg shadow-inner">
                  <p>
                    <strong>Address:</strong> {company.address}
                  </p>
                  <p>
                    <strong>Location:</strong> {company.location_name}
                  </p>
                  <p>
                    <strong>SPOC Name:</strong> {company.spoc_name}
                  </p>
                  <p>
                    <strong>Contact:</strong> {company.spoc_contact_no}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Projects List Container */}
      {showProjects && (
        <div className="w-1/4 m-2 bg-gray-100 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Projects for{" "}
              {
                companies.find((c) => c.company_id === selectedCompanyId)
                  ?.company_name
              }
            </h2>
            <button
              onClick={() => {
                setShowProjects(false);
                setSelectedProjectDetails([]);
                setShowProjectDetails(false);
              }}
              className="text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
          <ul className="space-y-2">
            {Object.keys(groupedProjects).length > 0 ? (
              Object.keys(groupedProjects).map((key) => {
                const project = groupedProjects[key];
                return (
                  <li key={key} className="bg-white rounded-lg shadow p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {project.project_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.project_type}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {project.sites.length} site(s)
                        </div>
                      </div>
                      <button
                        onClick={() => viewProjectDetails(key)}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                        title="View project details"
                      >
                        <Table size={18} />
                      </button>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="p-3 text-center text-gray-500 bg-white rounded-lg shadow">
                No projects found
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Project Details Container */}
      {showProjectDetails && (
        <div className="w-2/4 m-2 bg-gray-100 p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Project Details</h2>
            <button
              onClick={() => {
                setShowProjectDetails(false);
              }}
              className="text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          {selectedProjectDetails.length > 0 ? (
            <div className="space-y-4">
              {selectedProjectDetails.map((project) => (
                <div
                  key={`${project.project_name}_${project.project_type}`}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">
                      {project.project_name} ({project.project_type})
                    </h3>
                  </div>

                  {project.sites.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Site Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              PO Number
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Start Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              End Date
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Incharge
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Workforce
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {project.sites.map((site, index) => (
                            <tr
                              key={`${site.site_id}-${index}`}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                <div className="flex items-center">
                                  <MapPin
                                    size={16}
                                    className="mr-2 text-green-500"
                                  />
                                  {site.site_name}
                                </div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {site.po_number}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {site.start_date}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {site.end_date}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {site.incharge_type}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {site.workforce_type}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => navigateToReckoner(site)}
                                  className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100"
                                  title="Go to Reckoner"
                                >
                                  <PlusSquare size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No site details available for this project
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
              Select projects to view their details
            </div>
          )}
        </div>
      )}

      {/* Company Form */}
      {showForm && (
        <div className="absolute top-10 left-1/3 bg-white shadow-xl rounded-lg p-6 w-96 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {editMode ? "Edit Company" : "Create New Company"}
            </h3>
            <button onClick={() => setShowForm(false)}>
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              name="location_name"
              placeholder="Location Name"
              value={formData.location_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              name="spoc_name"
              placeholder="SPOC Name"
              value={formData.spoc_name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="tel"
              name="spoc_contact_no"
              placeholder="SPOC Contact No"
              value={formData.spoc_contact_no}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : editMode ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      )}

      {/* Project Form */}
      {showProjectForm && (
        <div className="absolute top-10 left-1/3 bg-white shadow-xl rounded-lg p-6 w-96 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Create New Project for {selectedCompanyName}
            </h3>
            <button onClick={() => setShowProjectForm(false)}>
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <select
              name="project_type"
              value={projectFormData.project_type}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Project Type</option>
              {projectTypes.map((type) => (
                <option key={type.type_id} value={type.type_description}>
                  {type.type_description}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="project_name"
              placeholder="Project Name"
              value={projectFormData.project_name}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              name="site_name"
              placeholder="Site Name"
              value={projectFormData.site_name}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              name="po_number"
              placeholder="PO Number"
              value={projectFormData.po_number}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="date"
              name="start_date"
              placeholder="Start Date"
              value={projectFormData.start_date}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="date"
              name="end_date"
              placeholder="End Date"
              value={projectFormData.end_date}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <select
              name="incharge_type"
              value={projectFormData.incharge_type}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Incharge Type</option>
              {siteIncharges.map((incharge) => (
                <option
                  key={incharge.incharge_id}
                  value={incharge.incharge_type}
                >
                  {incharge.incharge_type}
                </option>
              ))}
            </select>
            <select
              name="workforce_type"
              value={projectFormData.workforce_type}
              onChange={handleProjectChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Workforce Type</option>
              {workforceTypes.map((type) => (
                <option key={type.workforce_id} value={type.workforce_type}>
                  {type.workforce_type}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Project"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateCompanyProject;
