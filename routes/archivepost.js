const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /archivepost?noticeID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const noticeID = req.query.noticeID;

  if (noticeID === "NULL") {
    noticeID = null;
  }

  const query =
    "select boTitle name, boPoster poster,boFDate postDate, boHit postHit,bfPath postfileURL,boCont postText from boards b left join boardfiles bf on b.boKey = bf.boKey where boType='download' and b.bokey=?";
  /*
name,poster,postDate,postHit,postfileURL,postText
*/

  // /archivepost?noticeID=*
  connection.query(query, [noticeID], (err, results) => {
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
      console.log("archivepost Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
