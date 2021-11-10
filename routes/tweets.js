const express = require('express');

const router = express.Router();
//hello
router.get("/", (req, res) => {
    res.json("test tweets index");
  });


module.exports = router;
