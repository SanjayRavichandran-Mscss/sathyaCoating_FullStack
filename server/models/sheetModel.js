const db = require("../config/db");
const { addDays, format, isAfter } = require("date-fns");
exports.createConsumable = async (consumableName) => {
  try {
    const [result] = await db.query(
      "INSERT INTO consumables_master (consumable_name) VALUES (?)",
      [consumableName]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

exports.getAllConsumables = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM consumables_master");
    return rows;
  } catch (error) {
    throw error;
  }
};

exports.getConsumableById = async (consumableId) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM consumables_master WHERE consumable_id = ?",
      [consumableId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.updateConsumable = async (consumableId, consumableName) => {
  try {
    const [result] = await db.query(
      "UPDATE consumables_master SET consumable_name = ? WHERE consumable_id = ?",
      [consumableName, consumableId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

exports.deleteConsumable = async (consumableId) => {
  try {
    const [result] = await db.query(
      "DELETE FROM consumables_master WHERE consumable_id = ?",
      [consumableId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// 🟢 Get only new site_ids (those in po_reckoner but not in report_master)
exports.getNewSites = async () => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT pr.site_id 
       FROM po_reckoner pr
       LEFT JOIN report_master rm ON pr.site_id = rm.site_id
       WHERE rm.site_id IS NULL`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// 🟢 Get site details with date range
exports.getSiteDateRange = async (siteId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        site_id, 
        site_name, 
        DATE(start_date) AS start_date, 
        DATE(end_date) AS end_date 
       FROM site_details 
       WHERE site_id = ?`,
      [siteId]
    );
    return rows[0];
  } catch (error) {
    throw error;
  }
};

// 🟢 Append date range to report_master (without deleting existing)
exports.appendDateRangeToReportMaster = async (siteId, startDate, endDate) => {
  try {
    const start = format(new Date(startDate), "yyyy-MM-dd");
    const end = format(new Date(endDate), "yyyy-MM-dd");

    if (isAfter(new Date(start), new Date(end))) {
      throw new Error("End date must be after start date");
    }

    // Check if site already has entries
    const [existing] = await db.query(
      "SELECT COUNT(*) AS count FROM report_master WHERE site_id = ?",
      [siteId]
    );

    if (existing[0].count > 0) {
      return {
        status: "skipped",
        reason: "Site already exists in report_master",
      };
    }

    const dates = [];
    let currentDate = new Date(start);
    const endDateObj = new Date(end);

    while (currentDate <= endDateObj) {
      dates.push(format(currentDate, "yyyy-MM-dd"));
      currentDate = addDays(currentDate, 1);
    }

    await db.query("START TRANSACTION");

    const insertValues = dates.map((date) => [siteId, date]);
    await db.query("INSERT INTO report_master (site_id, date) VALUES ?", [
      insertValues,
    ]);

    const [reportRows] = await db.query(
      "SELECT report_id FROM report_master WHERE site_id = ? ORDER BY date",
      [siteId]
    );

    await db.query("COMMIT");

    return {
      status: "appended",
      datesGenerated: dates.length,
      reportIds: reportRows.map((r) => r.report_id),
    };
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

// 🟢 Get all reports by site_id
exports.getReportsBySite = async (siteId) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        r.report_id, 
        DATE(r.date) AS date, 
        r.site_id, 
        s.site_name
       FROM report_master r
       JOIN site_details s ON r.site_id = s.site_id
       WHERE r.site_id = ?
       ORDER BY r.date`,
      [siteId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// 🟢 Get all categories for a site
exports.getCategoriesForSite = async (siteId) => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT pr.category_id, ic.category_name
       FROM po_reckoner pr
       JOIN item_category ic ON pr.category_id = ic.category_id
       WHERE pr.site_id = ?`,
      [siteId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// 🟢 Get all subcategories for a site and category
exports.getSubcategoriesForCategory = async (siteId, categoryId) => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT pr.subcategory_id, isc.subcategory_name
       FROM po_reckoner pr
       JOIN item_subcategory isc ON pr.subcategory_id = isc.subcategory_id
       WHERE pr.site_id = ? AND pr.category_id = ?`,
      [siteId, categoryId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// Sanitize table names
function sanitizeName(name) {
  return name.replace(/\s+/g, "_").toLowerCase();
}

// Get all report_type_ids (1, 2, 3)
exports.getReportTypeIds = async () => {
  try {
    const [rows] = await db.query(
      "SELECT type_id FROM report_type ORDER BY type_id"
    );
    return rows.map((row) => row.type_id);
  } catch (error) {
    throw error;
  }
};

// Create or update dynamic table with report_id × report_type_id combinations
exports.syncReportIdsToDynamicTable = async (tableName, siteId) => {
  const sanitizedTableName = sanitizeName(tableName);

  try {
    const [reportRows] = await db.query(
      `SELECT report_id FROM report_master 
       WHERE site_id = ? ORDER BY report_id`,
      [siteId]
    );

    if (reportRows.length === 0) {
      return { status: "skipped", reason: "No reports found for site" };
    }

    const reportIds = reportRows.map((row) => row.report_id);
    const typeIds = await this.getReportTypeIds();
    if (typeIds.length === 0) {
      return { status: "skipped", reason: "No report types found" };
    }

    const [tableExists] = await db.query(
      `SELECT COUNT(*) AS count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [sanitizedTableName]
    );

    if (tableExists[0].count === 0) {
      return { status: "skipped", reason: "Dynamic table does not exist" };
    }

    const combinations = [];
    for (const reportId of reportIds) {
      for (const typeId of typeIds) {
        combinations.push([reportId, typeId]);
      }
    }

    const [result] = await db.query(
      `INSERT IGNORE INTO \`${sanitizedTableName}\` 
       (report_id, report_type_id) VALUES ?`,
      [combinations]
    );

    return {
      status: "success",
      table: sanitizedTableName,
      site_id: siteId,
      report_ids_processed: reportIds.length,
      combinations_added: result.affectedRows,
      type_ids_used: typeIds,
    };
  } catch (error) {
    console.error(
      `Error syncing report_ids to table ${sanitizedTableName}:`,
      error
    );
    throw error;
  }
};

// Create dynamic table structure
exports.createDynamicTableStructure = async (tableName) => {
  const sanitizedTableName = sanitizeName(tableName);

  try {
    const [tableExists] = await db.query(
      `SELECT COUNT(*) AS count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [sanitizedTableName]
    );

    if (tableExists[0].count > 0) {
      return { status: "exists", table: sanitizedTableName };
    }

    await db.query(`
      CREATE TABLE \`${sanitizedTableName}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_id INT NOT NULL,
        report_type_id INT NOT NULL,
        FOREIGN KEY (report_id) REFERENCES report_master(report_id) ON DELETE CASCADE,
        FOREIGN KEY (report_type_id) REFERENCES report_type(type_id) ON DELETE CASCADE,
        UNIQUE KEY unique_report_type (report_id, report_type_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    return {
      status: "created",
      table: sanitizedTableName,
    };
  } catch (error) {
    console.error(`Error creating table ${sanitizedTableName}:`, error);
    throw error;
  }
};

// Add dynamic columns (main column + _rate + _value) to dynamic table
exports.addDynamicColumn = async (tableName, columnName) => {
  const sanitizedTableName = sanitizeName(tableName);
  const baseColumnName = sanitizeName(columnName);

  try {
    const columnsToAdd = [
      { name: baseColumnName, type: "DECIMAL(10,2) DEFAULT NULL" },
      { name: `${baseColumnName}_rate`, type: "DECIMAL(10,2) DEFAULT NULL" },
      { name: `${baseColumnName}_value`, type: "DECIMAL(10,2) DEFAULT NULL" },
    ];

    const results = [];
    let columnsAdded = 0;

    for (const column of columnsToAdd) {
      const [columnCheck] = await db.query(
        `SELECT COUNT(*) AS count FROM information_schema.columns 
         WHERE table_schema = DATABASE() 
         AND table_name = ? 
         AND column_name = ?`,
        [sanitizedTableName, column.name]
      );

      if (columnCheck[0].count === 0) {
        await db.query(`ALTER TABLE ?? ADD COLUMN ?? ${column.type}`, [
          sanitizedTableName,
          column.name,
        ]);
        results.push({
          column: column.name,
          status: "created",
        });
        columnsAdded++;
      } else {
        results.push({
          column: column.name,
          status: "exists",
        });
      }
    }

    const totalColumns = [
      { name: "total_rate", type: "DECIMAL(10,2) DEFAULT NULL" },
      { name: "total_value", type: "DECIMAL(10,2) DEFAULT NULL" },
    ];

    for (const totalCol of totalColumns) {
      const [colCheck] = await db.query(
        `SELECT COUNT(*) AS count FROM information_schema.columns 
         WHERE table_schema = DATABASE() 
         AND table_name = ? 
         AND column_name = ?`,
        [sanitizedTableName, totalCol.name]
      );

      if (colCheck[0].count === 0) {
        await db.query(`ALTER TABLE ?? ADD COLUMN ?? ${totalCol.type}`, [
          sanitizedTableName,
          totalCol.name,
        ]);
        results.push({
          column: totalCol.name,
          status: "created",
        });
        columnsAdded++;
      } else {
        results.push({
          column: totalCol.name,
          status: "exists",
        });
      }
    }

    return {
      status: columnsAdded > 0 ? "columns_added" : "all_exist",
      details: results,
      columns_added: columnsAdded,
    };
  } catch (error) {
    console.error("Error adding dynamic columns:", error.message);
    throw error;
  }
};

// Helper function to check if site exists in po_reckoner
exports.checkSiteInPoReckoner = async (siteId) => {
  try {
    const [rows] = await db.query(
      "SELECT site_id FROM po_reckoner WHERE site_id = ? LIMIT 1",
      [siteId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

// Helper function to check if site exists in report_master
exports.checkSiteInReportMaster = async (siteId) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM report_master WHERE site_id = ?",
      [siteId]
    );
    return rows[0].count;
  } catch (error) {
    throw error;
  }
};
