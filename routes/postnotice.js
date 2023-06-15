const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

/*
{
	"lectureID": "1111-1-1111-1",
	title:"제목",
	content:"본문 내용",
	poster:"사람이름",
	fileURL:"~~~~~~",
}
*/

// /postnotice
router.post("/", (req, res) => {
  const data = req.body;
  const lectureID = data.lectureID;

  const query1 =
    "SELECT lecKey FROM lectures l where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) = ?";

  connection.query(query1, [lectureID], (error, result1) => {
    if (error) {
      // 아예 db 접근이 안되는 경우
      console.error("MySQL query error: ", error);

      return res.status(500).json({ error: "Internal server error" });
    } else {
      if (result1.length > 0) {
        const query2 =
          "INSERT INTO boards (lecKey, boType, boTitle, boCont, boFDate, boPoster) VALUES (?, ?, ?, ?,?,?)";

        const now = new Date();

        connection.query(
          query2,
          [
            result1[0].lecKey,
            "notice",
            data.title,
            data.content || null,
            now,
            data.poster,
          ],
          (error, result2) => {
            if (error) {
              console.error("MySQL 저장 실패:", error);

              res.json({ result: false });
            } else {
              console.log("MySQL 저장 성공:", result2);

              res.json({ result: true });
            }
          }
        );
      } else {
        console.log("존재하지 않는 강의 ID입니다.");

        res.json({ result: false });
      }
    }
  });
});

module.exports = router;
