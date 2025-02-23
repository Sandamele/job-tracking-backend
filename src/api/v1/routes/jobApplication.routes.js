const { createJobApplication, getAllJobApplications, getJobApplication, deleteJobApplication, updateJobApplication} = require("../controllers/jobApplication.controllers");
const jobApplicationValidator = require("../validator/jobApplication.validator");

const router = require("express").Router();

router.post("/", jobApplicationValidator,createJobApplication)
router.get("/", getAllJobApplications);
router.get("/:id", getJobApplication);
router.delete("/:id", deleteJobApplication);
router.put("/:id", updateJobApplication)
module.exports = router;