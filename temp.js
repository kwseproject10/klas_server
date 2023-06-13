// POST 요청 처리
app.post("/경로", (req, res) => {
  const data = req.body;

  // 학생 ID 중복 확인
  connection.query(
    "SELECT * FROM 테이블명 WHERE studentID = ?",
    data.studentID,
    (error, results) => {
      if (error) {
        console.error("MySQL 조회 실패:", error);
        res.json({ result: false });
      } else {
        if (results.length > 0) {
          // 이미 존재하는 학생 ID인 경우
          console.log("이미 존재하는 학생 ID입니다.");
          res.json({ result: false });
        } else {
          // MySQL에 데이터 저장
          connection.query(
            "INSERT INTO 테이블명 SET ?",
            data,
            (error, results) => {
              if (error) {
                console.error("MySQL 저장 실패:", error);
                res.json({ result: false });
              } else {
                console.log("MySQL 저장 성공:", results);
                res.json({ result: true });
              }
            }
          );
        }
      }
    }
  );
});
