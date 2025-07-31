const db = require('../config/db');

exports.test = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Test API is working',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.dispatchMaterialToSite = async (req, res) => {
  try {
    const assignments = Array.isArray(req.body) ? req.body : [req.body];

    if (assignments.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one material assignment is required'
      });
    }

    const insertedIds = [];
    for (const { assign_date, dc_no, pd_id, site_id, item_id, uom_id, qty } of assignments) {
      if (!assign_date || !dc_no || !pd_id || !site_id || !item_id || !uom_id || qty == null) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: assign_date, dc_no, pd_id, site_id, item_id, uom_id, and qty are required'
        });
      }

      if (isNaN(dc_no) || isNaN(qty) || isNaN(uom_id)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid data types: dc_no, qty, and uom_id must be numbers'
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(assign_date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format: assign_date must be in YYYY-MM-DD format'
        });
      }

      const [result] = await db.query(
        'INSERT INTO material_dispatch (assign_date, dc_no, pd_id, site_id, item_id, uom_id, qty) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [assign_date, dc_no, pd_id, site_id, item_id, uom_id, qty]
      );
      insertedIds.push(result.insertId);
    }

    res.status(201).json({
      status: 'success',
      message: 'Materials assigned to site successfully',
      data: { insertedIds }
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pd_id, site_id, item_id, or uom_id: referenced record does not exist'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};



exports.addMaterialDispatch = async (req, res) => {
  try {
    const { material_assign_id, dc_no, dispatch_date, dispatch_qty } = req.body;

    if (!material_assign_id || !dc_no || !dispatch_date || dispatch_qty == null) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: material_assign_id, dc_no, dispatch_date, and dispatch_qty are required'
      });
    }

    if (isNaN(dc_no) || isNaN(dispatch_qty) || isNaN(material_assign_id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid data types: dc_no, dispatch_qty, and material_assign_id must be numbers'
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dispatch_date)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format: dispatch_date must be in YYYY-MM-DD format'
      });
    }

    const [result] = await db.query(
      'INSERT INTO material_dispatch (material_assign_id, dc_no, dispatch_date, dispatch_qty, created_at, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [material_assign_id, dc_no, dispatch_date, dispatch_qty]
    );

    res.status(201).json({
      status: 'success',
      message: 'Material dispatched successfully',
      data: { insertId: result.insertId }
    });
  } catch (error) {
    console.error('Add dispatch error:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid material_assign_id: referenced record does not exist'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
      sqlMessage: error.sqlMessage || 'No SQL message available'
    });
  }
};



exports.fetchMaterialAssignmentsWithDispatch = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ma.id,
        ma.created_at,
        ma.quantity AS assign_qty,
        pd.project_name,
        sd.site_name,
        sd.po_number,
        mm.item_name,
        um.uom_name,
        md.dc_no AS dispatch_dc_no,
        md.dispatch_date,
        md.dispatch_qty
      FROM material_assign ma
      LEFT JOIN material_dispatch md ON ma.id = md.material_assign_id
      LEFT JOIN project_details pd ON ma.pd_id = pd.pd_id
      LEFT JOIN site_details sd ON ma.site_id = sd.site_id
      LEFT JOIN material_master mm ON ma.item_id = mm.item_id
      LEFT JOIN uom_master um ON ma.uom_id = um.uom_id
    `);
    
    res.status(200).json({
      status: 'success',
      message: 'Material assignments fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
      sqlMessage: error.sqlMessage || 'No SQL message available'
    });
  }
};

exports.fetchMaterialMaster = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT item_id, item_name FROM material_master');
    res.status(200).json({
      status: 'success',
      message: 'Material master records fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchProjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT pd_id, project_name FROM project_details');
    res.status(200).json({
      status: 'success',
      message: 'Projects fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchSites = async (req, res) => {
  try {
    const { pd_id } = req.params;
    if (!pd_id) {
      return res.status(400).json({
        status: 'error',
        message: 'pd_id is required'
      });
    }
    const [rows] = await db.query('SELECT site_id, site_name, po_number FROM site_details WHERE pd_id = ?', [pd_id]);
    res.status(200).json({
      status: 'success',
      message: 'Sites fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchMaterialAssignments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ma.assign_date,
        ma.dc_no,
        pd.project_name,
        sd.site_name,
        sd.po_number,
        mm.item_name,
        um.uom_name,
        ma.qty
      FROM material_dispatch ma
      JOIN project_details pd ON ma.pd_id = pd.pd_id
      JOIN site_details sd ON ma.site_id = sd.site_id
      JOIN material_master mm ON ma.item_id = mm.item_id
      JOIN uom_master um ON ma.uom_id = um.uom_id
    `);
    
    res.status(200).json({
      status: 'success',
      message: 'Material assignments fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchUomMaster = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT uom_id, uom_name FROM uom_master');
    res.status(200).json({
      status: 'success',
      message: 'UOM master records fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchDesignations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, designation FROM emp_designation');
    const designations = rows.map(row => ({ id: row.id, designation: row.designation }));
    res.status(200).json({
      status: 'success',
      message: 'Designations fetched successfully',
      data: designations
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchEmployees = async (req, res) => {
  try {
    const query = `
      SELECT 
        em.emp_id,
        em.full_name,
        COALESCE(eg.gender, 'Unknown') AS gender,
        em.date_of_birth,
        em.date_of_joining,
        COALESCE(es.status, 'Unknown') AS status,
        em.company,
        COALESCE(ed.department, 'Unknown') AS department,
        COALESCE(et.type, 'Unknown') AS employment_type,
        COALESCE(edg.designation, 'Unknown') AS designation,
        em.branch,
        em.mobile,
        em.company_email,
        em.current_address,
        em.permanent_address,
        em.created_at
      FROM employee_master em
      LEFT JOIN emp_gender eg ON em.gender_id = eg.id
      LEFT JOIN emp_department ed ON em.dept_id = ed.id
      LEFT JOIN employment_type et ON em.emp_type_id = et.id
      LEFT JOIN emp_designation edg ON em.designation_id = edg.id
      LEFT JOIN emp_status es ON em.status_id = es.id
      ORDER BY em.created_at DESC
    `;

    const [rows] = await db.query(query);

    res.status(200).json({
      status: 'success',
      message: rows.length > 0 ? 'Employees fetched successfully' : 'No employees found',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching employees:', error.message, error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch employee details',
      error: error.message
    });
  }
};

exports.assignInchargeToSite = async (req, res) => {
  try {
    const assignments = Array.isArray(req.body) ? req.body : [req.body];

    if (assignments.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one incharge assignment is required'
      });
    }

    const insertedIds = [];
    for (const { from_date, to_date, pd_id, site_id, emp_id } of assignments) {
      if (!from_date || !to_date || !pd_id || !site_id || !emp_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: from_date, to_date, pd_id, site_id, and emp_id are required'
        });
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(from_date) || !/^\d{4}-\d{2}-\d{2}$/.test(to_date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format: from_date and to_date must be in YYYY-MM-DD format'
        });
      }

      const fromDate = new Date(from_date);
      const toDate = new Date(to_date);
      if (toDate < fromDate) {
        return res.status(400).json({
          status: 'error',
          message: 'to_date must be after from_date'
        });
      }

      const [employee] = await db.query('SELECT emp_id FROM employee_master WHERE emp_id = ?', [emp_id]);
      if (employee.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid emp_id: ${emp_id} does not exist in employee_master`
        });
      }

      const [result] = await db.query(
        'INSERT INTO siteincharge_assign (from_date, to_date, pd_id, site_id, emp_id) VALUES (?, ?, ?, ?, ?)',
        [from_date, to_date, pd_id, site_id, emp_id]
      );
      insertedIds.push(result.insertId);
    }

    res.status(201).json({
      status: 'success',
      message: 'Incharges assigned to site successfully',
      data: { insertedIds }
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid pd_id, site_id, or emp_id: referenced record does not exist'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const {
      emp_id, full_name, gender_id, date_of_birth, date_of_joining, status_id,
      company, dept_id, emp_type_id, designation_id, branch,
      mobile, company_email, current_address, permanent_address
    } = req.body;

    // Check for missing fields
    if (
      !emp_id || !full_name || !gender_id || !date_of_birth || !date_of_joining ||
      !status_id || !company || !dept_id || !emp_type_id || !designation_id ||
      !branch || !mobile || !company_email || !current_address || !permanent_address
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required',
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date_of_birth) || !dateRegex.test(date_of_joining)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format: date_of_birth and date_of_joining must be in YYYY-MM-DD format',
      });
    }

    // Validate mobile (allow +91 optional, 10 digits)
    const mobileRegex = /^(?:\+91)?\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid mobile number: must be 10 digits, with optional +91 prefix',
      });
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(company_email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid email format',
      });
    }

    // Check for duplicates
    const [existingEmpId] = await db.query('SELECT emp_id FROM employee_master WHERE emp_id = ?', [emp_id]);
    if (existingEmpId.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Employee ID already exists',
      });
    }

    const [existingEmail] = await db.query('SELECT company_email FROM employee_master WHERE company_email = ?', [company_email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Company email already exists',
      });
    }

    // Validate foreign keys
    const [gender] = await db.query('SELECT id FROM emp_gender WHERE id = ?', [gender_id]);
    if (gender.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid gender_id: gender does not exist',
      });
    }

    const [department] = await db.query('SELECT id FROM emp_department WHERE id = ?', [dept_id]);
    if (department.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid dept_id: department does not exist',
      });
    }

    const [empType] = await db.query('SELECT id FROM employment_type WHERE id = ?', [emp_type_id]);
    if (empType.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid emp_type_id: employment type does not exist',
      });
    }

    const [designation] = await db.query('SELECT id FROM emp_designation WHERE id = ?', [designation_id]);
    if (designation.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid designation_id: designation does not exist',
      });
    }

    const [status] = await db.query('SELECT id FROM emp_status WHERE id = ?', [status_id]);
    if (status.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status_id: status does not exist',
      });
    }

    // Insert employee
    const [result] = await db.query(
      `INSERT INTO employee_master (
        emp_id, full_name, gender_id, date_of_birth, date_of_joining, status_id,
        company, dept_id, emp_type_id, designation_id, branch,
        mobile, company_email, current_address, permanent_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        emp_id, full_name, gender_id, date_of_birth, date_of_joining, status_id,
        company, dept_id, emp_type_id, designation_id, branch,
        mobile, company_email, current_address, permanent_address
      ]
    );

    res.status(201).json({
      status: 'success',
      message: 'Employee added successfully',
      data: { emp_id, full_name, designation_id, status_id },
    });
  } catch (error) {
    console.error('Error adding employee:', error.message, error.stack);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Employee ID or email already exists',
      });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid foreign key: one of gender_id, dept_id, emp_type_id, designation_id, or status_id does not exist',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to add employee due to server error',
      error: error.message,
    });
  }
};

exports.getAssignedIncharges = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        sia.id,
        sia.pd_id,
        COALESCE(pd.project_name, 'Unknown') AS project_name,
        sia.site_id,
        COALESCE(sd.site_name, 'Unknown') AS site_name,
        COALESCE(sd.po_number, 'Unknown') AS po_number,
        sia.emp_id,
        COALESCE(em.full_name, 'Unknown') AS full_name,
        COALESCE(edg.designation, 'Unknown') AS designation,
        COALESCE(em.mobile, 'Unknown') AS mobile,
        COALESCE(es.status, 'Unknown') AS status,
        sia.from_date,
        sia.to_date
      FROM siteincharge_assign sia
      LEFT JOIN project_details pd ON sia.pd_id = pd.pd_id
      LEFT JOIN site_details sd ON sia.site_id = sd.site_id
      LEFT JOIN employee_master em ON sia.emp_id = em.emp_id
      LEFT JOIN emp_designation edg ON em.designation_id = edg.id
      LEFT JOIN emp_status es ON em.status_id = es.id
      ORDER BY sia.from_date DESC
    `);

    if (!rows || rows.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No assigned incharges found',
        data: []
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Assigned incharges fetched successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching assigned incharges:', error.message, error.stack);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch assigned incharge details',
      error: error.message
    });
  }
};

exports.fetchGenders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, gender FROM emp_gender');
    res.status(200).json({
      status: 'success',
      message: 'Genders fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchDepartments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, department FROM emp_department');
    res.status(200).json({
      status: 'success',
      message: 'Departments fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchEmploymentTypes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, type FROM employment_type');
    res.status(200).json({
      status: 'success',
      message: 'Employment types fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.fetchStatuses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, status FROM emp_status');
    res.status(200).json({
      status: 'success',
      message: 'Statuses fetched successfully',
      data: rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.addGender = async (req, res) => {
  try {
    const { gender } = req.body;
    if (!gender) {
      return res.status(400).json({
        status: 'error',
        message: 'Gender is required'
      });
    }

    const [existing] = await db.query('SELECT id FROM emp_gender WHERE gender = ?', [gender]);
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Gender already exists'
      });
    }

    const [result] = await db.query('INSERT INTO emp_gender (gender) VALUES (?)', [gender]);
    res.status(201).json({
      status: 'success',
      message: 'Gender added successfully',
      data: { id: result.insertId, gender }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Gender already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.addDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    if (!department) {
      return res.status(400).json({
        status: 'error',
        message: 'Department is required'
      });
    }

    const [existing] = await db.query('SELECT id FROM emp_department WHERE department = ?', [department]);
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Department already exists'
      });
    }

    const [result] = await db.query('INSERT INTO emp_department (department) VALUES (?)', [department]);
    res.status(201).json({
      status: 'success',
      message: 'Department added successfully',
      data: { id: result.insertId, department }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Department already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.addEmploymentType = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({
        status: 'error',
        message: 'Employment type is required'
      });
    }

    const [existing] = await db.query('SELECT id FROM employment_type WHERE type = ?', [type]);
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Employment type already exists'
      });
    }

    const [result] = await db.query('INSERT INTO employment_type (type) VALUES (?)', [type]);
    res.status(201).json({
      status: 'success',
      message: 'Employment type added successfully',
      data: { id: result.insertId, type }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Employment type already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.addDesignation = async (req, res) => {
  try {
    const { designation } = req.body;
    if (!designation) {
      return res.status(400).json({
        status: 'error',
        message: 'Designation is required'
      });
    }

    const [existing] = await db.query('SELECT id FROM emp_designation WHERE designation = ?', [designation]);
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Designation already exists'
      });
    }

    const [result] = await db.query('INSERT INTO emp_designation (designation) VALUES (?)', [designation]);
    res.status(201).json({
      status: 'success',
      message: 'Designation added successfully',
      data: { id: result.insertId, designation }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'error',
        message: 'Designation already exists'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};




exports.assignMaterial = async (req, res) => {
  try {
    const assignments = Array.isArray(req.body) ? req.body : [req.body];

    if (assignments.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one material assignment is required',
      });
    }

    // Validate each assignment
    const validationErrors = [];
    assignments.forEach((assignment, index) => {
      const { pd_id, site_id, item_id, uom_id, quantity } = assignment;

      if (!pd_id || typeof pd_id !== 'string' || pd_id.trim() === '') {
        validationErrors.push(`Assignment ${index + 1}: pd_id is required and must be a non-empty string`);
      }
      if (!site_id || typeof site_id !== 'string' || site_id.trim() === '') {
        validationErrors.push(`Assignment ${index + 1}: site_id is required and must be a non-empty string`);
      }
      if (!item_id || typeof item_id !== 'string' || item_id.trim() === '' || item_id === 'N/A') {
        validationErrors.push(`Assignment ${index + 1}: item_id is required and must be a valid material ID (not 'N/A')`);
      }
      if (!Number.isInteger(uom_id) || uom_id <= 0) {
        validationErrors.push(`Assignment ${index + 1}: uom_id is required and must be a positive integer`);
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        validationErrors.push(`Assignment ${index + 1}: quantity is required and must be a positive integer`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: validationErrors,
      });
    }

    const insertedIds = [];
    for (const { pd_id, site_id, item_id, uom_id, quantity } of assignments) {
      const [result] = await db.query(
        'INSERT INTO material_assign (pd_id, site_id, item_id, uom_id, quantity, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [pd_id, site_id, item_id, uom_id, quantity]
      );
      insertedIds.push(result.insertId);
    }

    res.status(201).json({
      status: 'success',
      message: 'Materials assigned successfully',
      data: { insertedIds },
    });
  } catch (error) {
    console.error('Error in assignMaterial:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid reference: pd_id, site_id, item_id, or uom_id does not exist in the database',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
    });
  }
};




exports.getAssignedMaterials = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ma.id,
        ma.pd_id,
        p.project_name,
        ma.site_id,
        s.site_name,
        s.po_number,
        ma.item_id,
        m.item_name,
        ma.uom_id,
        u.uom_name,
        ma.quantity,
        ma.created_at
      FROM material_assign ma
      LEFT JOIN project_details p ON ma.pd_id = p.pd_id
      LEFT JOIN site_details s ON ma.site_id = s.site_id
      LEFT JOIN material_master m ON ma.item_id = m.item_id
      LEFT JOIN uom_master u ON ma.uom_id = u.uom_id
      ORDER BY ma.created_at DESC
    `);

    res.status(200).json({
      status: 'success',
      message: 'Assigned materials fetched successfully',
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching assigned materials:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch assigned materials',
      error: error.message,
    });
  }
};