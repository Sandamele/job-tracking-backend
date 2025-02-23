const { validationResult } = require("express-validator");
const formatValidationErrors = require("../../../utils/formatValidationErrors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const createJobApplication = async (req, res) => {
    try {

        const { errors } = validationResult(req);

        if (errors.length > 0) {
            return res.status(400).json({ data: null, error: formatValidationErrors(errors) });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ data: null, error: { message: "Unauthorized" } });
        }

        const userId = req.user?.id;

        const {
            company,
            position,
            status,
            flexibility = null,
            location = null,
            interviewer = null,
            link = null,
            notes = null,
            interviewDate = null
        } = req.body;

        const jobApplication = await prisma.jobApplication.create({
            data: {
                userId,
                company,
                position,
                status,
                flexibility,
                location,
                interviewer,
                link,
                notes,
                interviewDate
            }
        });
        return res.status(200).json({ data: jobApplication, error: null });
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({ data: null, error: "Internal server error" });
    }
}
const getAllJobApplications = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ data: null, error: { message: "Unauthorized" } });
        }
        const userId = req.user.id;
        let { page = 1, pageSize = 10 } = req.query;
        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);
        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ data: null, error: "Page and pageSize must be positive numbers" });
        }

        const jobApplications = await prisma.jobApplication.findMany({
            where: { userId: { equals: userId } },
            skip: (page - 1) * pageSize, take: pageSize
        });
        const totalJobApplicationsUser = await prisma.jobApplication.count({ where: { userId } })
        const totalJobApplications = await prisma.jobApplication.count();
        const formatJobApplication = jobApplications.map((job) => {
            delete job.userId
            return job;
        })

        return res.status(200).json({
            data: formatJobApplication, meta: {
                pagination: {
                    page,
                    pageSize,
                    pageCount: totalJobApplicationsUser,
                    total: totalJobApplications
                }
            }, error: null
        });
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({ data: null, error: "Internal server error" });
    }
}
const getJobApplication = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ data: null, error: { message: "Unauthorized" } });
        }
        const userId = req.user.id;
        const jobApplicationId = req.params.id;
        const jobApplication = await prisma.jobApplication.findUnique({
            where: {
                id: jobApplicationId,
                userId: userId
            }
        });

        if (jobApplication === null) {
            return res.status(404).json({ data: "Job application not found", error: null });
        }

        delete jobApplication.userId;
        return res.status(200).json({ data: jobApplication, error: null })
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({ data: null, error: "Internal server error" });
    }
}

const deleteJobApplication = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ data: null, error: { message: "Unauthorized" } });
        }
        const userId = req.user.id;
        const jobApplicationId = req.params.id;
        const jobApplicationExist = await prisma.jobApplication.findUnique({
            where: {
                id: jobApplicationId,
                userId: userId
            }
        });

        if (jobApplicationExist === null) {
            return res.status(404).json({ data: "Job application not found", error: null });
        }

        await prisma.jobApplication.delete({
            where: {
                id: jobApplicationId,
                userId: userId
            }
        });

        return res.status(200).json({ data: { deleted: true }, error: null })
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({ data: null, error: "Internal server error" });
    }
}

const updateJobApplication = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ data: null, error: { message: "Unauthorized" } });
        }
        const userId = req.user.id;
        const jobApplicationId = req.params.id;
        const jobApplicationExist = await prisma.jobApplication.findUnique({
            where: {
                id: jobApplicationId,
                userId: userId
            }
        });

        if (jobApplicationExist === null) {
            return res.status(404).json({ data: "Job application not found", error: null });
        }
        const { company, position, status, flexibility, location, interviewer, link, notes, interviewDate } = req.body;
        
        const statuses = ["applied", "no answer", "interview scheduled", "pass", "rejected", "interviewing"]
        if (status !== undefined) {
            const validateStatus = statuses.findIndex((currentStatus) => { return currentStatus === status });
            if (validateStatus < 0) {
                return res.status(400).json({
                    data: null, error: [{
                        "message": "Invalid status. Allowed values: applied, no answer, interview scheduled, pass, rejected, interviewing",
                        "field": "status"
                    }]
                })
            }
        }
        const jobApplication = await prisma.jobApplication.update({
            where: { id: jobApplicationId, userId: userId },
            data: {
                company, position, status, flexibility, location, interviewer, link, notes, interviewDate
            }
        })

        delete jobApplication.userId;

        return res.status(200).json({ data: jobApplication, error: null })
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({ data: null, error: "Internal server error" });
    }
}
module.exports = { createJobApplication, getAllJobApplications, getJobApplication, deleteJobApplication, updateJobApplication }