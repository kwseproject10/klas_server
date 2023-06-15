const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /lecturelastboard?lectureID=*
router.get("/", (req, res) => {
  var lectureID = req.query.lectureID;

  // Check if lectureID is NaN and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  const boardTypes = ["notice", "download", "assignment"];

  const queries = boardTypes.map((boardType) => {
    return `SELECT * FROM lectures l join boards b on l.lecKey = b.lecKey WHERE concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=? and boType = '${boardType}' ORDER BY boFDate DESC LIMIT 1`;
  });

  Promise.all(queries.map((query) => connection.query(query, [lectureID])))
    .then((results) => {
      const recentRows = results.map((result) => result[0]);
      res.json(recentRows);
    })
    .catch((error) => {
      console.error("MySQL query error: ", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

module.exports = router;
