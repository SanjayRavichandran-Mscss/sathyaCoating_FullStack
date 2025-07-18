const projectModel = require('../models/projectModel');


exports.getLocations = async (req, res) => {
  const { companyId } = req.params;
  try {
    const query = `
      SELECT l.location_id, l.location_name
      FROM locations l
      JOIN project_details pd ON l.location_id = pd.location_id
      WHERE pd.company_id = $1
    `;
    const { rows } = await pool.query(query, [companyId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// Create a new location
exports.createLocation = async (req, res) => {
  const { location_name, company_id } = req.body;
  try {
    const query = `
      INSERT INTO locations (location_id, location_name)
      VALUES (gen_random_uuid(), $1)
      RETURNING location_id, location_name
    `;
    const { rows } = await pool.query(query, [location_name]);
    const newLocation = rows[0];

    // Associate the location with the company in project_details (if needed)
    // Assuming project_details has a location_id field; adjust as per your schema
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Failed to create location" });
  }
};

exports.createCompany = async (req, res) => {
    try {
        const { company_name, address, spoc_name, spoc_contact_no } = req.body;
        
        if (!company_name || !address || !spoc_name || !spoc_contact_no) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const company_id = await projectModel.generateNewCompanyId();
        
        await projectModel.insertCompany(company_id, company_name, address, null, spoc_name, spoc_contact_no);

        res.status(201).json({ message: "Company created successfully", company_id });
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await projectModel.fetchAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getCompanyById = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const company = await projectModel.fetchCompanyById(companyId);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getProjectsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const projects = await projectModel.fetchProjectsByCompanyId(companyId);
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects by company ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const { company_id, company_name, address, spoc_name, spoc_contact_no } = req.body;

        // Validate required fields and collect missing ones
        const missingFields = [];
        if (!company_id) missingFields.push("company_id");
        if (!company_name) missingFields.push("company_name");
        if (!address) missingFields.push("address");
        if (!spoc_name) missingFields.push("spoc_name");
        if (!spoc_contact_no) missingFields.push("spoc_contact_no");

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
        }

        // Check if company exists
        const company = await projectModel.fetchCompanyById(company_id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        await projectModel.updateCompany(company_id, company_name, address, null, spoc_name, spoc_contact_no);

        res.status(200).json({ message: "Company updated successfully" });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// Fetch all reckoner types

// Fetch all reckoner types
exports.getReckonerTypes = async (req, res) => {
  try {
    const reckonerTypes = await projectModel.getReckonerTypes();
    console.log("Fetched reckoner types:", reckonerTypes);
    res.status(200).json(reckonerTypes);
  } catch (error) {
    console.error("Error fetching reckoner types:", error);
    res.status(500).json({ error: "Failed to fetch reckoner types" });
  }
};

// Fetch next PO number for reckoner type
exports.getNextPoNumber = async (req, res) => {
  try {
    const { reckoner_type_id } = req.params;
    console.log(`Received request for next PO number with reckoner_type_id: ${reckoner_type_id}`);
    const nextPoNumber = await projectModel.getNextPoNumber(reckoner_type_id);
    if (!nextPoNumber) {
      console.error(`Failed to generate PO number for reckoner_type_id: ${reckoner_type_id}`);
      return res.status(400).json({ error: "Invalid reckoner type or not applicable for auto-generation" });
    }
    res.status(200).json({ po_number: nextPoNumber });
  } catch (error) {
    console.error("Error in getNextPoNumber:", error);
    res.status(500).json({ error: "Failed to fetch next PO number" });
  }
};

exports.createProjectWithSite = async (req, res) => {
  try {
    const { 
      project_type, 
      company_id, 
      project_name, 
      site_name, 
      po_number, 
      start_date, 
      end_date, 
      incharge_type, 
      location_id, 
      new_location_name,
      reckoner_type_id 
    } = req.body;

    console.log("Received createProjectWithSite request:", req.body);

    // Validate required fields
    if (!project_type || !company_id || !project_name || !site_name || 
        !po_number || !start_date || !end_date || 
        !incharge_type || (!location_id && !new_location_name) || !reckoner_type_id) {
      console.error("Validation failed: Missing required fields");
      return res.status(400).json({ error: "All fields are required, including either location_id or new_location_name and reckoner_type_id" });
    }

    if (project_type !== "service") {
      console.error(`Invalid project type: ${project_type}`);
      return res.status(400).json({ error: "Project type must be 'service'" });
    }

    const project_type_id = await projectModel.getProjectTypeId(project_type);
    if (!project_type_id) {
      console.error(`Invalid project type ID for: ${project_type}`);
      return res.status(400).json({ error: "Invalid project type" });
    }

    let finalLocationId = location_id;
    if (new_location_name && !location_id) {
      const existingLocationId = await projectModel.getLocationId(new_location_name);
      if (existingLocationId) {
        finalLocationId = existingLocationId;
      } else {
        finalLocationId = await projectModel.generateNewLocationId();
        await projectModel.insertLocation(finalLocationId, new_location_name);
      }
    }

    if (!finalLocationId) {
      console.error("No location ID provided or generated");
      return res.status(400).json({ error: "Location ID is required" });
    }

    let project = await projectModel.getProjectByNameAndType(project_name, project_type_id);
    let project_id;

    if (project) {
      project_id = project.pd_id;
    } else {
      project_id = await projectModel.generateNewProjectId();
      await projectModel.insertProject(project_id, project_type_id, company_id, project_name);
    }

    const incharge_id = await projectModel.getInchargeId(incharge_type);
    if (!incharge_id) {
      console.error(`Invalid incharge type: ${incharge_type}`);
      return res.status(400).json({ error: "Invalid incharge type" });
    }

    const site_id = await projectModel.generateNewSiteId();

    // Validate reckoner_type_id
    const [reckonerType] = await projectModel.db.query(
      'SELECT type_id FROM reckoner_types WHERE type_id = ?',
      [reckoner_type_id]
    );
    if (!reckonerType.length) {
      console.error(`Invalid reckoner type ID: ${reckoner_type_id}`);
      return res.status(400).json({ error: "Invalid reckoner type" });
    }

    await projectModel.insertSite(
      site_id, 
      site_name, 
      po_number, 
      start_date, 
      end_date, 
      incharge_id, 
      null, 
      project_id, 
      finalLocationId,
      reckoner_type_id
    );

    res.status(201).json({ message: "Project and Site created successfully", project_id, site_id });
  } catch (error) {
    console.error("Error in createProjectWithSite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.fetchWorkforceTypes = async (req, res) => {
    try {
        const workforceTypes = await projectModel.getWorkforceTypes();
        res.status(200).json(workforceTypes);
    } catch (error) {
        console.error("Error fetching workforce types:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.fetchSiteIncharges = async (req, res) => {
    try {
        const siteIncharges = await projectModel.getSiteIncharges();
        res.status(200).json(siteIncharges);
    } catch (error) {
        console.error("Error fetching site incharges:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.projectType = async (req, res) => {
    try {
        const projectType = await projectModel.getProjectType();
        res.status(200).json(projectType);
    } catch (error) {
        console.error("Error fetching project types:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllProjectsWithSites = async (req, res) => {
    try {
        const projects = await projectModel.getAllProjectsWithSites();
        
        const transformedProjects = projects.reduce((acc, project) => {
            const existingProject = acc.find(p => p.project_id === project.project_id);
            
            if (existingProject) {
                if (project.site_id) {
                    existingProject.sites.push({
                        site_id: project.site_id,
                        site_name: project.site_name,
                        po_number: project.po_number,
                        start_date: project.start_date,
                        end_date: project.end_date,
                        incharge_type: project.incharge_type,
                        workforce_type: project.workforce_type
                    });
                }
            } else {
                const newProject = {
                    project_id: project.project_id,
                    project_name: project.project_name,
                    project_type: project.project_type,
                    company_id: project.company_id,
                    company_name: project.company_name,
                    sites: project.site_id ? [{
                        site_id: project.site_id,
                        site_name: project.site_name,
                        po_number: project.po_number,
                        start_date: project.start_date,
                        end_date: project.end_date,
                        incharge_type: project.incharge_type,
                        workforce_type: project.workforce_type
                    }] : []
                };
                acc.push(newProject);
            }
            
            return acc;
        }, []);
        
        res.status(200).json(transformedProjects);
    } catch (error) {
        console.error("Error fetching projects with sites:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllProjectsWithSitesByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const projects = await projectModel.getAllProjectsWithSitesByCompanyId(companyId);
        
        if (projects.length === 0) {
            return res.status(404).json({ error: "No projects found for this company" });
        }

        const transformedProjects = projects.reduce((acc, project) => {
            const existingProject = acc.find(p => p.project_id === project.project_id);
            
            if (existingProject) {
                if (project.site_id) {
                    existingProject.sites.push({
                        site_id: project.site_id,
                        site_name: project.site_name,
                        po_number: project.po_number,
                        start_date: project.start_date,
                        end_date: project.end_date,
                        incharge_type: project.incharge_type || "N/A",
                        workforce_type: project.workforce_type || "N/A",
                        location_name: project.location_name || "N/A"
                    });
                }
            } else {
                const newProject = {
                    project_id: project.project_id,
                    project_name: project.project_name,
                    project_type: project.project_type,
                    company_id: project.company_id,
                    company_name: project.company_name,
                    sites: project.site_id ? [{
                        site_id: project.site_id,
                        site_name: project.site_name,
                        po_number: project.po_number,
                        start_date: project.start_date,
                        end_date: project.end_date,
                        incharge_type: project.incharge_type || "N/A",
                        workforce_type: project.workforce_type || "N/A"
                    }] : []
                };
                acc.push(newProject);
            }
            
            return acc;
        }, []);
        
        res.status(200).json(transformedProjects);
    } catch (error) {
        console.error("Error fetching projects with sites by company ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getAllLocations = async (req, res) => {
  try {
    const locations = await projectModel.getAllLocations();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllProjectsWithSites = async (req, res) => {
  try {
    const projects = await projectModel.getAllProjectsWithSites();
    const transformedProjects = projects.reduce((acc, project) => {
      const existingProject = acc.find(p => p.project_id === project.project_id);
      if (existingProject) {
        if (project.site_id) {
          existingProject.sites.push({
            site_id: project.site_id,
            site_name: project.site_name,
            po_number: project.po_number,
            start_date: project.start_date,
            end_date: project.end_date,
            incharge_type: project.incharge_type || "N/A",
            workforce_type: project.workforce_type || "N/A",
            location_name: project.location_name || "N/A"
          });
        }
      } else {
        const newProject = {
          project_id: project.project_id,
          project_name: project.project_name,
          project_type: project.project_type,
          company_id: project.company_id,
          company_name: project.company_name,
          sites: project.site_id ? [{
            site_id: project.site_id,
            site_name: project.site_name,
            po_number: project.po_number,
            start_date: project.start_date,
            end_date: project.end_date,
            incharge_type: project.incharge_type || "N/A",
            workforce_type: project.workforce_type || "N/A",
            location_name: project.location_name || "N/A"
          }] : []
        };
        acc.push(newProject);
      }
      return acc;
    }, []);
    res.status(200).json(transformedProjects);
  } catch (error) {
    console.error("Detailed error in getAllProjectsWithSites:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};



exports.createProject = async (req, res) => {
  try {
    const { company_id, project_name } = req.body;

    if (!company_id || !project_name) {
      return res.status(400).json({ error: "Company ID and project name are required" });
    }

    // Verify company exists
    const company = await projectModel.fetchCompanyById(company_id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const newProject = await projectModel.createProject(company_id, project_name);

    res.status(201).json({
      message: "Project created successfully",
      project_id: newProject.project_id,
      project_name: newProject.project_name,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project", details: error.message });
  }
};