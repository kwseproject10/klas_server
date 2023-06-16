const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /enrollList?lectureID=*
router.get("/", (req, res) => {
  let lectureID = req.query.lectureID;

  // Check if password is NULL and set it to null
  if (lectureID === "NULL") {
    lectureID = null;
  }

  // 테스트용 : 2020123456, H020-4-0846-01
  const query = `
select e.userID 
from lectures l
join enrollments e on l.lecKey = e.lecKey
WHERE  concat(l.majID, '-', l.lecLv, '-', l.subID, '-', l.clsNum) = ?
`;

  // /attendance?userID=*&lectureID=*
  connection.query(query, [lectureID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      const userIDs = results.map((row) => row.userID);
      res.json(userIDs);
    } else {
      return res.json([]);
    }
  });
});

module.exports = router;
