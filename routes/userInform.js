const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

router.get("/", (req, res) => {
  // 쿼리 파라미터 추출
  const userID = parseInt(req.query.userID);

  // Check if userID is NaN and set it to null
  if (isNaN(userID)) {
    userID = null;
  }

  /* MySQL 쿼리 유저 정보
      name: "홍길동",
      type: "학부생",
      major: "컴퓨터정보공학부",
      ID: "2023123456",
      grade: 4,
      numberOfTerm: 7,
      email: "gildong@gmail.com",
      phoneNum: "010-1234-5678",
      birthday: "1900.01.01",
      advisor: "이기훈",
      advisorEmail: "kihoonlee@kw.ac.kr",
      advisorNum: "02-940-8674",
      state: "재학")*/
  const query =
    "select u1.userName, u1.userType,m.majName as major,u1.userID as ID,(select count(*) from (select distinct lecYear, lecSem from enrollments as e join lectures as l on e.lecKey = l.lecKey where e.userID = u1.userID) as yearSem) as numberOfTerm,u1.email,u1.phone as phoneNum,u1.birth as birthday,u2.userName as advisor,u2.email as advisorEmail,u2.tel as advisorNum,u1.userState as state from users as u1 join users as u2 on u1.advID = u2.userID join majors as m on u1.majID = m.majID where u1.userID = ?";
  /*
userName,userType,major,ID,numberOfTerm,email,phoneNum,birthday,advisor,advisorEmail,advisorNum,state
모범생,student,컴퓨터정보공학부,2020123456,6,swe@kw.ac.kr,010-1234-5678,2000-01-01,이기훈,kihoonlee@kw.ac.kr,02-940-8674,enroll
*/

  // /userinform?userID=*
  connection.query(query, [userID], (err, results) => {
    if (err) {
      console.error("MySQL query error: ", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (results.length > 0) {
      const result = results[0];
      const grade =
        result.numberOfTerm / 2 == 0
          ? result.numberOfTerm / 2 + 1
          : result.numberOfTerm / 2;

      const dateString = result.birthday;

      console.log(dateString);

      const response = {
        name: result.userName !== null ? result.userName : null,
        type: result.userType !== null ? result.userType : null,
        major: result.major !== null ? result.major : null,
        ID: result.ID !== null ? result.ID : null,
        grade: grade !== null ? result.grade : null,
        numberOfTerm: result.numberOfTerm !== null ? result.numberOfTerm : null,
        email: result.email !== null ? result.email : null,
        phoneNum: result.phoneNum !== null ? result.phoneNum : null,
        birthday: result.birthday !== null ? result.birthday : null,
        advisor: result.advisor !== null ? result.advisor : null,
        advisorEmail: result.advisorEmail !== null ? result.advisorEmail : null,
        advisorNum: result.advisorNum !== null ? result.advisorNum : null,
        state: result.state !== null ? result.state : null,
      };

      console.log(response);

      return res.json(response);
    } else {
      // 데이터가 없는 경우
      const response = {
        result: "false",
      };

      return res.json(response);
    }
  });
});

module.exports = router;
