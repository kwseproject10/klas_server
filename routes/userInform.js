const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = req.query.userID;

  // Check if password is NULL and set it to null
  if (userID === "NULL") {
    userID = null;
  }

  const query =
    "select u1.userName, u1.userType,m.majName as major,u1.userID as ID,(select count(*) from (select distinct lecYear, lecSem from enrollments as e join lectures as l on e.lecKey = l.lecKey where e.userID = u1.userID) as yearSem) as numberOfTerm,u1.email,u1.phone as phoneNum,u1.birth as birthday,u2.userName as advisor,u2.email as advisorEmail,u2.tel as advisorNum,u1.userState as state , ufPath from users as u1 left join users as u2 on u1.advID = u2.userID join majors as m on u1.majID = m.majID left join userfiles uf on u1.userID = uf.userID where u1.userID = ?";
  /*
userName,userType,major,ID,numberOfTerm,email,phoneNum,birthday,advisor,advisorEmail,advisorNum,state
모범생,student,컴퓨터정보공학부,2020123456,6,swe@kw.ac.kr,010-1234-5678,2000-01-01,이기훈,kihoonlee@kw.ac.kr,02-940-8674,enroll
*/

  // /userinform?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length > 0) {
      const result = results[0];

      const grade = Math.ceil(result.numberOfTerm / 2);

      const dateString = result.birthday;
      const temp = new Date(dateString);
      temp.setHours(temp.getHours() + 9);
      const year = temp.getFullYear();
      const month = String(temp.getMonth() + 1).padStart(2, "0");
      const day = String(temp.getDate()).padStart(2, "0");
      const birth = `${year}-${month}-${day}`;

      const response = {
        name: result.userName || null,
        type: result.userType || null,
        major: result.major || null,
        ID: result.ID || null,
        grade: grade || null,
        numberOfTerm: result.numberOfTerm || null,
        email: result.email || null,
        phoneNum: result.phoneNum || null,
        birthday: birth || null,
        advisor: result.advisor || null,
        advisorEmail: result.advisorEmail || null,
        advisorNum: result.advisorNum || null,
        state: result.state || null,
        filePath: result.ufPath || null,
      };

      console.log("userinform success");

      return res.json(response);
    } else {
      console.log("userInform Fail");

      return res.json({
        name: null,
        type: null,
        major: null,
        ID: null,
        grade: null,
        numberOfTerm: null,
        email: null,
        phoneNum: null,
        birthday: null,
        advisor: null,
        advisorEmail: null,
        advisorNum: null,
        state: null,
        filePath: null,
      });
    }
  });
});

module.exports = router;
