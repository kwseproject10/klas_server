const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /deletelecture?userID=*&lectureID=*
router.delete("/", (req, res) => {
  const userID = req.query.userID; // 삭제할 사용자의 ID
  const lectureID = req.query.lectureID; // 삭제할 강의의 ID

  // enrollments 테이블에서 삭제할 행의 enKey를 가져오는 쿼리
  const getEnrollmentQuery =
    "SELECT enKey FROM enrollments e join lectures l on e.lecKey = l.lecKey WHERE userID = ? and concat(l.majID,'-',l.lecLv,'-',l.subID,'-',l.clsNum)=?";

  connection.query(
    getEnrollmentQuery,
    [userID, lectureID],
    (error, enrollmentResult) => {
      if (error) {
        console.error("MySQL query error: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (enrollmentResult.length === 0) {
        return res.json({ success: false, message: "Enrollment not found" });
      }

      const enKey = enrollmentResult[0].enKey;

      // submitfiles 테이블에서 해당 enKey를 가진 행 삭제
      const deleteSubmitFilesQuery =
        "DELETE FROM submitfiles WHERE smKey IN (SELECT smKey FROM submits WHERE enKey = ?)";
      connection.query(
        deleteSubmitFilesQuery,
        [enKey],
        (error, submitFilesResult) => {
          if (error) {
            console.error("MySQL query error: ", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          // submits 테이블에서 해당 enKey를 가진 행 삭제
          const deleteSubmitsQuery = "DELETE FROM submits WHERE enKey = ?";
          connection.query(
            deleteSubmitsQuery,
            [enKey],
            (error, submitsResult) => {
              if (error) {
                console.error("MySQL query error: ", error);
                return res.status(500).json({ error: "Internal server error" });
              }

              // attendances 테이블에서 해당 enKey를 가진 행 삭제
              const deleteAttendancesQuery =
                "DELETE FROM attendances WHERE enKey = ?";
              connection.query(
                deleteAttendancesQuery,
                [enKey],
                (error, attendancesResult) => {
                  if (error) {
                    console.error("MySQL query error: ", error);
                    return res
                      .status(500)
                      .json({ error: "Internal server error" });
                  }

                  // enrollments 테이블에서 해당 행 삭제
                  const deleteEnrollmentQuery =
                    "DELETE FROM enrollments WHERE userID = ? AND lecKey IN (SELECT l.lecKey FROM lectures l WHERE CONCAT(l.majID, '-', l.lecLv, '-', l.subID, '-', l.clsNum) = ?)";
                  connection.query(
                    deleteEnrollmentQuery,
                    [userID, lectureID],
                    (error, deleteResult) => {
                      if (error) {
                        console.error("MySQL query error: ", error);
                        return res
                          .status(500)
                          .json({ error: "Internal server error" });
                      }

                      if (deleteResult.affectedRows === 1) {
                        // 삭제 성공
                        return res.json({ result: "true" });
                      } else {
                        return res.json({ result: "false" });
                      }
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;
