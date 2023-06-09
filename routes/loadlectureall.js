const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // MySQL 쿼리를 사용하여 전체 강의 목록 읽어오기
  const query = "SELECT * FROM v_lecture_info";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const formattedResults = results.map((row, index) => {
        return {
          key: index.toString(),
          ID: row.lec_id,
          name: row.lec_name,
          major: row.lec_major,
          type: row.lec_type,
          credit: row.lec_credit,
          numOfTime: row.lec_time,
          professor: row.lec_professor,
          time: row.lec_time,
          place: row.lec_place,
        };
      });
      // 성공 시 결과 응답으로 전송
      res.json(formattedResults);
    } else {
      // 데이터가 없는 경우
      const response = {
        result: "false",
      };
      res.json(response);
    }
  });
});
module.exports = router;
