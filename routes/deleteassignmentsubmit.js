const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /deleteassignmentsubmit?ID=*&userID=*
router.delete("/", (req, res) => {
  const ID = req.query.ID; // 삭제할 과제의 ID
  const userID = req.query.userID; // 사용자의 ID

  // enrollments 테이블에서 userID에 해당하는 enKey 가져오기
  const getEnrollmentQuery = "SELECT enKey FROM enrollments WHERE userID = ?";
  connection.query(getEnrollmentQuery, [userID], (error, enrollmentResult) => {
    if (error) {
      console.error("MySQL query error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (enrollmentResult.length === 0) {
      return res.json({ success: false, message: "Enrollment not found" });
    }

    const enKey = enrollmentResult[0].enKey;

    // submitfiles 테이블에서 해당 enKey를 가지고 있는 행들 삭제
    const deleteSubmitFilesQuery =
      "DELETE FROM submitfiles WHERE smKey IN (SELECT smKey FROM submits WHERE enKey = ? AND boKey = ?)";
    connection.query(
      deleteSubmitFilesQuery,
      [enKey, ID],
      (error, submitFilesDeleteResult) => {
        if (error) {
          console.error("MySQL query error: ", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        // submits 테이블에서 해당 enKey와 boKey를 가지고 있는 행들 삭제
        const deleteSubmitsQuery =
          "DELETE FROM submits WHERE enKey = ? AND boKey = ?";
        connection.query(
          deleteSubmitsQuery,
          [enKey, ID],
          (error, submitsDeleteResult) => {
            if (error) {
              console.error("MySQL query error: ", error);
              return res.status(500).json({ error: "Internal server error" });
            }

            if (submitsDeleteResult.affectedRows > 0) {
              // 삭제 성공
              return res.json({ success: true });
            } else {
              // 삭제할 과제 제출이 없음
              return res.json({
                success: false,
                message: "Assignment submission not found",
              });
            }
          }
        );
      }
    );
  });
});

module.exports = router;
