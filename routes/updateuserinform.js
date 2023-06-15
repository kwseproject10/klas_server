const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const db = connection;

/* body 형식
{
	"userID": 233113213213,
  "Email": "a@a.com",
  "PhoneNum": "010-0000-0000",
  "PW": "password"
}*/

// /updateuserinform
router.post("/", upload.single("file"), (req, res) => {
  if (req.file) {
    // 파일이 전송된 경우에만 파일 정보를 저장하고 업데이트합니다.
    const uploadedFile = req.file;

    const originalFileName = uploadedFile.originalname;
    const fileSize = uploadedFile.size;
    const filePath = uploadedFile.path;

    const fileSql =
      "INSERT INTO files (ufName, ufRName, ufPath, ufSize) VALUES (?, ?, ?, ?)";
    const fileValues = [
      uploadedFile.filename,
      originalFileName,
      filePath,
      fileSize,
    ];

    db.query(fileSql, fileValues, (fileError, fileResults) => {
      if (fileError) {
        console.error("Error saving file to database:", fileError);
        return res.status(500).send("Failed to save file to database");
      }

      updateUserInformation(req, res);
    });
  } else {
    // 파일이 전송되지 않은 경우에는 사용자 정보만 업데이트합니다.
    updateUserInformation(req, res);
  }
});

function updateUserInformation(req, res) {
  const userID = req.body.userID;
  const email = req.body.Email;
  const phone = req.body.PhoneNum;
  const pw = req.body.PW;
  const userSql =
    "UPDATE users SET email = ?, phone = ?, pw = ? WHERE userID = ?";
  const userValues = [email, phone, pw, userID];

  db.query(userSql, userValues, (userError, userResults) => {
    if (userError) {
      console.error("Error updating user information:", userError);
      return res.status(500).send("Failed to update user information");
    }

    console.log("User information updated successfully");
    res.status(200).json({ result: true });
  });
}

module.exports = router;
