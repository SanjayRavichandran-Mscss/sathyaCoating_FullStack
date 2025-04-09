const express = require("express");
const router = express.Router();
const reckonerController = require("../controllers/reckonerController");

// Category CRUD routes
router.get("/categories", reckonerController.getAllCategories);
router.get("/categories/:id", reckonerController.getCategoryById);
router.post("/categories", reckonerController.createCategory);
router.put("/categories/:id", reckonerController.updateCategory);
router.delete("/categories/:id", reckonerController.deleteCategory);

// Subcategory CRUD routes
router.get("/subcategories", reckonerController.getAllSubcategories);
router.get("/subcategories/:id", reckonerController.getSubcategoryById);
router.post("/subcategories", reckonerController.createSubcategory);
router.put("/subcategories/:id", reckonerController.updateSubcategory);
router.delete("/subcategories/:id", reckonerController.deleteSubcategory);

// Work Items routes
router.get("/work-items", reckonerController.getAllWorkItems);
router.get("/work-items/:id", reckonerController.getWorkItemById);
router.post("/work-items", reckonerController.createWorkItem);
router.post("/work-items/bulk", reckonerController.createMultipleWorkItems);
router.put("/work-items/:id", reckonerController.updateWorkItem);
router.delete("/work-items/:id", reckonerController.deleteWorkItem);

// Reckoner operations

router.post("/reckoner", reckonerController.saveReckonerData);

// get site_id by po_number
router.get("/sites/:poNumber", reckonerController.getSiteByPoNumber);

// Add these routes along with your existing routes
router.get("/reckoner", reckonerController.getAllReckonerWithStatus);
router.get(
  "/reckoner/:poNumber",
  reckonerController.getReckonerByPoNumberWithStatus
);

router.patch(
  "/completion_status/:rec_id",
  reckonerController.updateCompletionStatus
);


// check if po-reckoner exists 
router.get('/check-po-reckoner/:site_id', reckonerController.checkPoReckoner);


module.exports = router;
