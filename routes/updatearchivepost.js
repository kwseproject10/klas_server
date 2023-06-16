const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /updatenoticepost
router.post("/", (req, res) => {
  const data = req.body;

  /* 자료실 게시물 수정
게시물 ID로 확인????*/
  const query1 = "";
  const query2 = "";

  //
  connection.query(query1, data.archiveID, (error, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    } else {
      if (results.length > 0) {
        console.log("존재하지 않는 archive ID입니다.");
        res.json({ result: false });
      } else {
        connection.query(query2, data, (error, results) => {
          if (error) {
            console.error("MySQL 저장 실패:", error);
            res.json({ result: false });
          } else {
            console.log("MySQL 저장 성공:", results);
            res.json({ result: true });
          }
        });
      }
    }
  });
});
module.exports = router;
