const projectModel = require('../models/projectModel');

exports.createCompany = async (req, res) => {
    try {
        const { company_name, address, location_name, spoc_name, spoc_contact_no } = req.body;
        
        // Check if location exists
        let location_id = await projectModel.getLocationId(location_name);
        
        if (!location_id) {
            // Generate new location_id dynamically (LO001, LO002...)
            location_id = await projectModel.generateNewLocationId();
            await projectModel.insertLocation(location_id, location_name);
        }

        // Generate new company_id dynamically (CO001, CO002...)
        const company_id = await projectModel.generateNewCompanyId();
        
        // Insert company details
        await projectModel.insertCompany(company_id, company_name, address, location_id, spoc_name, spoc_contact_no);

        res.status(201).json({ message: "Company created successfully", company_id, location_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await projectModel.fetchAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const { company_id } = req.params;
        const { company_name, address, location_name, spoc_name, spoc_contact_no } = req.body;

        if (!company_id || !company_name || !address || !location_name || !spoc_name || !spoc_contact_no) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let location_id = await projectModel.getLocationId(location_name);
        if (!location_id) {
            location_id = await projectModel.generateNewLocationId();
            await projectModel.insertLocation(location_id, location_name);
        }

        await projectModel.updateCompany(company_id, company_name, address, location_id, spoc_name, spoc_contact_no);

        res.status(200).json({ message: "Company updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// **************************************  duplicate occurs in below code

// exports.createProjectWithSite = async (req, res) => {
//     try {
//         const { project_type, company_name, project_name, site_name, po_number, start_date, end_date, incharge_type, workforce_type } = req.body;

//         // Fetch project_type_id
//         const project_type_id = await projectModel.getProjectTypeId(project_type);
//         if (!project_type_id) {
//             return res.status(400).json({ error: "Invalid project type" });
//         }

//         // Fetch company_id
//         const company_id = await projectModel.getCompanyId(company_name);
//         if (!company_id) {
//             return res.status(400).json({ error: "Company not found" });
//         }

//         // Generate new project ID
//         const project_id = await projectModel.generateNewProjectId();

//         // Insert project details
//         await projectModel.insertProject(project_id, project_type_id, company_id, project_name);

//         // Fetch incharge_id
//         const incharge_id = await projectModel.getInchargeId(incharge_type);
//         if (!incharge_id) {
//             return res.status(400).json({ error: "Invalid incharge type" });
//         }

//         // Fetch workforce_id
//         const workforce_id = await projectModel.getWorkforceId(workforce_type);
//         if (!workforce_id) {
//             return res.status(400).json({ error: "Invalid workforce type" });
//         }

//         // Generate new site ID
//         const site_id = await projectModel.generateNewSiteId();

//         // Insert site details
//         await projectModel.insertSite(site_id, site_name, po_number, start_date, end_date, incharge_id, workforce_id, project_id);

//         res.status(201).json({ message: "Project and Site created successfully", project_id, site_id });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };


// duplicate not occurs in below code
exports.createProjectWithSite = async (req, res) => {
    try {
        const { project_type, company_name, project_name, site_name, po_number, start_date, end_date, incharge_type, workforce_type } = req.body;

        console.log("Received request body:", req.body);

        // Fetch project_type_id
        const project_type_id = await projectModel.getProjectTypeId(project_type);
        if (!project_type_id) {
            console.log("Error: Invalid project type");
            return res.status(400).json({ error: "Invalid project type" });
        }
        console.log("Fetched project_type_id:", project_type_id);

        // Check if project with same name and type already exists
        let project = await projectModel.getProjectByNameAndType(project_name, project_type_id);

        let project_id;
        if (project) {
            // Use existing project_id
            project_id = project.pd_id;
            console.log(`Project exists. Using existing project_id: ${project_id}`);
        } else {
            // Fetch company_id
            const company_id = await projectModel.getCompanyId(company_name);
            if (!company_id) {
                console.log("Error: Company not found");
                return res.status(400).json({ error: "Company not found" });
            }
            console.log("Fetched company_id:", company_id);

            // Generate new project ID
            project_id = await projectModel.generateNewProjectId();
            console.log("Generated new project_id:", project_id);

            // Insert project details
            await projectModel.insertProject(project_id, project_type_id, company_id, project_name);
            console.log(`Inserted new project: ${project_name} with project_id: ${project_id}`);
        }

        // Fetch incharge_id
        const incharge_id = await projectModel.getInchargeId(incharge_type);
        if (!incharge_id) {
            console.log("Error: Invalid incharge type");
            return res.status(400).json({ error: "Invalid incharge type" });
        }
        console.log("Fetched incharge_id:", incharge_id);

        // Fetch workforce_id
        const workforce_id = await projectModel.getWorkforceId(workforce_type);
        if (!workforce_id) {
            console.log("Error: Invalid workforce type");
            return res.status(400).json({ error: "Invalid workforce type" });
        }
        console.log("Fetched workforce_id:", workforce_id);

        // Generate new site ID
        const site_id = await projectModel.generateNewSiteId();
        console.log("Generated new site_id:", site_id);

        // Insert site details
        await projectModel.insertSite(site_id, site_name, po_number, start_date, end_date, incharge_id, workforce_id, project_id);
        console.log(`Inserted new site: ${site_name} with site_id: ${site_id}, linked to project_id: ${project_id}`);

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
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.fetchSiteIncharges = async (req, res) => {
    try {
        const siteIncharges = await projectModel.getSiteIncharges();
        res.status(200).json(siteIncharges);
    } catch (error) {
        console.error("Error fetching site incharges:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.projectType = async (req, res) => {
    try {
        const projectType = await projectModel.getProjectType();
        res.status(200).json(projectType);
    } catch (error) {
        console.error("Error fetching site incharges:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};







// Get all projects with their site details
exports.getAllProjectsWithSites = async (req, res) => {
    try {
        const projects = await projectModel.getAllProjectsWithSites();
        
        // Transform the data to group sites under projects
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










// Get all projects with sites for a specific company
exports.getAllProjectsWithSitesByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const projects = await projectModel.getAllProjectsWithSitesByCompanyId(companyId);
        
        // Transform the data to group sites under projects
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
        console.error("Error fetching projects with sites by company ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




























