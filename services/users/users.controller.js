const UsersService = require("./users.services");
const passport = require("passport");
const moment = require('moment');
const constants = require("../../helper/resources/messages.json");
const guard = require("../../helper/guards");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

module.exports = {
  /*
   *  Register New User
   */
  register: async (req, res, next) => {
    try {
      req.body.email = req.body.email.toLowerCase();
      let is_exist = await UsersService.is_exist({ email: req.body.email });
      if (is_exist) {
        return commonResponse.success(
          res,
          constants.USER_EXIST,
          400,
          constants.USER_EXIST
        );
      }

      req.body.password = await commonFunctions.encryptStringCrypt(
        req.body.password
      );
      
      let user = await UsersService.save(req.body);

      if (user) {
        /* Send Account Verification Link */
        let emailData = {
          to: user.email,
          subject: "Account Verification OTP",
          text: `Your account verification Link Is ${user.otp}`,
          html: `<h1> magicStairs </h1>
                            <p>Your account verification OTP is :  ${user.otp}</b></p>`,
        };
        nodemailer.sendMail(emailData);

        let getUser = await UsersService.get(user._id);
        const token = guard.createToken(user, getUser.role);
        getUser.token = token.token;
        commonResponse.success(
          res,
          constants.USER_CREATED,
          200,
          getUser,
          constants.ACCOUNT_VERIFICATION_OTP
        );
      } else {
        return commonResponse.customResponse(
          res,
          constants.DEFAULTERR,
          400,
          user,
          constants.DEFAULTERR
        );
      }
    } catch (error) {
      console.log("Create User -> ", error);
      return commonResponse.CustomError(
        res,
        constants.DEFAULTERR,
        500,
        {},
        error.message
      );
    }
  },

  /*
   *  Login
   */
  login: async (req, res, next) => {
    passport.authenticate("user", async function (err, user, info) {
      if (err) {
        return commonResponse.customResponse(
          res,
          constants.Missing_Credentials,
          400,
          user,
          constants.Missing_Credentials
        );
      }

      if (info) {
        var err = new Error(constants.Missing_Credentials);
        err.status = 400;
        return next(err);
      }

      if (user) {
        if (user.status == "pending") {
          return commonResponse.customResponse(
            res,
            constants.USER_NOT_VERIFIED,
            400,
            user,
            constants.VERIFY_EMAIL
          );
        }
        if (user.status == "deactivated") {
          return commonResponse.customResponse(
            res,
            constants.USER_DEACTIVATED,
            400,
            user,
            constants.USER_DEACTIVATED
          );
        }

        await UsersService.update(user._id, {
          fcm_token: req.body.fcm_token ? req.body.fcm_token : "",
          device_type: req.body.device_type ? req.body.device_type : "android",
          device_id: req.body.device_id ? req.body.device_id : "",
        });

        let userResponse = await UsersService.get(user._id);
        const token = guard.createToken(user, userResponse.role);
        userResponse.token = token.token;
        return commonResponse.success(
          res,
          constants.LOGIN_SUCCESS,
          200,
          userResponse
        );
      } else {
        return commonResponse.customResponse(
          res,
          "NOT-FOUND",
          400,
          {},
          constants.USER_NOT_FOUND
        );
      }
    })(req, res, next);
  },

 
};
