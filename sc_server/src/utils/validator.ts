import Joi from "joi";

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
const contentField = Joi.string()
    .required()
    .messages({
        'string.base': '{{#label}} must be a string',
        'string.empty': '{{#label}} is required',
        'any.required': '{{#label}} is required'
});
const mineScField = Joi.boolean()
    .truthy('yes', 'true')
    .falsy('no', 'false')
    .default(false)
    .required()
    .messages({
        'boolean.base': '{{#label}} must be a boolean',
        'boolean.empty': '{{#label}} is required',
        'any.required': '{{#label}} is required'
});
const lockScField = Joi.number()
    .required()
    .messages({
        'number.base': '{{#label}} must be a number',
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
const postSchema = Joi.object({
    content: contentField.label("Content"),
});
const mineScSchema = Joi.object({
    mine_sc: mineScField.label("Mine Sc"),
});
const lockScSchema = Joi.object({
    lock_sc: lockScField.label("Lock Sc"),
    lock_period: lockScField.label("Lock Time")
});
const unLockScSchema = Joi.object({
    unlock_sc: mineScField.label("Unlock Val"),
});
const claimBonusScSchema = Joi.object({
    claim_sc: mineScField.label("Claim Sc"),
});


export {
    registerUserSchema, verifyUserSchema, confirmUserSchema, loginUserSchema, 
    postSchema, 
    mineScSchema,
    lockScSchema, unLockScSchema,
    claimBonusScSchema
};