const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /archivepost?lectureID=*&noticeID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const lectureID = req.query.lectureID;
  const noticeID = req.query.noticeID;

  if (lectureID === "NULL") {
    lectureID = null;
  }
  if (isNaN(noticeID)) {
    noticeID = null;
  }

  const query =
    "select boTitle name, lecProf poster,boFDate postDate, boHit postHit,bfPath postfileURL,boCont postText from lectures l join boards b on l.lecKey = b.lecKey and boType='download' join boardfiles bf on b.boKey = bf.boKey where concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=? and b.boKey=?";
  /*
name,poster,postDate,postHit,postfileURL,postText
*/

  // /archivepost?lectureID=*&noticeID=*
  connection.query(query, [lectureID, noticeID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const postInfo = {
        name: results[0].name,
        poster: results[0].poster,
        postDate: results[0].postDate,
        postHit: results[0].postHit,
        postfileURL: results[0].postfileURL,
        postText: results[0].postText,
      };

      console.log(postInfo);
      res.json(postInfo);
    } else {
      return res.json({ result: "false" });
    }
  });
});

module.exports = router;
