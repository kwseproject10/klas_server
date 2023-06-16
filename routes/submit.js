const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /submit?ID={assignmentID}&userID={userID}
router.get("/", (req, res) => {
  const { ID, userID } = req.query;

  const selectSubmitDataQuery = `
  SELECT u.userName as poster, u.userID as posterID, s.smFDate as postDate, 
  s.smTitle as name, s.smCont as postText, 
  sf.sfName as fileName, sf.sfRName realName, sf.sfSize as fileSize, sf.sfPath as fileURL
  FROM users u
  INNER JOIN enrollments e ON u.userID = e.userID
  INNER JOIN submits s ON e.enKey = s.enKey
  INNER JOIN boards b ON s.boKey = b.boKey
  LEFT JOIN submitfiles sf ON s.smKey = sf.smKey
  WHERE u.userID = ? AND b.boKey = ?`;

  connection.query(selectSubmitDataQuery, [userID, ID], (error, results) => {
    if (error) {
      console.error("MySQL query error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // 결과가 없다면, 조회 결과가 없음을 반환
    if (results.length === 0) {
      return res.json({ result: "false" });
    }

    // 데이터를 구조화하여 응답
    const response = {
      poster: results[0].poster,
      posterID: results[0].posterID,
      postDate: results[0].postDate,
      name: results[0].name,
      postText: results[0].postText,
      postFile: {
        name: results[0].fileName,
        realName: results[0].realName,
        size: results[0].fileSize,
        url: results[0].fileURL,
      },
    };

    res.json(response);
  });
});

module.exports = router;
