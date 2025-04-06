const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Changed from /create to /create-company but kept the same controller function
router.post("/create", projectController.createCompany); // This matches your frontend request
router.get("/companies", projectController.getAllCompanies);
router.put("/update/:company_id", projectController.updateCompany);

router.post("/create-project-site", projectController.createProjectWithSite);

router.get("/workforce-types", projectController.fetchWorkforceTypes);
router.get("/site-incharges", projectController.fetchSiteIncharges);
router.get("/project-type", projectController.projectType);

router.get('/projects-with-sites', projectController.getAllProjectsWithSites);
router.get('/projects-with-sites/:companyId', projectController.getAllProjectsWithSitesByCompanyId); // Add this new route



module.exports = router;
