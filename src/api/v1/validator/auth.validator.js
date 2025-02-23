const {body} = require('express-validator');

const registerValidator = [
    body("firstname", "firstname is required").notEmpty(),
    body("lastname", "lastname is required").notEmpty(),
    body("email", "Invalid email").isEmail(),
    body('password', 'Password is required').not().isEmpty(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]
const loginValidator = [
    body("email", "Invalid email").isEmail(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]
const resetPasswordValidator = [
    body('currentPassword', 'Current password is required').not().isEmpty(),
    body('currentPassword', 'The minimum current password length is 6 characters').isLength({min: 6}),
    body('newPassword', 'New password is required').not().isEmpty(),
    body('newPassword', 'The minimum new password length is 6 characters').isLength({min: 6}),

]
module.exports = {registerValidator, loginValidator, resetPasswordValidator}