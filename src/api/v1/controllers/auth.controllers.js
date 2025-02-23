const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");
const formatValidationErrors = require("../../../utils/formatValidationErrors");
const prisma = new PrismaClient();
const registerUser = async (req, res) => {
    try {
        const {errors} = validationResult(req);
        if (errors.length > 0) {
            return res.status(400).json({data: null, error: formatValidationErrors(errors)})
        }
        const {firstname, lastname, email, password} = req.body;
        const emailExist = await prisma.user.findMany({where: { email: {equals: email}}});
        if(emailExist.length > 0) {
            return res.status(400).json({data: {registered: false}, error: {message: "Email already exist"}});
        }
        const salt = await bcryptjs.genSalt(10);

        const hashPassword = await bcryptjs.hash(password, salt);
        const createUser = await prisma.user.create({data: {
            firstname,
            lastname,
            email,
            passwords: hashPassword
        }});

        const token = jwt.sign({id: createUser.id, email: createUser.email}, process.env.JWT_SECRET, { expiresIn: "1d", algorithm: "HS256" });

        const date = new Date();
        const expiryDate = date.setDate(date.getDate() + 1)

        return res.status(200).json({data: {token, expiryDate: new Date(expiryDate)}});
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({data: null, error: "Internal server error"});
    }
}
const loginUser = async (req, res) => {
    try {
        const {errors} = validationResult(req);
        if (errors.length > 0) {
            return res.status(400).json({data: null, error: formatValidationErrors(errors)});
        }

        const {email, password} = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (user.length === 0) {
            return res.status(400).json({data: null, error: {message: "Email or password is incorrect"}})
        }

        const validPassword = await bcryptjs.compare(password, user.passwords);
        if(!validPassword) {
            return res.status(400).json({data: null, error: {message: "Email or password is incorrect"}})
        }

        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: "1d", algorithm: "HS256" });

        const date = new Date();
        const expiryDate = date.setDate(date.getDate() + 1)

        return res.status(200).json({data: {token, expiryDate: new Date(expiryDate)}});
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({data: null, error: "Internal server error"});
    }
}
const resetPassword = async (req, res) => {
    try {

        const { errors } = validationResult(req);
        if (errors.length > 0){
            return res.status(400).json({data: null, error: formatValidationErrors(errors)});
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ data: null, error: { message: "Unauthorized" } });
        }

        const id = req.user?.id;

        const { currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({where: { id }, select: {passwords: true}});
        if (!user) {
            return res.status(404).json({ data: null, error: { message: "User not found" } });
        }
        const validCurrentPassword = await bcryptjs.compare(currentPassword, user.passwords);
        if (!validCurrentPassword) {
            return res.status(400).json({data: null, error: {message: "Invalid credentials"}})
        }
        if (currentPassword === newPassword) {
            return res
                .status(400)
                .json({ data: null, error: { message: "New password must differ from the current password" } });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        await prisma.user.update({where: {id}, data: {passwords: hashedPassword}});

        return res.status(200).json({data: {message: "Password has been reset successfully"}, error: null});
    } catch (error) {
        console.error(`❌${error}`)
        return res.status(500).json({data: null, error: "Internal server error"});
    }
}
module.exports = {registerUser, loginUser, resetPassword}