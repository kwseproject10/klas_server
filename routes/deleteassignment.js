const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /deleteassignment?assignmentID=*
router.delete("/", (req, res) => {
  const assignmentID = req.query.assignmentID; // 삭제할 과제의 ID

  // submitfiles 테이블에서 해당 assignmentID를 가지고 있는 행 삭제
  const deleteSubmitFilesQuery =
    "DELETE FROM submitfiles WHERE smKey IN (SELECT smKey FROM submits WHERE boKey = ?)";
  connection.query(
    deleteSubmitFilesQuery,
    [assignmentID],
    (error, submitFilesDeleteResult) => {
      if (error) {
        console.error("MySQL query error: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // submits 테이블에서 해당 assignmentID를 가지고 있는 행 삭제
      const deleteSubmitsQuery = "DELETE FROM submits WHERE boKey = ?";
      connection.query(
        deleteSubmitsQuery,
        [assignmentID],
        (error, submitsDeleteResult) => {
          if (error) {
            console.error("MySQL query error: ", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          // boards 테이블에서 해당 assignmentID를 가지고 있는 행 삭제
          const deleteBoardsQuery = "DELETE FROM boards WHERE boKey = ?";
          connection.query(
            deleteBoardsQuery,
            [assignmentID],
            (error, boardsDeleteResult) => {
              if (error) {
                console.error("MySQL query error: ", error);
                return res.status(500).json({ error: "Internal server error" });
              }

              if (boardsDeleteResult.affectedRows > 0) {
                // 삭제 성공
                return res.json({ result: "true" });
              } else {
                // 삭제할 과제가 없음
                return res.json({ result: "false" });
              }
            }
          );
        }
      );
    }
  );
});

module.exports = router;
