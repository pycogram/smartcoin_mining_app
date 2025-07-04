import Joi from "joi";

// reusable schema for all fields

const nameField = Joi.string()
    .required()
    .min(2)
    .max(30)
    .messages({
        'string.base': '{{#label}} must be a string',
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 2 characters',
        'string.max': '{{#label}} must not exceed 30 characters',
        'any.required': '{{#label}} is required'
});
const emailField = Joi.string()
    .required()
    .min(3)
    .max(60)
    .email({tlds: {allow: ['com', 'net']}})
    .messages({
        'string.base': '{{#label}} must be a string',
        'string.email': '{{#label}} must be a valid and end with either .com or .net',
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 3 characters',
        'string.max': '{{#label}} must not exceed 60 characters',
        'any.required': '{{#label}} is required'
});
const passwordField = Joi.string()
    .required()
    .min(5)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z0-9@#$!]{5,30}$'))
    .messages({
        'string.base': '{{#label}} must be a string',
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 5 characters',
        'string.max': '{{#label}} must not exceed 30 characters',
        'string.pattern.base': '{{#label}} must be alphanumeric and can include @ # $ ! and no spaces',
        'any.required': '{{#label}} is required'
    });
const codeField = Joi.string()
    .required()
    .pattern(new RegExp('^[a-zA-Z0-9]{6}$'))
    .messages({
        'string.base': '{{#label}} must be a string',
        'string.empty': '{{#label}} is required',
        'string.pattern.base': '{{#label}} must be 6 alphanumeric characters',
        'any.required': '{{#label}} is required'
    });

const registerUserSchema = Joi.object({
    first_name: nameField.label("First name"),
    last_name: nameField.label("Last name"),
    email: emailField.label("Email"),              
    password: passwordField.label("Password")
});
const verifyUserSchema = Joi.object({       
    email: emailField.label("Email")
});
const confirmUserSchema = Joi.object({       
    code: codeField.label("Code")
});
const loginUserSchema = Joi.object({       
    email: emailField.label("Email"),
    password: passwordField.label("Password")
});

export {
    registerUserSchema, verifyUserSchema, confirmUserSchema, loginUserSchema
};