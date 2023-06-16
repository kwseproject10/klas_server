const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// /updatenoticepost
router.post("/", upload.single("file"), (req, res) => {
  const file = req.file;
  const data = req.body;

  /* 과제 제출 수정
과제 제출 ID로 확인????*/
  const query1 = "";
  const query2 = "";

  const values = [file.filename, file.originalname, file.path, file.size];
  //
  connection.query(query1, data.assignmentsubmitID, (error, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    } else {
      if (results.length > 0) {
        console.log("존재하지 않는 과제 제출 ID입니다.");
        res.json({ result: false });
      } else {
        connection.query(query2, values, (error, results) => {
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
