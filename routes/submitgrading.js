const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /submitgrading
router.post("/", (req, res) => {
  const { ID, ...scores } = req.body;

  const updateScoreQuery = `
  UPDATE submits s
  JOIN enrollments e ON s.enKey = e.enKey
  SET s.smScore = ?
  WHERE e.userID = ? AND s.boKey = ?
  `;

  // 각 학생별로 점수를 업데이트
  Object.entries(scores).forEach(([userID, score]) => {
    connection.query(updateScoreQuery, [score, userID, ID], (err, result) => {
      if (err) {
        console.error("MySQL query error: ", err);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  });

  res.json({ success: true });
});

module.exports = router;
