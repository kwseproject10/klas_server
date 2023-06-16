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
    const userID = req.body.posterID;
    const boTitle = req.body.postTitle;
    const lectureID = req.body.lectureID;
    const boCont = req.body.content;

    // lecKey 얻어야 함
    const query1 =
      "select lecKey from lectures l where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) =?";
    const value1 = [lectureID];

    connection.query(query1, value1, (error, result1) => {
      if (error) {
        console.error("Error saving file to database:", error);
        return res.status(500).send("Failed to save file to database");
      }

      // lectureID에 해당하는 강의가 존재할 때
      if (result1.length > 0) {
        console.log("result1: ", result1);
        const lecKey = result1[0].lecKey;
        console.log("lecKey: ", lecKey);
        // boards에 관련 내용 저장해야 함
        // lecKey, boType, boTitle, boCont, boFDate, boPoster 저장 필요
        const query2 = "select userName from users u where userID=?";
        const value2 = [userID];

        connection.query(query2, value2, (error, result2) => {
          if (error) {
            console.error("Error saving file to database:", error);
            return res.status(500).send("Failed to save file to database");
          }

          if (result2.length > 0) {
            console.log("result2: ", result2);
            const boPoster = result2[0].userName;
            const now = new Date();
            console.log("boPoster: ", boPoster);

            const query3 =
              "INSERT INTO boards (lecKey, boType, boTitle, boCont, boFDate, boPoster) VALUES (?, ?, ?, ?,?,?)";
            const value3 = [lecKey, "download", boTitle, boCont, now, boPoster];

            connection.query(query3, value3, (error, result3) => {
              if (error) {
                console.error("Error saving file to database:", error);
                return res.status(500).send("Failed to save file to database");
              }

              if (result3.affectedRows > 0) {
                console.log("result3: ", result3);
                const boKey = result3.insertId;

                res.status(200).json({
                  boKey: boKey,
                  result: true,
                });
              }
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
    const userID = req.body.posterID;
    const boTitle = req.body.postTitle;
    const lectureID = req.body.lectureID;
    const boCont = req.body.content;

    // lecKey 얻어야 함
    const query1 =
      "select lecKey from lectures l where YEAR(NOW()) = lecYear and IF(MONTH(NOW()) <= 6, 1, 2) = lecSem and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum) =?";
    const value1 = [lectureID];

    connection.query(query1, value1, (error, result1) => {
      if (error) {
        console.error("Error saving file to database:", error);
        return res.status(500).send("Failed to save file to database");
      }

      // lectureID에 해당하는 강의가 존재할 때
      if (result1.length > 0) {
        console.log("result1: ", result1);
        const lecKey = result1[0].lecKey;
        console.log("lecKey: ", lecKey);
        // boards에 관련 내용 저장해야 함
        // lecKey, boType, boTitle, boCont, boFDate, boPoster 저장 필요
        const query2 = "select userName from users u where userID=?";
        const value2 = [userID];

        connection.query(query2, value2, (error, result2) => {
          if (error) {
            console.error("Error saving file to database:", error);
            return res.status(500).send("Failed to save file to database");
          }

          if (result2.length > 0) {
            console.log("result2: ", result2);
            const boPoster = result2[0].userName;
            const now = new Date();
            console.log("boPoster: ", boPoster);

            const query3 =
              "INSERT INTO boards (lecKey, boType, boTitle, boCont, boFDate, boPoster) VALUES (?, ?, ?, ?,?,?)";
            const value3 = [lecKey, "download", boTitle, boCont, now, boPoster];

            connection.query(query3, value3, (error, result3) => {
              if (error) {
                console.error("Error saving file to database:", error);
                return res.status(500).send("Failed to save file to database");
              }

              if (result3.affectedRows > 0) {
                console.log("result3: ", result3);
                const boKey = result3.insertId;

                // boardfiles에 file에 대한 내용 넣기
                const query4 =
                  "INSERT INTO boardfiles (boKey, bfName, bfPath, bfSize, bfRName) VALUES (?, ?, ?, ?,?)";
                const value4 = [
                  boKey,
                  fileName,
                  filePath,
                  fileSize,
                  originalFileName,
                ];

                connection.query(query4, value4, (error, result4) => {
                  if (error) {
                    console.error("Error saving file to database:", error);
                    return res
                      .status(500)
                      .send("Failed to save file to database");
                  }

                  if (result4.affectedRows > 0) {
                    console.log("result4: ", result4);
                    console.log("게시판에 글 올리기 성공!");

                    res.status(200).json({
                      boKey: boKey,
                      result: true,
                    });
                  } else {
                    console.log("4번에서 문제 발생");
                    console.log("게시판에 글 올리기 실패!");

                    return res.status(500).json({ result: false });
                  }
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
