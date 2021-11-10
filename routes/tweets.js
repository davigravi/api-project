const express = require('express');

const router = express.Router();

router.get("/", (req, res) => {
    res.json("test tweets index");
  });


module.exports = router;
