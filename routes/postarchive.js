const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");
var path = require("path");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/')
  },
  filename: (req, file, cb) => {
      cb(null, path.basename(file.originalname, path.extname(file.originalname))+ '-' + Date.now());
  }
})

const upload = multer({ storage: storage })

router.post('/',upload.single("image"),(req, res) => {
  console.log(req.file);
  res.json();
});

module.exports = router;

/*

  const data = req.body;

  //자료실 게시물 작성
  const query =
      "";

  connection.query(query, data, (err, results) => {
      if (err) {
          console.error("MySQL query error: ", err);
          res.status(500).json({ error: "Internal server error" });
          return;
      }

      if (results.length > 0) {
          const response = {
              result: "true",
          };
          // 성공 시 결과 응답으로 전송
          res.json(response);
      }
      else {
          // 데이터가 없는 경우
          const response = {
              result: "false",
          };
          res.json(response);
      }
  });
*/