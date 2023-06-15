const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /noticepost?ID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const ID = req.query.ID;

  if (ID === "NULL") {
    ID = null;
  }

  const query =
    "select boTitle name, boPoster poster,boFDate postDate, boHit postHit,bfPath postfileURL,boCont postText from boards b left join boardfiles bf on b.boKey = bf.boKey where boType='notice' and b.bokey=?";

  // /noticepost?ID=*
  connection.query(query, [ID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);

      return res.status(500).json({ error: "Internal server error" });
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
      console.log("noticepost Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
