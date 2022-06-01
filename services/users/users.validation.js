const { Joi } = require("express-validation");
const constants = require("../../helper/resources/messages.json");
const commonResponse = require("../../helper/commonResponse");
const password = Joi.string().min(4).max(16).required();
const email = Joi.string().email().required();

const REGEX = {
  MONGO_OBJECT_ID: /^[a-f\d]{24}$/i,
};

const ObjectID = Joi.string()
  .pattern(REGEX.MONGO_OBJECT_ID)
  .trim()
  .strict(true)
  .required()
  .messages({
    "string.pattern.base": constants.PROVIDE_OBJECT_ID,
  });

const paramsValidation = (req, res, next) => {

  const schema = Joi.object().keys({
    id: ObjectID,
  });

  let data = schema.validate(req.params);

  if (data.hasOwnProperty('error')) {
    commonResponse.sendJoiError(res, 'VALIDATION_ERROR', data.error)
  } else {
    next()
  }
};

const tokenValidation = Joi.object({
  token: Joi.string().length(64).message(constants.EXPIRED_TOKEN_ERROR),
});


exports.register = (req, res, next) => {

  const schema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email,
    password,
  });

  let data = schema.validate(req.body);

  if (data.hasOwnProperty('error')) {
    commonResponse.sendJoiError(res, 'VALIDATION_ERROR', data.error)
  } else {
    next()
  }
};

exports.login = (req, res, next) => {
  const schema = Joi.object().keys({
    email,
    password,
    fcm_token: Joi.string().optional().allow(""),
    device_id: Joi.string().optional().allow(""),
    device_type: Joi.string().optional().allow(""),
  });

  let data = schema.validate(req.body);

  if (data.hasOwnProperty('error')) {
    commonResponse.sendJoiError(res, 'VALIDATION_ERROR', data.error)
  } else {
    next()
  }
};




exports.getUserById = {
  params: paramsValidation,
};

exports.ObjectID = ObjectID;
exports.paramsValidation = paramsValidation;
exports.tokenValidation = tokenValidation;
exports.passwordValidation = password;
exports.emailValidation = email;
