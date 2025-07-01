import Joi from "joi";

// Reusable schema for name fields
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
    .pattern(new RegExp('^[a-zA-Z0-9@#$!]{3,30}$'))
    .messages({
        'string.base': '{{#label}} must be a string',
        'string.empty': '{{#label}} is required',
        'string.min': '{{#label}} must be at least 5 characters',
        'string.max': '{{#label}} must not exceed 30 characters',
        'string.pattern.base': '{{#label}} must be alphanumeric and can include @ # $ !',
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

export {registerUserSchema, verifyUserSchema};