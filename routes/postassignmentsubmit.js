const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql").connection;
var path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        Date.now()
    );
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    // 다른 필드에서 전송된 정보
    const userID = req.body.userID;
    const lectureID = req.body.lectureID;
    const boKey = req.body.boKey;
    const title = req.body.title;
    const content = req.body.content;

    // userID랑 lectureID 사용해서 enKey 얻어야 함
    const query1 =
      "select distinct enKey from lectures l join enrollments e on l.lecKey = e.lecKey join boards b on l.lecKey=b.lecKey where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and e.userID=? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) =?";
    const value1 = [userID, lectureID];

    connection.query(query1, value1, (error, result1) => {
      if (error) {
        console.error("Error saving file to database:", error);
        return res.status(500).send("Failed to save file to database");
      }

      if (result1.length > 0) {
        console.log("result1: ", result1);
        const enKey = result1[0].enKey;
        console.log("enKey: ", enKey);

        const now = new Date();

        // submits에 관련 내용 저장해야 함
        // enKey, boKey, smTitle, smCont, smFDate, smDone 저장 필요
        const query2 =
          "INSERT INTO submits (enKey, boKey, smTitle, smCont, smFDate, smDone) VALUES (?, ?, ?, ?,?,?)";
        const value2 = [enKey, boKey, title, content, now, 1];

        connection.query(query2, value2, (error, result2) => {
          if (error) {
            console.error("Error saving file to database:", error);
            return res.status(500).send("Failed to save file to database");
          }

          if (result2.affectedRows > 0) {
            console.log("result2: ", result2);
            const smKey = result2.insertId;
            res.status(200).json({
              smKey: smKey,
              result: true,
            });
          }
        });
      }
    });
  } else {
    const file = req.file;
    console.log(file);

    // 파일 정보
    const fileName = file.filename;
    const originalFileName = file.originalname;
    const filePath = file.path;
    const fileSize = file.size;

    // 다른 필드에서 전송된 정보
    const userID = req.body.userID;
    const lectureID = req.body.lectureID;
    const boKey = req.body.boKey;
    const title = req.body.title;
    const content = req.body.content;

    // userID랑 lectureID 사용해서 enKey 얻어야 함
    const query1 =
      "select distinct enKey from lectures l join enrollments e on l.lecKey = e.lecKey join boards b on l.lecKey=b.lecKey where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and e.userID=? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) =?";
    const value1 = [userID, lectureID];

    connection.query(query1, value1, (error, result1) => {
      if (error) {
        console.error("Error saving file to database:", error);
        return res.status(500).send("Failed to save file to database");
      }

      // lectureID에 해당하는 강의가 존재할 때
      if (result1.length > 0) {
        console.log("result1: ", result1);
        const enKey = result1[0].enKey;
        console.log("enKey: ", enKey);

        const now = new Date();

        // submits에 관련 내용 저장해야 함
        // enKey, boKey, smTitle, smCont, smFDate, smDone 저장 필요
        const query2 =
          "INSERT INTO submits (enKey, boKey, smTitle, smCont, smFDate, smDone) VALUES (?, ?, ?, ?,?,?)";
        const value2 = [enKey, boKey, title, content, now, 1];

        connection.query(query2, value2, (error, result2) => {
          if (error) {
            console.error("Error saving file to database:", error);
            return res.status(500).send("Failed to save file to database");
          }

          if (result2.affectedRows > 0) {
            console.log("result2: ", result2);
            const smKey = result2.insertId;

            // boardfiles에 file에 대한 내용 넣기
            const query3 =
              "INSERT INTO submitfiles (smKey, sfName, sfPath, sfSize, sfRName) VALUES (?, ?, ?, ?,?)";
            const value3 = [
              smKey,
              fileName,
              filePath,
              fileSize,
              originalFileName,
            ];

            connection.query(query3, value3, (error, result3) => {
              if (error) {
                console.error("Error saving file to database:", error);
                return res.status(500).send("Failed to save file to database");
              }

              if (result3.affectedRows > 0) {
                console.log("result3: ", result3);
                console.log("게시판에 글 올리기 성공!");
                res.status(200).json({
                  smKey: smKey,
                  result: true,
                });
              } else {
                console.log("3번에서 문제 발생");

                return res.status(500).json({ result: false });
              }
            });
          } else {
            console.log("2번에서 문제 발생");

            return res.status(500).json({ result: false });
          }
        });
      } else {
        console.log("1번에서 문제 발생");

        return res.status(500).json({ result: false });
      }
    });
  }
});

module.exports = router;
