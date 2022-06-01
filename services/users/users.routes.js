const router = require("express").Router();
const controller = require("./users.controller");

const {
  register,
  login,
} = require("../../services/users/users.validation");

/*
 *  Register New User
 */
router.post("/register", register, controller.register);

/*
 *  Login
 */
router.post("/login", login, controller.login);


module.exports = router;
