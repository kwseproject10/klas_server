const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");
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
  queries.push(executeQuery(querySelect, valueSelect));

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
    queries.push(executeQuery(queryInsert, valueInsert));
  }

  const queryUpdate =
    "UPDATE users SET email = ?, phone = ?, pw = ? WHERE userID = ?";
  const valueUpdate = [email, phone, pw, userID];
  queries.push(executeQuery(queryUpdate, valueUpdate));

  Promise.all(queries)
    .then((results) => {
      console.log("Results:", results);

      // 기존 이미지 삭제
      const existingImage = results[0][0];
      if (existingImage) {
        const queryDelete = "DELETE FROM userfiles WHERE userID = ?";
        const valueDelete = [userID];
        return executeQuery(queryDelete, valueDelete);
      }
    })
    .then(() => {
      res.status(200).json({
        result: true,
      });
    })
    .catch((error) => {
      console.error("Error saving file to database:", error);
      res.status(500).send("Failed to save file to database");
    });
});

/*





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

  if (file) {
    const query1 =
      "INSERT INTO userfiles (userID, ufName, ufPath, ufSize, ufRName) VALUES (?, ?, ?, ?, ?)";
    const value1 = [userID, fileName, filePath, fileSize, originalFileName];
    queries.push(executeQuery(query1, value1));
  }

  const query2 =
    "UPDATE users SET email = ?, phone = ?, pw = ? WHERE userID = ?";
  const value2 = [email, phone, pw, userID];
  queries.push(executeQuery(query2, value2));

  Promise.all(queries)
    .then((results) => {
      console.log("Results:", results);

      res.status(200).json({
        result: true,
      });
    })
    .catch((error) => {
      console.error("Error saving file to database:", error);
      res.status(500).send("Failed to save file to database");
    });
});

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}*/

module.exports = router;
