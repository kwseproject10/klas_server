const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

/*
{
  "userID": userID,
  "PW": password,
  "userName": name,
  "type": type,
  "major": major,
  "phoneNum1": phoneNum1,
  "phoneNum2": phoneNum2,
  "phoneNum3": phoneNum3,
  "birthYear": birthYear,
  "birthMonth": birthMonth,
  "birthDay": birthDay,
  "EmailID": EmailID,
  "EmailDomain": EmailDomain
}
*/

// /signup
router.post("/", (req, res) => {
  const data = req.body;

  const query1 = "select * from klas_db.users where userID=?";
  const query2 = "SELECT majID FROM klas_db.majors WHERE majName=?";

  connection.query(query1, [data.userID], (error, result1) => {
    if (error) {
      // 아예 db 접근이 안되는 경우
      console.error("MySQL query error: ", error);
      res.status(500).json({ error: "Internal server error" });

      return;
    } else {
      if (result1.length > 0) {
        console.log("이미 존재하는 학생 ID입니다.");

        res.json({ result: false });
      } else {
        connection.query(query2, [data.major], (error, result2) => {
          if (error) {
            console.error("MySQL query error: ", error);
            res.status(500).json({ error: "Internal server error" });

            return;
          } else {
            if (result2.length > 0) {
              if (data.type === "학생") {
                data.type = "student";
              } else if (data.type === "교수") {
                data.type = "professor";
              }
              const majID = result2[0].majID;
              const email = `${data.EmailID}@${data.EmailDomain}`;
              const phone = `${data.phoneNum1}-${data.phoneNum2}-${data.phoneNum3}`;
              const bMonth = data.birthMonth.toString().padStart(2, "0");
              const bDay = data.birthDay.toString().padStart(2, "0");
              const birth = `${data.birthYear}-${bMonth}-${bDay}`;

              const query3 =
                "INSERT INTO klas_db.users (userID, pw,userName,userType,majID,phone,birth,email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

              connection.query(
                query3,
                [
                  data.userID,
                  data.PW,
                  data.userName,
                  data.type,
                  majID,
                  phone,
                  birth,
                  email,
                ],
                (error, result3) => {
                  if (error) {
                    console.error("MySQL 저장 실패:", error);

                    res.json({ result: false });
                  } else {
                    console.log("MySQL 저장 성공:", result3);

                    res.json({ result: true });
                  }
                }
              );
            } else {
              console.log("해당 전공이 존재하지 않습니다.");

              res.json({ result: false });
            }
          }
        });
      }
    }
  });
});

module.exports = router;
