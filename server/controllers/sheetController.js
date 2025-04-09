const { format, isAfter } = require("date-fns");
const db = require("../config/db");

const {
  createConsumable,
  getAllConsumable,
  getConsumableById,
  updateConsumable,
  deleteConsumable,
  getNewSites,
  appendDateRangeToReportMaster,
  getSiteDateRange,
  getReportsBySite,
  getCategoriesForSite,
  getSubcategoriesForCategory,
  createDynamicTableStructure,
  syncReportIdsToDynamicTable,
  addDynamicColumn,
  checkSiteInPoReckoner,
  checkSiteInReportMaster,
} = require("../models/sheetModel");

exports.createConsumable = async (req, res) => {
  try {
    const { consumable_name } = req.body;
    if (!consumable_name) {
      return res.status(400).json({ message: "Consumable name is required" });
    }

    const consumableId = await createConsumable(consumable_name);
    res.status(201).json({
      message: "Consumable createConsumabled successfully",
      consumable_id: consumableId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating consumable" });
  }
};

exports.getAllConsumable = async (req, res) => {
  try {
    const consumables = await getAllConsumable();
    res.status(200).json(consumables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching consumables" });
  }
};

exports.getConsumableById = async (req, res) => {
  try {
    const { id } = req.params;
    const consumable = await getConsumableById(id);

    if (!consumable) {
      return res.status(404).json({ message: "Consumable not found" });
    }

    res.status(200).json(consumable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching consumable" });
  }
};

exports.updateConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    const { consumable_name } = req.body;

    if (!consumable_name) {
      return res.status(400).json({ message: "Consumable name is required" });
    }

    const isUpdated = await updateConsumable(id, consumable_name);

    if (!isUpdated) {
      return res.status(404).json({ message: "Consumable not found" });
    }

    res
      .status(200)
      .json({ message: "Consumable updateConsumabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating consumable" });
  }
};

exports.deleteConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await deleteConsumable(id);

    if (!isDeleted) {
      return res.status(404).json({ message: "Consumable not found" });
    }

    res
      .status(200)
      .json({ message: "Consumable deleteConsumabled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting consumable" });
  }
};

exports.processSiteReports = async (req, res) => {
  try {
    // Get only new sites (those in po_reckoner but not in report_master)
    const newSites = await getNewSites();
    const results = [];

    if (newSites.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No new sites to process - all sites already exist in report_master",
        data: [],
      });
    }

    for (const site of newSites) {
      const siteId = site.site_id;
      const siteResult = {
        site_id: siteId,
        tables_processed: [],
      };

      const siteDetails = await getSiteDateRange(siteId);

      if (!siteDetails) {
        siteResult.report_status = "skipped";
        siteResult.report_reason = "No site details found";
        results.push(siteResult);
        continue;
      }

      let { start_date, end_date } = siteDetails;
      start_date = format(new Date(start_date), "yyyy-MM-dd");
      end_date = format(new Date(end_date), "yyyy-MM-dd");

      if (isAfter(new Date(start_date), new Date(end_date))) {
        siteResult.report_status = "skipped";
        siteResult.report_reason = "End date is before start date";
        results.push(siteResult);
        continue;
      }

      try {
        // Append dates to report_master (won't process if site exists)
        const reportMasterResult = await appendDateRangeToReportMaster(
          siteId,
          start_date,
          end_date
        );

        if (reportMasterResult.status === "skipped") {
          siteResult.report_status = "skipped";
          siteResult.report_reason = reportMasterResult.reason;
          results.push(siteResult);
          continue;
        }

        siteResult.report_status = "processed";
        siteResult.dates_generated = reportMasterResult.datesGenerated;
        siteResult.report_ids = reportMasterResult.reportIds;

        // Process dynamic tables for each category
        const categories = await getCategoriesForSite(siteId);

        for (const category of categories) {
          const tableResult = {
            category_id: category.category_id,
            category_name: category.category_name,
            table_status: "",
            report_sync: {},
            columns: [],
          };

          // Create table structure if not exists
          const tableCreation = await createDynamicTableStructure(
            category.category_name
          );
          tableResult.table_status = tableCreation.status;

          // Sync report_ids to the table
          if (
            tableCreation.status === "exists" ||
            tableCreation.status === "created"
          ) {
            const syncResult = await syncReportIdsToDynamicTable(
              category.category_name,
              siteId
            );

            tableResult.report_sync = {
              status: syncResult.status,
              report_ids_processed: syncResult.report_ids_processed || 0,
              combinations_added: syncResult.combinations_added || 0,
              type_ids_used: syncResult.type_ids_used || [],
            };
          }

          // Process subcategories (columns)
          const subcategories = await getSubcategoriesForCategory(
            siteId,
            category.category_id
          );

          for (const subcategory of subcategories) {
            const columnResult = await addDynamicColumn(
              category.category_name,
              subcategory.subcategory_name
            );

            tableResult.columns.push({
              subcategory_id: subcategory.subcategory_id,
              subcategory_name: subcategory.subcategory_name,
              status: columnResult.status,
            });
          }

          siteResult.tables_processed.push(tableResult);
        }
      } catch (error) {
        siteResult.report_status = "error";
        siteResult.error = error.message;
      }

      results.push(siteResult);
    }

    res.status(200).json({
      success: true,
      message: "New site processing completed",
      data: results,
    });
  } catch (error) {
    console.error("Error processing site reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process site reports",
      error: error.message,
    });
  }
};



// exports.processSiteReportsById = async (req, res) => {
//   try {
//     const { site_id } = req.params;
//     const results = [];

//     // Check if site exists in po_reckoner
//     const siteCheck = await checkSiteInPoReckoner(site_id);

//     if (!siteCheck || siteCheck.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Site not found in po_reckoner",
//       });
//     }

//     const siteResult = {
//       site_id: site_id,
//       tables_processed: [],
//     };

//     // Check if site already exists in report_master
//     const existing = await checkSiteInReportMaster(site_id);
//     if (existing > 0) {
//       siteResult.report_status = "skipped";
//       siteResult.report_reason = "Site already exists in report_master";
//       results.push(siteResult);
//       return res.status(200).json({
//         success: true,
//         message: "Site already processed",
//         data: results,
//       });
//     }

//     const siteDetails = await getSiteDateRange(site_id);

//     if (!siteDetails) {
//       siteResult.report_status = "skipped";
//       siteResult.report_reason = "No site details found";
//       results.push(siteResult);
//       return res.status(404).json({
//         success: false,
//         message: "No site details found",
//         data: results,
//       });
//     }

//     let { start_date, end_date } = siteDetails;
//     start_date = format(new Date(start_date), "yyyy-MM-dd");
//     end_date = format(new Date(end_date), "yyyy-MM-dd");

//     if (isAfter(new Date(start_date), new Date(end_date))) {
//       siteResult.report_status = "skipped";
//       siteResult.report_reason = "End date is before start date";
//       results.push(siteResult);
//       return res.status(400).json({
//         success: false,
//         message: "End date is before start date",
//         data: results,
//       });
//     }

//     try {
//       // Append dates to report_master
//       const reportMasterResult = await appendDateRangeToReportMaster(
//         site_id,
//         start_date,
//         end_date
//       );

//       if (reportMasterResult.status === "skipped") {
//         siteResult.report_status = "skipped";
//         siteResult.report_reason = reportMasterResult.reason;
//         results.push(siteResult);
//         return res.status(200).json({
//           success: true,
//           message: reportMasterResult.reason,
//           data: results,
//         });
//       }

//       siteResult.report_status = "processed";
//       siteResult.dates_generated = reportMasterResult.datesGenerated;
//       siteResult.report_ids = reportMasterResult.reportIds;

//       // Process dynamic tables for each category
//       const categories = await getCategoriesForSite(site_id);

//       for (const category of categories) {
//         const tableResult = {
//           category_id: category.category_id,
//           category_name: category.category_name,
//           table_status: "",
//           report_sync: {},
//           columns: [],
//         };

//         // Create table structure if not exists
//         const tableCreation = await createDynamicTableStructure(
//           category.category_name
//         );
//         tableResult.table_status = tableCreation.status;

//         // Sync report_ids to the table
//         if (
//           tableCreation.status === "exists" ||
//           tableCreation.status === "created"
//         ) {
//           const syncResult = await syncReportIdsToDynamicTable(
//             category.category_name,
//             site_id
//           );

//           tableResult.report_sync = {
//             status: syncResult.status,
//             report_ids_processed: syncResult.report_ids_processed || 0,
//             combinations_added: syncResult.combinations_added || 0,
//             type_ids_used: syncResult.type_ids_used || [],
//           };
//         }

//         // Process subcategories (columns)
//         const subcategories = await getSubcategoriesForCategory(
//           site_id,
//           category.category_id
//         );

//         for (const subcategory of subcategories) {
//           const columnResult = await addDynamicColumn(
//             category.category_name,
//             subcategory.subcategory_name
//           );

//           tableResult.columns.push({
//             subcategory_id: subcategory.subcategory_id,
//             subcategory_name: subcategory.subcategory_name,
//             status: columnResult.status,
//           });
//         }

//         siteResult.tables_processed.push(tableResult);
//       }

//       results.push(siteResult);

//       res.status(200).json({
//         success: true,
//         message: "Site processing completed",
//         data: results,
//       });
//     } catch (error) {
//       siteResult.report_status = "error";
//       siteResult.error = error.message;
//       results.push(siteResult);
//       res.status(500).json({
//         success: false,
//         message: "Error processing site",
//         error: error.message,
//         data: results,
//       });
//     }
//   } catch (error) {
//     console.error("Error processing site reports by ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to process site reports",
//       error: error.message,
//     });
//   }
// };



exports.processSiteReportsByPO = async (req, res) => {
  try {
    const { po_number } = req.params; // Changed from site_id to po_number
    const results = [];

    // First, get site_id from site_details using po_number
    const siteDetails = await getSiteByPoNumber(po_number);
    
    if (!siteDetails || !siteDetails.site_id) {
      return res.status(404).json({
        success: false,
        message: "Site not found with the provided PO number",
      });
    }

    const site_id = siteDetails.site_id;

    // Check if site exists in po_reckoner
    const siteCheck = await checkSiteInPoReckoner(site_id);

    if (!siteCheck || siteCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site not found in po_reckoner",
      });
    }

    const siteResult = {
      po_number: po_number, // Include PO number in response
      site_id: site_id,
      tables_processed: [],
    };

    // Check if site already exists in report_master
    const existing = await checkSiteInReportMaster(site_id);
    if (existing > 0) {
      siteResult.report_status = "skipped";
      siteResult.report_reason = "Site already exists in report_master";
      results.push(siteResult);
      return res.status(200).json({
        success: true,
        message: "Site already processed",
        data: results,
      });
    }

    const siteDateRange = await getSiteDateRange(site_id);

    if (!siteDateRange) {
      siteResult.report_status = "skipped";
      siteResult.report_reason = "No site details found";
      results.push(siteResult);
      return res.status(404).json({
        success: false,
        message: "No site details found",
        data: results,
      });
    }

    let { start_date, end_date } = siteDateRange;
    start_date = format(new Date(start_date), "yyyy-MM-dd");
    end_date = format(new Date(end_date), "yyyy-MM-dd");

    if (isAfter(new Date(start_date), new Date(end_date))) {
      siteResult.report_status = "skipped";
      siteResult.report_reason = "End date is before start date";
      results.push(siteResult);
      return res.status(400).json({
        success: false,
        message: "End date is before start date",
        data: results,
      });
    }

    try {
      // Append dates to report_master
      const reportMasterResult = await appendDateRangeToReportMaster(
        site_id,
        start_date,
        end_date
      );

      if (reportMasterResult.status === "skipped") {
        siteResult.report_status = "skipped";
        siteResult.report_reason = reportMasterResult.reason;
        results.push(siteResult);
        return res.status(200).json({
          success: true,
          message: reportMasterResult.reason,
          data: results,
        });
      }

      siteResult.report_status = "processed";
      siteResult.dates_generated = reportMasterResult.datesGenerated;
      siteResult.report_ids = reportMasterResult.reportIds;

      // Process dynamic tables for each category
      const categories = await getCategoriesForSite(site_id);

      for (const category of categories) {
        const tableResult = {
          category_id: category.category_id,
          category_name: category.category_name,
          table_status: "",
          report_sync: {},
          columns: [],
        };

        // Create table structure if not exists
        const tableCreation = await createDynamicTableStructure(
          category.category_name
        );
        tableResult.table_status = tableCreation.status;

        // Sync report_ids to the table
        if (
          tableCreation.status === "exists" ||
          tableCreation.status === "created"
        ) {
          const syncResult = await syncReportIdsToDynamicTable(
            category.category_name,
            site_id
          );

          tableResult.report_sync = {
            status: syncResult.status,
            report_ids_processed: syncResult.report_ids_processed || 0,
            combinations_added: syncResult.combinations_added || 0,
            type_ids_used: syncResult.type_ids_used || [],
          };
        }

        // Process subcategories (columns)
        const subcategories = await getSubcategoriesForCategory(
          site_id,
          category.category_id
        );

        for (const subcategory of subcategories) {
          const columnResult = await addDynamicColumn(
            category.category_name,
            subcategory.subcategory_name
          );

          tableResult.columns.push({
            subcategory_id: subcategory.subcategory_id,
            subcategory_name: subcategory.subcategory_name,
            status: columnResult.status,
          });
        }

        siteResult.tables_processed.push(tableResult);
      }

      results.push(siteResult);

      res.status(200).json({
        success: true,
        message: "Site processing completed",
        data: results,
      });
    } catch (error) {
      siteResult.report_status = "error";
      siteResult.error = error.message;
      results.push(siteResult);
      res.status(500).json({
        success: false,
        message: "Error processing site",
        error: error.message,
        data: results,
      });
    }
  } catch (error) {
    console.error("Error processing site reports by PO number:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process site reports",
      error: error.message,
    });
  }
};

// Helper function to get site by PO number
async function getSiteByPoNumber(po_number) {
  const query = 'SELECT site_id FROM site_details WHERE po_number = ? LIMIT 1';
  const [rows] = await db.query(query, [po_number]);
  return rows[0] || null;
}


exports.getSiteReports = async (req, res) => {
  try {
    const { site_id } = req.params;
    const reports = await getReportsBySite(site_id);

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reports found for this site",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        site_id: site_id,
        site_name: reports[0].site_name,
        start_date: reports[0].date,
        end_date: reports[reports.length - 1].date,
        total_days: reports.length,
        reports: reports.map((r) => ({
          report_id: r.report_id,
          date: r.date,
          site_id: r.site_id,
          site_name: r.site_name,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching site reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch site reports",
      error: error.message,
    });
  }
};
