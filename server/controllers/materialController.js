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






exports.assignMaterial = async (req, res) => {
  try {
    const assignments = Array.isArray(req.body) ? req.body : [req.body];

    // Validate each assignment
    const validationErrors = [];
    assignments.forEach((assignment, index) => {
      const { pd_id, site_id, item_id, uom_id, quantity, comp_ratio_a, comp_ratio_b, comp_ratio_c } = assignment;

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
      if (comp_ratio_a !== null && (!Number.isInteger(comp_ratio_a) || comp_ratio_a < 0)) {
        validationErrors.push(`Assignment ${index + 1}: comp_ratio_a must be a non-negative integer or null`);
      }
      if (comp_ratio_b !== null && (!Number.isInteger(comp_ratio_b) || comp_ratio_b < 0)) {
        validationErrors.push(`Assignment ${index + 1}: comp_ratio_b must be a non-negative integer or null`);
      }
      if (comp_ratio_c !== null && (!Number.isInteger(comp_ratio_c) || comp_ratio_c < 0)) {
        validationErrors.push(`Assignment ${index + 1}: comp_ratio_c must be a non-negative integer or null`);
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
    for (const { pd_id, site_id, item_id, uom_id, quantity, comp_ratio_a, comp_ratio_b, comp_ratio_c } of assignments) {
      const [result] = await db.query(
        'INSERT INTO material_assign (pd_id, site_id, item_id, uom_id, quantity, comp_ratio_a, comp_ratio_b, comp_ratio_c, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [pd_id, site_id, item_id, uom_id, quantity, comp_ratio_a, comp_ratio_b, comp_ratio_c]
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








exports.addMaterialDispatch = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { assignments, transport } = req.body;

    // Validate dispatch assignments (if provided)
    let dispatchInsertedIds = [];
    if (assignments && Array.isArray(assignments) && assignments.length > 0) {
      const validationErrors = [];
      assignments.forEach((assignment, index) => {
        const { material_assign_id, dc_no, dispatch_date, order_no, vendor_code, comp_a_qty, comp_b_qty, comp_c_qty, comp_a_remarks, comp_b_remarks, comp_c_remarks } = assignment;

        if (!material_assign_id || isNaN(material_assign_id)) {
          validationErrors.push(`Assignment ${index + 1}: material_assign_id is required and must be a number`);
        }
        if (!dc_no || isNaN(dc_no)) {
          validationErrors.push(`Assignment ${index + 1}: dc_no is required and must be a number`);
        }
        if (!dispatch_date || !/^\d{4}-\d{2}-\d{2}$/.test(dispatch_date)) {
          validationErrors.push(`Assignment ${index + 1}: dispatch_date is required and must be in YYYY-MM-DD format`);
        }
        if (!order_no || typeof order_no !== 'string' || order_no.trim() === '') {
          validationErrors.push(`Assignment ${index + 1}: order_no is required and must be a non-empty string`);
        }
        if (!vendor_code || typeof vendor_code !== 'string' || vendor_code.trim() === '') {
          validationErrors.push(`Assignment ${index + 1}: vendor_code is required and must be a non-empty string`);
        }
        if (comp_a_qty !== null && (!Number.isInteger(comp_a_qty) || comp_a_qty < 0)) {
          validationErrors.push(`Assignment ${index + 1}: comp_a_qty must be a non-negative integer or null`);
        }
        if (comp_b_qty !== null && (!Number.isInteger(comp_b_qty) || comp_b_qty < 0)) {
          validationErrors.push(`Assignment ${index + 1}: comp_b_qty must be a non-negative integer or null`);
        }
        if (comp_c_qty !== null && (!Number.isInteger(comp_c_qty) || comp_c_qty < 0)) {
          validationErrors.push(`Assignment ${index + 1}: comp_c_qty must be a non-negative integer or null`);
        }
        if (comp_a_remarks !== null && typeof comp_a_remarks !== 'string') {
          validationErrors.push(`Assignment ${index + 1}: comp_a_remarks must be a string or null`);
        }
        if (comp_b_remarks !== null && typeof comp_b_remarks !== 'string') {
          validationErrors.push(`Assignment ${index + 1}: comp_b_remarks must be a string or null`);
        }
        if (comp_c_remarks !== null && typeof comp_c_remarks !== 'string') {
          validationErrors.push(`Assignment ${index + 1}: comp_c_remarks must be a string or null`);
        }
      });

      if (validationErrors.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: 'Validation errors in dispatch assignments',
          errors: validationErrors,
        });
      }

      // Check for already dispatched assignments
      const materialAssignIds = assignments.map(a => a.material_assign_id);
      const [existingDispatches] = await connection.query(
        `SELECT md.material_assign_id, mm.item_name
         FROM material_dispatch md
         JOIN material_assign ma ON md.material_assign_id = ma.id
         JOIN material_master mm ON ma.item_id = mm.item_id
         WHERE md.material_assign_id IN (?)`,
        [materialAssignIds]
      );

      if (existingDispatches.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'already_dispatched',
          message: 'Some materials have already been dispatched',
          conflicts: existingDispatches.map(d => ({
            material_assign_id: d.material_assign_id,
            item_name: d.item_name
          }))
        });
      }

      // Insert dispatch assignments
      dispatchInsertedIds = [];
      for (const { material_assign_id, dc_no, dispatch_date, order_no, vendor_code, comp_a_qty, comp_b_qty, comp_c_qty, comp_a_remarks, comp_b_remarks, comp_c_remarks } of assignments) {
        const [result] = await connection.query(
          'INSERT INTO material_dispatch (material_assign_id, dc_no, dispatch_date, order_no, vendor_code, comp_a_qty, comp_b_qty, comp_c_qty, comp_a_remarks, comp_b_remarks, comp_c_remarks, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
          [material_assign_id, dc_no, dispatch_date, order_no, vendor_code, comp_a_qty, comp_b_qty, comp_c_qty, comp_a_remarks, comp_b_remarks, comp_c_remarks]
        );
        dispatchInsertedIds.push({ material_assign_id, dispatch_id: result.insertId });
      }
    }

    // Validate and insert transport details (if assignments exist)
    let transportInsertedIds = [];
    if (dispatchInsertedIds.length > 0 && transport) {
      let { transport_type_id, provider_id, vehicle_id, driver_id, destination, booking_expense, travel_expense, provider_address, provider_mobile, vehicle_model, vehicle_number, driver_mobile, driver_address } = transport;

      // Validate transport fields
      const transportValidationErrors = [];
      if (!transport_type_id || isNaN(transport_type_id)) {
        transportValidationErrors.push('Transport: transport_type_id is required and must be a number');
      } else {
        const [typeExists] = await connection.query('SELECT id FROM transport_type WHERE id = ? AND id IN (1, 2)', [transport_type_id]);
        if (!typeExists.length) {
          transportValidationErrors.push('Transport: transport_type_id must be 1 (Own Vehicle) or 2 (Rental Vehicle)');
        }
      }
      if (!provider_id || (typeof provider_id === 'string' && provider_id.trim() === '')) {
        transportValidationErrors.push('Transport: provider_id is required and must be a non-empty string or number');
      }
      if (!vehicle_id || (typeof vehicle_id === 'string' && vehicle_id.trim() === '')) {
        transportValidationErrors.push('Transport: vehicle_id is required and must be a non-empty string or number');
      }
      if (!driver_id || (typeof driver_id === 'string' && driver_id.trim() === '')) {
        transportValidationErrors.push('Transport: driver_id is required and must be a non-empty string or number');
      }
      if (!destination || typeof destination !== 'string' || destination.trim() === '') {
        transportValidationErrors.push('Transport: destination is required and must be a non-empty string');
      }
      if (transport_type_id === 2 && (booking_expense === null || isNaN(booking_expense) || booking_expense < 0)) {
        transportValidationErrors.push('Transport: booking_expense is required for Rental Vehicle and must be a non-negative number');
      }
      if (booking_expense !== null && (isNaN(booking_expense) || booking_expense < 0)) {
        transportValidationErrors.push('Transport: booking_expense must be a non-negative number or null');
      }
      if (!travel_expense || isNaN(travel_expense) || travel_expense < 0) {
        transportValidationErrors.push('Transport: travel_expense is required and must be a non-negative number');
      }

      if (transportValidationErrors.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          status: 'error',
          message: 'Validation errors in transport details',
          errors: transportValidationErrors,
        });
      }

      // Handle provider_id
      if (typeof provider_id === 'string') {
        const [existingProvider] = await connection.query('SELECT id FROM provider_master WHERE provider_name = ?', [provider_id]);
        if (existingProvider.length > 0) {
          provider_id = existingProvider[0].id;
        } else {
          const [result] = await connection.query(
            'INSERT INTO provider_master (provider_name, address, mobile, transport_type_id) VALUES (?, ?, ?, ?)',
            [provider_id, provider_address || null, provider_mobile || null, transport_type_id]
          );
          provider_id = result.insertId;
        }
      } else {
        const [providerExists] = await connection.query('SELECT id FROM provider_master WHERE id = ?', [provider_id]);
        if (!providerExists.length) {
          await connection.rollback();
          return res.status(400).json({
            status: 'error',
            message: 'Invalid provider_id: Provider does not exist',
          });
        }
      }

      // Handle vehicle_id
      if (typeof vehicle_id === 'string') {
        const [existingVehicle] = await connection.query('SELECT id FROM vehicle_master WHERE vehicle_name = ? OR vehicle_number = ?', [vehicle_id, vehicle_id]);
        if (existingVehicle.length > 0) {
          vehicle_id = existingVehicle[0].id;
        } else {
          const [result] = await connection.query(
            'INSERT INTO vehicle_master (vehicle_name, vehicle_model, vehicle_number) VALUES (?, ?, ?)',
            [vehicle_id, vehicle_model || null, vehicle_number || vehicle_id]
          );
          vehicle_id = result.insertId;
        }
      } else {
        const [vehicleExists] = await connection.query('SELECT id FROM vehicle_master WHERE id = ?', [vehicle_id]);
        if (!vehicleExists.length) {
          await connection.rollback();
          return res.status(400).json({
            status: 'error',
            message: 'Invalid vehicle_id: Vehicle does not exist',
          });
        }
      }

      // Handle driver_id
      if (typeof driver_id === 'string') {
        const [existingDriver] = await connection.query('SELECT id FROM driver_master WHERE driver_name = ?', [driver_id]);
        if (existingDriver.length > 0) {
          driver_id = existingDriver[0].id;
        } else {
          const [result] = await connection.query(
            'INSERT INTO driver_master (driver_name, driver_mobile, driver_address) VALUES (?, ?, ?)',
            [driver_id, driver_mobile || null, driver_address || null]
          );
          driver_id = result.insertId;
        }
      } else {
        const [driverExists] = await connection.query('SELECT id FROM driver_master WHERE id = ?', [driver_id]);
        if (!driverExists.length) {
          await connection.rollback();
          return res.status(400).json({
            status: 'error',
            message: 'Invalid driver_id: Driver does not exist',
          });
        }
      }

      // Insert transport details for each dispatch
      for (const { dispatch_id } of dispatchInsertedIds) {
        const [result] = await connection.query(
          'INSERT INTO transport_master (dispatch_id, provider_id, destination, vehicle_id, driver_id, booking_expense, travel_expense, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
          [dispatch_id, provider_id, destination, vehicle_id, driver_id, booking_expense || null, travel_expense]
        );
        transportInsertedIds.push(result.insertId);
      }
    }

    await connection.commit();
    res.status(201).json({
      status: 'success',
      message: 'Materials dispatched and transport details saved successfully',
      data: {
        dispatchInsertedIds,
        transportInsertedIds
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Add dispatch error:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid reference: material_assign_id, provider_id, vehicle_id, or driver_id does not exist',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
      sqlMessage: error.sqlMessage || 'No SQL message available',
    });
  } finally {
    connection.release();
  }
};





exports.fetchMaterialAssignmentsWithDispatch = async (req, res) => {
  try {
    const { pd_id, site_id } = req.query;
    let query = `
      SELECT 
        ma.id,
        ma.created_at,
        ma.quantity,
        ma.comp_ratio_a,
        ma.comp_ratio_b,
        ma.comp_ratio_c,
        pd.project_name,
        sd.site_name,
        sd.po_number,
        mm.item_name,
        um.uom_name,
        CASE 
          WHEN md.material_assign_id IS NULL THEN 'not-dispatched'
          ELSE 'dispatched'
        END AS dispatch_status
      FROM material_assign ma
      LEFT JOIN project_details pd ON ma.pd_id = pd.pd_id
      LEFT JOIN site_details sd ON ma.site_id = sd.site_id
      LEFT JOIN material_master mm ON ma.item_id = mm.item_id
      LEFT JOIN uom_master um ON ma.uom_id = um.uom_id
      LEFT JOIN material_dispatch md ON ma.id = md.material_assign_id
      WHERE md.material_assign_id IS NULL
    `;
    const queryParams = [];

    if (pd_id && site_id) {
      query += ' AND ma.pd_id = ? AND ma.site_id = ?';
      queryParams.push(pd_id, site_id);
    } else if (pd_id) {
      query += ' AND ma.pd_id = ?';
      queryParams.push(pd_id);
    } else if (site_id) {
      query += ' AND ma.site_id = ?';
      queryParams.push(site_id);
    }

    const [rows] = await db.query(query, queryParams);

    res.status(200).json({
      status: 'success',
      message: 'Non-dispatched material assignments fetched successfully',
      data: rows,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
      sqlMessage: error.sqlMessage || 'No SQL message available',
    });
  }
};


exports.fetchMaterialDispatchDetails = async (req, res) => {
  try {
    const { pd_id, site_id } = req.query;
    let query = `
      SELECT 
        md.id,
        md.material_assign_id,
        md.dc_no,
        md.dispatch_date,
        md.order_no,
        md.vendor_code,
        md.comp_a_qty,
        md.comp_b_qty,
        md.comp_c_qty,
        md.comp_a_remarks,
        md.comp_b_remarks,
        md.comp_c_remarks,
        md.created_at,
        ma.quantity AS assigned_quantity,
        ma.comp_ratio_a,
        ma.comp_ratio_b,
        ma.comp_ratio_c,
        pd.project_name,
        sd.site_name,
        sd.po_number,
        mm.item_name,
        um.uom_name
      FROM material_dispatch md
      JOIN material_assign ma ON md.material_assign_id = ma.id
      JOIN project_details pd ON ma.pd_id = pd.pd_id
      JOIN site_details sd ON ma.site_id = sd.site_id
      JOIN material_master mm ON ma.item_id = mm.item_id
      JOIN uom_master um ON ma.uom_id = um.uom_id
    `;
    const queryParams = [];

    if (pd_id && site_id) {
      query += ' WHERE ma.pd_id = ? AND ma.site_id = ?';
      queryParams.push(pd_id, site_id);
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Both pd_id and site_id are required',
      });
    }

    const [rows] = await db.query(query, queryParams);

    res.status(200).json({
      status: 'success',
      message: 'Material dispatch details fetched successfully',
      data: rows,
    });
  } catch (error) {
    console.error('Fetch dispatch details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message,
      sqlMessage: error.sqlMessage || 'No SQL message available',
    });
  }
};

exports.getTransportTypes = async function(req, res) {
  try {
    const [rows] = await db.query("SELECT id, type FROM transport_type");
    res.status(200).json({ status: "success", message: "Transport types fetched successfully", data: rows });
  } catch (error) {
    console.error("Error fetching transport types:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch transport types", error: error.message });
  }
};

exports.getProviders = async function(req, res) {
  const { transport_type_id } = req.query;
  try {
    let query = "SELECT id, provider_name FROM provider_master";
    const queryParams = [];
    if (transport_type_id && !isNaN(transport_type_id)) {
      query += " WHERE transport_type_id = ?";
      queryParams.push(transport_type_id);
    }
    const [rows] = await db.query(query, queryParams);
    res.status(200).json({ status: "success", message: "Providers fetched successfully", data: rows });
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch providers", error: error.message });
  }
};


exports.addProvider = async function(req, res) {
  const { provider_name, address, mobile, transport_type_id } = req.body;
  try {
    if (!provider_name || !transport_type_id) {
      return res.status(400).json({ status: "error", message: "Provider name and transport type ID are required" });
    }
    const [result] = await db.query(
      "INSERT INTO provider_master (provider_name, address, mobile, transport_type_id) VALUES (?, ?, ?, ?)",
      [provider_name, address, mobile, transport_type_id]
    );
    res.status(201).json({ status: "success", message: "Provider added successfully", data: { id: result.insertId, provider_name } });
  } catch (error) {
    console.error("Error adding provider:", error);
    res.status(500).json({ status: "error", message: "Failed to add provider", error: error.message });
  }
};

exports.addVehicle = async function(req, res) {
  const { vehicle_name, vehicle_model, vehicle_number } = req.body;
  try {
    if (!vehicle_name || !vehicle_number) {
      return res.status(400).json({ status: "error", message: "Vehicle name and number are required" });
    }
    const [result] = await db.query(
      "INSERT INTO vehicle_master (vehicle_name, vehicle_model, vehicle_number) VALUES (?, ?, ?)",
      [vehicle_name, vehicle_model, vehicle_number]
    );
    res.status(201).json({ status: "success", message: "Vehicle added successfully", data: { id: result.insertId, vehicle_name, vehicle_model, vehicle_number } });
  } catch (error) {
    console.error("Error adding vehicle:", error);
    res.status(500).json({ status: "error", message: "Failed to add vehicle", error: error.message });
  }
};

exports.addDriver = async function(req, res) {
  const { driver_name, driver_mobile, driver_address } = req.body;
  try {
    if (!driver_name) {
      return res.status(400).json({ status: "error", message: "Driver name is required" });
    }
    const [result] = await db.query(
      "INSERT INTO driver_master (driver_name, driver_mobile, driver_address) VALUES (?, ?, ?)",
      [driver_name, driver_mobile, driver_address]
    );
    res.status(201).json({ status: "success", message: "Driver added successfully", data: { id: result.insertId, driver_name, driver_mobile, driver_address } });
  } catch (error) {
    console.error("Error adding driver:", error);
    res.status(500).json({ status: "error", message: "Failed to add driver", error: error.message });
  }
};

exports.addTransport = async function(req, res) {
  const { dispatch_id, provider_id, destination, vehicle_id, driver_id, booking_expense, travel_expense } = req.body;
  try {
    if (!dispatch_id || !provider_id || !destination || !vehicle_id || !driver_id || !travel_expense) {
      return res.status(400).json({ status: "error", message: "Dispatch ID, provider ID, destination, vehicle ID, driver ID, and travel expense are required" });
    }
    const [result] = await db.query(
      "INSERT INTO transport_master (dispatch_id, provider_id, destination, vehicle_id, driver_id, booking_expense, travel_expense, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [dispatch_id, provider_id, destination, vehicle_id, driver_id, booking_expense || null, travel_expense]
    );
    res.status(201).json({ status: "success", message: "Transport added successfully", data: { id: result.insertId } });
  } catch (error) {
    console.error("Error adding transport:", error);
    res.status(500).json({ status: "error", message: "Failed to add transport", error: error.message });
  }
};

exports.getVehicles = async function(req, res) {
  try {
    const [rows] = await db.query("SELECT id, vehicle_name, vehicle_model, vehicle_number FROM vehicle_master");
    res.status(200).json({ status: "success", message: "Vehicles fetched successfully", data: rows });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch vehicles", error: error.message });
  }
};

exports.getDrivers = async function(req, res) {
  try {
    const [rows] = await db.query("SELECT id, driver_name, driver_mobile, driver_address FROM driver_master");
    res.status(200).json({ status: "success", message: "Drivers fetched successfully", data: rows });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch drivers", error: error.message });
  }
};