// const express = require("express");
// const router = express.Router();
// const projectController = require("../controllers/projectController");

// router.post("/create-company", projectController.createCompany);
// router.get("/companies", projectController.getAllCompanies);
// router.get("/companies/:companyId", projectController.getCompanyById);
// router.get("/projects/:companyId", projectController.getProjectsByCompanyId);
// router.put("/companies", projectController.updateCompany);
// router.post("/create-project-site", projectController.createProjectWithSite);
// router.get("/workforce-types", projectController.fetchWorkforceTypes);
// router.get("/site-incharges", projectController.fetchSiteIncharges);
// router.get("/project-type", projectController.projectType);
// router.get("/projects-with-sites", projectController.getAllProjectsWithSites);
// router.get("/projects-with-sites/:companyId", projectController.getAllProjectsWithSitesByCompanyId);

// router.get("/locations", projectController.getAllLocations);

// router.post("/create-project", projectController.createProject);
// module.exports = router;














const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/create-company", projectController.createCompany);
router.get("/companies", projectController.getAllCompanies);
router.get("/companies/:companyId", projectController.getCompanyById);
router.get("/projects/:companyId", projectController.getProjectsByCompanyId);
router.put("/companies", projectController.updateCompany);
router.post("/create-project-site", projectController.createProjectWithSite);
router.get("/workforce-types", projectController.fetchWorkforceTypes);
router.get("/site-incharges", projectController.fetchSiteIncharges);
router.get("/project-type", projectController.projectType);
router.get("/projects-with-sites", projectController.getAllProjectsWithSites);
router.get("/projects-with-sites/:companyId", projectController.getAllProjectsWithSitesByCompanyId);
router.get("/locations", projectController.getAllLocations);
router.post("/create-project", projectController.createProject);
router.get("/reckoner-types", projectController.getReckonerTypes);
router.get("/next-po-number/:reckoner_type_id", projectController.getNextPoNumber);

module.exports = router;