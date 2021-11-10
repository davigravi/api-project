const express = require('express');
const router = express.Router();

const db = require("../db/models");
const { Tweet } = db;

//handleValidationErrors
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
}


//express-validator
const { check, validationResult } = require("express-validator");

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);


//GET
router.get("/", asyncHandler(async (req, res) => {
  const tweets = await Tweet.findAll();
  res.json({ tweets })
})
);


const tweetNotFoundError = (id) => {
  const err = Error(`Tweet with id of ${id} could not be found.`);
  err.title = "Tweet not found.";
  err.status = 404;
  return err;
};


router.get("/:id(\\d+)", asyncHandler(async (req, res, next) => {
  const tweetId = parseInt(req.params.id, 10);
  const tweet = await Tweet.findByPk(tweetId);

  req.errors = []

  if (tweet) {
    res.json({ tweet })
  } else {
    next(tweetNotFoundError(tweetId));
  }
}));

//POST
const validateTask = [
  check("message")
    .isLength({ max: 280 })
    .withMessage("Tweet can't be longer than 280 characters.")
]


router.post('/',
  validateTask,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    const tweet = await Tweet.create({ message });
    res.status(201).json({ tweet });
  }))

//PUT
router.put("/:id(\\d+)",
  validateTask,
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet) {
      await tweet.update({ message: req.body.message })
      res.json({ tweet })
    } else {
      next(tweetNotFoundError(tweetId));
    }
  }))

  //DELETE
  router.delete("/:id(\\d+)",
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet) {
      await tweet.destroy()
      res.status(204).end()
    } else {
      next(tweetNotFoundError(tweetId));
    }
  }))

module.exports = router;
