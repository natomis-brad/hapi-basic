import * as Joi from "joi";

export const createPersonModel = Joi.object().keys({
    first: Joi.string().required(),
    middle: Joi.string().optional(),
    last: Joi.string().required(),
    dob: Joi.date().required()
});

export const updatePersonModel = Joi.object().keys({
    first: Joi.string().required(),
    middle: Joi.string().optional(),
    last: Joi.string().required(),
    dob: Joi.date().required()
});