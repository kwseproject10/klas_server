const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

/* body 형식
{
	"userID": 233113213213
    "Email": "a@a.com",
    "PhoneNum": "010-0000-0000",
    "PW": "password"
}*/

// /updateuserinform
router.post("/", upload.single("file"), (req, res) => {
  const uploadedFile = req.file;

  // 파일 정보를 files 테이블에 저장
  const filePath = uploadedFile.path; // 업로드된 파일의 경로
  const originalFileName = uploadedFile.originalname; // 업로드된 파일의 원본 이름
  const fileSize = uploadedFile.size; // 업로드된 파일의 크기

  // 파일 정보를 files 테이블에 저장하는 작업 수행 (예시: INSERT 문 실행)
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

    // 파일 정보 저장이 성공하면 사용자 정보를 수정
    const userID = req.body.userID;
    const email = req.body.Email;
    const phone = req.body.PhoneNum;
    const pw = req.body.PW;

    // 사용자 정보를 users 테이블에 수정하는 작업 수행 (예시: UPDATE 문 실행)
    const userSql =
      "UPDATE users SET email = ?, phone = ?, pw = ? where userID = ?";
    const userValues = [email, phone, pw, userID];

    db.query(userSql, userValues, (userError, userResults) => {
      if (userError) {
        console.error("Error updating user information:", userError);
        return res.status(500).send("Failed to update user information");
      }

      console.log("File and user information updated successfully");
      res.status(200).json({ result: true });
    });
  });
});

module.exports = router;
