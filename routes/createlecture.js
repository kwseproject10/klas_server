const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

/*
{
lecProf     교수이름
majName     전공이름
lecName     강의이름
lecType     전필,전선...
lecCre      3
lecHour     3
lecRm       새빛205
lecTime     월3,수4
lecDesc     이 강의는 영국에서 시작되었으며...
tbTitle     말듣쓰
tbAuth      이강인
tbPubl      해찬들
ratAtten    10
ratMid      30
ratFin      30
ratAss      30
}
*/

router.post("/", (req, res) => {
  const data = req.body;

  // majName에서 majID 얻기
  const query1 = "select majID from majors where majName=?";

  connection.query(query1, [data.majName], (error, result1) => {
    if (error) {
      console.error("MySQL query error: ", error);

      return res.status(500).json({ error: "Internal server error" });
    }

    if (result1.length > 0) {
      const majID = result1[0].majID;

      const query2 =
        "select lecLv, subID, clsNum from lectures l where lecYear=2023 and lecName=? order by clsNum desc ";

      connection.query(query2, [data.lecName], (error, result2) => {
        if (error) {
          console.error("MySQL query error: ", error);

          return res.status(500).json({ error: "Internal server error" });
        }

        if (result2.length > 0) {
          const lecLv = result2[0].lecLv;
          const subID = result2[0].subID;
          const clsNum = result2[0].clsNum;

          const query3 =
            "insert into lectures (majID,lecLv,subID,clsNum,lecName,lecType,lecCre,lecHour,lecProf,lecTime,lecRm,lecDesc,tbTitle,tbAuth,tbPubl,ratAtten,ratMid,ratFin,ratAss) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          value3 = [
            majID,
            lecLv,
            subID,
            clsNum,
            data.lecName,
            data.lecType,
            data.lecCre,
            data.lecHour,
            data.lecProf,
            data.lecTime,
            data.lecRm,
            data.lecDesc,
            data.tbTitle,
            data.tbAuth,
            data.tbPubl,
            data.ratAtten,
            data.ratMid,
            data.ratFin,
            data.ratAss,
          ];

          connection.query(query3, value3, (error, result3) => {
            if (error) {
              console.error("MySQL query error: ", error);

              return res.status(500).json({ error: "Internal server error" });
            } else {
              console.log("MySQL 저장 성공:", result3);

              res.json({ result: true });
            }
          });
        } else {
          console.log("2에서 실패");

          res.json({ result: false });
        }
      });
    } else {
      console.log("1에서 실패");

      res.json({ result: false });
    }
  });
});

module.exports = router;
