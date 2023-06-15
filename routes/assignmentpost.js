const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /assignmentpost?ID=*
router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  let ID = req.query.ID;

  if (ID === "NULL") {
    ID = null;
  }

  const query =
    "select boTitle , boPoster,asSDate ,asEDate ,boCont,bfRName,bfSize,bfPath, smFDate,smTitle,smCont, sfRName,sfSize,sfPath from boards b left join boardfiles bf on b.boKey = bf.boKey left join submits s on s.boKey = b.boKey left join submitfiles sf on s.smKey = sf.smKey where boType='assignment' and b.bokey=?";
  // boTitle,boPoster,asSDate,asEDate,boCont,bfRName,bfSize,bfPath,smFDate,smTitle,smCont,sfRName,sfSize,sfPath

  // /assignmentpost?ID=*
  connection.query(query, [ID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const today = new Date();
      const asEDate = new Date(results[0].asEDate);
      const asDiff = asEDate.getTime() - today.getTime();
      const asDiffDay = Math.ceil(asDiff / (1000 * 60 * 60 * 24));

      const postInfo = {};
      let state;

      if (results[0].smFDate === null) {
        state = "미제출";

        postInfo.post = {
          name: results[0].boTitle,
          poster: results[0].boPoster,
          postDate: results[0].asSDate,
          dueDate: results[0].asEDate,
          Dday: asDiffDay,
          state: state,
          postText: results[0].boCont,
          postFile: {
            name: results[0].bfRName,
            size: results[0].bfSize,
            url: results[0].bfPath,
          },
        };
        postInfo.submit = {
          state: state,
        };
      } else {
        state = "제출";

        postInfo.post = {
          name: results[0].boTitle,
          poster: results[0].boPoster,
          postDate: results[0].asSDate,
          dueDate: results[0].asEDate,
          Dday: asDiffDay,
          state: state,
          postText: results[0].boCont,
          postFile: {
            name: results[0].bfRName,
            size: results[0].bfSize,
            url: results[0].bfPath,
          },
        };

        postInfo.submit = {
          state: state,
          postDate: results[0].smFDate,
          name: results[0].smTitle,
          postText: results[0].smCont,
          postFile: {
            name: results[0].sfRName,
            size: results[0].sfSize,
            url: results[0].sfPath,
          },
        };
      }

      console.log(postInfo);
      res.json(postInfo);
    } else {
      console.log("assignmentpost Fail");

      return res.json([]);
    }
  });
});

module.exports = router;
