const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");
var path = require("path");
const multer = require("multer");
const { executeQuery } = require("../modules/mysql"); // executeQuery 함수를 정의한 모듈의 경로에 맞게 수정해야 합니다.

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

/* body 형식
{
	"userID": 233113213213,
  "Email": "a@a.com",
  "PhoneNum": "010-0000-0000",
  "PW": "password"
}*/

router.post("/", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);

  // 파일 정보
  let fileName = null;
  let originalFileName = null;
  let filePath = null;
  let fileSize = null;

  if (file) {
    fileName = file.filename;
    originalFileName = file.originalname;
    filePath = file.path;
    fileSize = file.size;
  }

  // 다른 필드에서 전송된 정보
  const userID = req.body.userID;
  const email = req.body.Email;
  const phone = req.body.PhoneNum;
  const pw = req.body.PW;

  const queries = [];

  // 기존 이미지 정보 조회
  const querySelect = "SELECT * FROM userfiles WHERE userID = ?";
  const valueSelect = [userID];

  connection.query(querySelect, valueSelect, (err, selectResults) => {
    if (err) {
      console.error("Error fetching user files:", err);
      return res.status(500).send("Failed to fetch user files");
    }

    if (file) {
      const queryInsert =
        "INSERT INTO userfiles (userID, ufName, ufPath, ufSize, ufRName) VALUES (?, ?, ?, ?, ?)";
      const valueInsert = [
        userID,
        fileName,
        filePath,
        fileSize,
        originalFileName,
      ];

      connection.query(queryInsert, valueInsert, (err, insertResults) => {
        if (err) {
          console.error("Error inserting user file:", err);
          return res.status(500).send("Failed to insert user file");
        }
        updateUser();
      });
    } else {
      updateUser();
    }

    function updateUser() {
      const queryUpdate =
        "UPDATE users SET email = ?, phone = ?, pw = ? WHERE userID = ?";
      const valueUpdate = [email, phone, pw, userID];

      connection.query(queryUpdate, valueUpdate, (err, updateResults) => {
        if (err) {
          console.error("Error updating user:", err);
          return res.status(500).send("Failed to update user");
        }
        if (selectResults.length > 0) {
          const queryDelete = "DELETE FROM userfiles WHERE userID = ?";
          const valueDelete = [userID];
          connection.query(queryDelete, valueDelete, (err, deleteResults) => {
            if (err) {
              console.error("Error deleting user file:", err);
              return res.status(500).send("Failed to delete user file");
            }
            res.status(200).json({ result: true });
          });
        } else {
          res.status(200).json({ result: true });
        }
      });
    }
  });
});

module.exports = router;
