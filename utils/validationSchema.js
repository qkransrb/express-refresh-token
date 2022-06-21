const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

exports.signupValidation = (body) => {
  const schema = joi.object({
    name: joi.string().required().label("name"),
    email: joi.string().required().label("email"),
    password: joi.string().required().label("password"),
  });
  return schema.validate(body);
};

exports.loginValidation = (body) => {
  const schema = joi.object({
    email: joi.string().required().label("email"),
    password: joi.string().required().label("password"),
  });
  return schema.validate(body);
};

exports.refreshTokenValidation = (body) => {
  const schema = joi.object({
    refreshToken: joi.string().required().label("refreshToken"),
  });
  return schema.validate(body);
};
