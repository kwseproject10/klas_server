const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /submitAll?ID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const boKey = req.query.ID;

  const query = `
  SELECT e.userID ID,
  case when s.smDone = 0 then '미제출' when s.smDone = 1 then '제출' end state,
  s.smTitle name, s.smCont content,
  sf.sfName fileName, sf.sfRName realName,  sf.sfSize AS fileSize, sf.sfPath AS fileUrl
  FROM submits s INNER JOIN submitfiles sf ON s.smKey = sf.smKey
  join enrollments e on s.enKey = e.enKey
  WHERE s.boKey = ?;
    `;
  // ID, state, name, content, fileName, realName, fileSize, fileUrl

  // /lecturelastboard?boKey=*
  connection.query(query, [boKey], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      // 결과를 원하는 형태로 가공
      const response = results.map((row) => ({
        ID: row.ID,
        state: row.state,
        name: row.name,
        content: row.content,
        postFile: {
          name: row.fileName,
          realName: row.realName,
          size: row.fileSize,
          url: row.fileUrl,
        },
      }));

      res.json(response);
    } else {
      // 해당 boKey에 해당하는 데이터가 없을 경우
      res.json([]);
    }
  });
});

module.exports = router;
