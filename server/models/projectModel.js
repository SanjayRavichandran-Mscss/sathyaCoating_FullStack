const db = require("../config/db");

exports.getLocationId = async (location_name) => {
  const [rows] = await db.query(
    "SELECT location_id FROM location WHERE location_name = ?",
    [location_name]
  );
  return rows.length ? rows[0].location_id : null;
};

exports.generateNewLocationId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(location_id) AS lastId FROM location"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("LO", "")) + 1;
    return `LO${String(lastNum).padStart(3, "0")}`;
  }
  return "LO001";
};

exports.insertLocation = async (location_id, location_name) => {
  await db.query(
    "INSERT INTO location (location_id, location_name) VALUES (?, ?)",
    [location_id, location_name]
  );
};

exports.generateNewCompanyId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(company_id) AS lastId FROM company"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("CO", "")) + 1;
    return `CO${String(lastNum).padStart(3, "0")}`;
  }
  return "CO001";
};

exports.insertCompany = async (
  company_id,
  company_name,
  address,
  location_id,
  spoc_name,
  spoc_contact_no
) => {
  await db.query(
    "INSERT INTO company (company_id, company_name, address, location_id, spoc_name, spoc_contact_no) VALUES (?, ?, ?, ?, ?, ?)",
    [company_id, company_name, address, location_id, spoc_name, spoc_contact_no]
  );
};

exports.fetchAllCompanies = async () => {
  const [rows] = await db.query(`
        SELECT c.company_id, c.company_name, c.address, l.location_name, c.spoc_name, c.spoc_contact_no 
        FROM company c
        JOIN location l ON c.location_id = l.location_id
    `);
  return rows;
};

exports.updateCompany = async (
  company_id,
  company_name,
  address,
  location_id,
  spoc_name,
  spoc_contact_no
) => {
  await db.query(
    "UPDATE company SET company_name = ?, address = ?, location_id = ?, spoc_name = ?, spoc_contact_no = ? WHERE company_id = ?",
    [company_name, address, location_id, spoc_name, spoc_contact_no, company_id]
  );
};

// Fetch project_type_id
exports.getProjectTypeId = async (project_type) => {
  const [rows] = await db.query(
    "SELECT type_id FROM project_type WHERE LOWER(type_description) = ?",
    [project_type.toLowerCase()]
  );
  return rows.length ? rows[0].type_id : null;
};

// Fetch company_id
exports.getCompanyId = async (company_name) => {
  const [rows] = await db.query(
    "SELECT company_id FROM company WHERE LOWER(company_name) = ?",
    [company_name.toLowerCase()]
  );
  return rows.length ? rows[0].company_id : null;
};

// Generate new project ID
exports.generateNewProjectId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(pd_id) AS lastId FROM project_details"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("PD", "")) + 1;
    return `PD${String(lastNum).padStart(3, "0")}`;
  }
  return "PD001";
};

// Insert project details
exports.insertProject = async (
  project_id,
  project_type_id,
  company_id,
  project_name
) => {
  await db.query(
    "INSERT INTO project_details (pd_id, project_type_id, company_id, project_name) VALUES (?, ?, ?, ?)",
    [project_id, project_type_id, company_id, project_name]
  );
};
// Fetch incharge_id
exports.getInchargeId = async (incharge_type) => {
  const [rows] = await db.query(
    "SELECT incharge_id FROM site_incharge WHERE incharge_type = ?",
    [incharge_type]
  );
  return rows.length ? rows[0].incharge_id : null;
};

// Fetch workforce_id
exports.getWorkforceId = async (workforce_type) => {
  const [rows] = await db.query(
    "SELECT workforce_id FROM workforce_type WHERE workforce_type = ?",
    [workforce_type]
  );
  return rows.length ? rows[0].workforce_id : null;
};

// Generate new site ID
exports.generateNewSiteId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(site_id) AS lastId FROM site_details"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("ST", "")) + 1;
    return `ST${String(lastNum).padStart(3, "0")}`;
  }
  return "ST001";
};

// Insert site details (with pd_id as foreign key)
exports.insertSite = async (
  site_id,
  site_name,
  po_number,
  start_date,
  end_date,
  incharge_id,
  workforce_id,
  pd_id
) => {
  await db.query(
    "INSERT INTO site_details (site_id, site_name, po_number, start_date, end_date, incharge_id, workforce_id, pd_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      site_id,
      site_name,
      po_number,
      start_date,
      end_date,
      incharge_id,
      workforce_id,
      pd_id,
    ]
  );
};

exports.getWorkforceTypes = async () => {
  const [rows] = await db.query("SELECT * FROM workforce_type");
  return rows;
};

exports.getSiteIncharges = async () => {
  const [rows] = await db.query("SELECT * FROM site_incharge");
  return rows;
};

exports.getProjectType = async () => {
  const [rows] = await db.query("SELECT * FROM project_type");
  return rows;
};

// Get all projects with their site details and related information
exports.getAllProjectsWithSites = async () => {
  const [rows] = await db.query(`
        SELECT 
            pd.pd_id AS project_id,
            pd.project_name,
            pt.type_description AS project_type,
            c.company_name,
            c.company_id,
            sd.site_id,
            sd.site_name,
            sd.po_number,
            sd.start_date,
            sd.end_date,
            si.incharge_type,
            wt.workforce_type
        FROM 
            project_details pd
        JOIN 
            company c ON pd.company_id = c.company_id
        JOIN 
            project_type pt ON pd.project_type_id = pt.type_id
        LEFT JOIN 
            site_details sd ON pd.pd_id = sd.pd_id
        LEFT JOIN 
            site_incharge si ON sd.incharge_id = si.incharge_id
        LEFT JOIN 
            workforce_type wt ON sd.workforce_id = wt.workforce_id
        ORDER BY 
            pd.project_name, sd.site_name
    `);
  return rows;
};

// Get all projects with sites for a specific company
exports.getAllProjectsWithSitesByCompanyId = async (companyId) => {
  const [rows] = await db.query(
    `
        SELECT 
            pd.pd_id AS project_id,
            pd.project_name,
            pt.type_description AS project_type,
            c.company_name,
            c.company_id,
            sd.site_id,
            sd.site_name,
            sd.po_number,
            sd.start_date,
            sd.end_date,
            si.incharge_type,
            wt.workforce_type
        FROM 
            project_details pd
        JOIN 
            company c ON pd.company_id = c.company_id
        JOIN 
            project_type pt ON pd.project_type_id = pt.type_id
        LEFT JOIN 
            site_details sd ON pd.pd_id = sd.pd_id
        LEFT JOIN 
            site_incharge si ON sd.incharge_id = si.incharge_id
        LEFT JOIN 
            workforce_type wt ON sd.workforce_id = wt.workforce_id
        WHERE 
            c.company_id = ?
        ORDER BY 
            pd.project_name, sd.site_name
    `,
    [companyId]
  );
  return rows;
};

// Fetch project by name and type
exports.getProjectByNameAndType = async (project_name, project_type_id) => {
  const [rows] = await db.query(
    "SELECT pd_id FROM project_details WHERE LOWER(project_name) = ? AND project_type_id = ?",
    [project_name.toLowerCase(), project_type_id]
  );
  return rows.length ? rows[0] : null;
};







