const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { signin, userProfile, signup } = require("../controller/user");
const { Auth } = require("../middlewares/auth");

router.post(
    "/signup_new_user",
    Auth,
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Email is required").not().isEmpty(),
        check("phone", "Phone is required").not().isEmpty(),
        check("password", "Password is required").not().isEmpty(),
    ],
    signup
);

router.post(
    "/signin",
    [
        check("name", "Name is required").not().isEmpty(),
        check("password", "Password is required").not().isEmpty(),
    ],
    signin
);

router.get("/my_profile",
    Auth,
    userProfile
);

module.exports = router;
