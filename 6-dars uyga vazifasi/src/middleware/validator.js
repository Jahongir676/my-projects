import Joi from "joi";

export const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
};

export const paginationValidator = (req, res, next) => {
  const { page, limit } = req.query;
  req.pagination = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
  };
  next();
};

export const queryValidator = (req, res, next) => {
  const { sort, filter, search } = req.query;
  req.queryOptions = {
    sort: sort || "createdAt",
    filter: filter || null,
    search: search || "",
  };
  next();
};
