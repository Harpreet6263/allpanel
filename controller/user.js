const { validationResult } = require("express-validator");
const { VALIDATION_ERROR_RESPONSE, BAD_REQUEST, BAD_REQUEST_RESPONSE, SUCCESS_RESPONSE, SERVER_ERROR, ACTIVE_STATUS } = require("../constants/helper");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return VALIDATION_ERROR_RESPONSE(res, "VALIDATION_ERROR", errors.array());
        }

        const { name, email, phone, password, admin_id = null } = req.body;

        // Check for existing user
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return BAD_REQUEST(res, "Email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Users({
            name,
            email,
            phone,
            admin_id,
            password: hashedPassword,
        });

        await user.save();

        return SUCCESS_RESPONSE(res, "User registered successfully", {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const signin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return VALIDATION_ERROR_RESPONSE(res, "VALIDATION_ERROR", errors.array());
        }
        const { name, password } = req.body;        

        let user = await Users.findOne({ name });
        if (!user) {
            return BAD_REQUEST(res, "User not found");
        }

        if (user.status !== ACTIVE_STATUS) {
            return BAD_REQUEST(res, "Account is deactivated. Please contact admin.");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return BAD_REQUEST(res, "Invalid password");
        }


        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                // status: user.status
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });


        return SUCCESS_RESPONSE(res, "Login successfull", { token, user });
    } catch (err) {
        console.error(err.message);
        return SERVER_ERROR(res, "Server Error");
    }

}

const userProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return VALIDATION_ERROR_RESPONSE(res, "VALIDATION_ERROR", errors.array());
    }
    const { id } = req.user;
    const user = await Users.findById(id).select("-password");
    if (!user) {
        return BAD_REQUEST(res, "Something went wrong. Try to login again");
    }
    return SUCCESS_RESPONSE(res, "User fetched successfully", user);

}

module.exports = {
    signup,
    signin,
    userProfile
};