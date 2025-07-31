const express = require("express");
const router = express.Router();
const materialController = require("../controllers/materialController");

router.get("/test", materialController.test);
router.post("/dispatch-material", materialController.dispatchMaterialToSite);
router.get("/materials", materialController.fetchMaterialMaster);
router.get("/projects", materialController.fetchProjects);
router.get("/sites/:pd_id", materialController.fetchSites);
router.get("/material-assignments", materialController.fetchMaterialAssignments);
router.get("/uom", materialController.fetchUomMaster);
router.get("/designations", materialController.fetchDesignations);
router.get("/employees", materialController.fetchEmployees);
router.post("/assign-incharge", materialController.assignInchargeToSite);
router.post("/add-employee", materialController.addEmployee);
router.get("/assigned-incharges", materialController.getAssignedIncharges);
router.get("/genders", materialController.fetchGenders);
router.get("/departments", materialController.fetchDepartments);
router.get("/employment-types", materialController.fetchEmploymentTypes);
router.post("/genders", materialController.addGender);
router.post("/departments", materialController.addDepartment);
router.post("/employment-types", materialController.addEmploymentType);
router.post("/designations", materialController.addDesignation);
router.get("/statuses", materialController.fetchStatuses);
router.post("/assign-material", materialController.assignMaterial);
router.get('/assigned-materials', materialController.getAssignedMaterials);

router.post("/add-dispatch", materialController.addMaterialDispatch);
router.get("/assignments-with-dispatch", materialController.fetchMaterialAssignmentsWithDispatch);

module.exports = router;