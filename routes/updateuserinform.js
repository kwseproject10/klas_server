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
  const fileName = file.filename;
  const originalFileName = file.originalname;
  const filePath = file.path;
  const fileSize = file.size;

  // 다른 필드에서 전송된 정보
  const userID = req.body.userID;
  const email = req.body.Email;
  const phone = req.body.PhoneNum;
  const pw = req.body.PW;

  const query1 =
    "insert into userfiles (userID, ufName, ufPath,ufSize,ufRName) values(?,?,?,?,?)";
  const value1 = [userID, fileName, filePath, fileSize, originalFileName];

  const query2 =
    "UPDATE users SET email = ?, phone = ?, pw = ? WHERE userID = ?";
  const value2 = [email, phone, pw, userID];

  Promise.all([executeQuery(query1, value1), executeQuery(query2, value2)])
    .then(([result1, result2]) => {
      console.log("result1: ", result1);
      console.log("result2: ", result2);

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
}

module.exports = router;
