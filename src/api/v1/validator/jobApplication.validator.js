const { body } = require("express-validator")

const jobApplicationValidator = [
    body("company","Company name required").notEmpty(),
    body("position","Position name required").notEmpty(),
    body("status", "Status is required")
    .notEmpty()
    .isIn(["applied", "no answer", "interview scheduled", "pass", "rejected", "interviewing"])
    .withMessage("Invalid status. Allowed values: applied, no answer, interview scheduled, pass, rejected, interviewing"),
]
module.exports = jobApplicationValidator;