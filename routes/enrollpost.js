const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");
/*
[
    2020123456:{
        mid:50,
        fin:40,
        cre:'A+'
    }

]*/

// /enrollpost
router.post("/", (req, res) => {
  const userID = req.body.userID;
  const scoMid = req.body.scoMid;
  const scoFin = req.body.scoFin;
  const enCre = req.body.enCre;

  // enrollments 테이블에 값을 저장하는 쿼리
  const query = `
INSERT INTO enrollments (scoMid, scoFin, enCre) SELECT ?, ?, ? 
FROM dual WHERE EXISTS (SELECT * FROM enrollments WHERE userID = ?)
`;

  connection.query(query, [scoMid, scoFin, enCre, userID], (error, result) => {
    if (error) {
      // 아예 db 접근이 안되는 경우
      console.error("MySQL query error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows > 0) {
      // 행이 삽입되었을 경우
      res.json({ result: true });
    } else {
      // 해당 userID의 행이 존재하지 않는 경우
      res.status(404).json({ error: "User not found" });
    }
  });
});

module.exports = router;
