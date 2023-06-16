const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /deleteassignment?ID=*
router.delete("/", (req, res) => {
  const ID = req.query.ID; // 삭제할 과제의 ID

  // submitfiles 테이블에서 해당 ID를 가지고 있는 행 삭제
  const deleteSubmitFilesQuery =
    "DELETE FROM submitfiles WHERE smKey IN (SELECT smKey FROM submits WHERE boKey = ?)";
  connection.query(
    deleteSubmitFilesQuery,
    [ID],
    (error, submitFilesDeleteResult) => {
      if (error) {
        console.error("MySQL query error: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // submits 테이블에서 해당 ID를 가지고 있는 행 삭제
      const deleteSubmitsQuery = "DELETE FROM submits WHERE boKey = ?";
      connection.query(
        deleteSubmitsQuery,
        [ID],
        (error, submitsDeleteResult) => {
          if (error) {
            console.error("MySQL query error: ", error);
            return res.status(500).json({ error: "Internal server error" });
          }

          // boardfiles 테이블에서 해당 ID(boKey)에 해당하는 행 삭제
          const deleteBoardFilesQuery =
            "DELETE FROM boardfiles WHERE boKey = ?";
          connection.query(
            deleteBoardFilesQuery,
            [ID],
            (error, boardFilesDeleteResult) => {
              if (error) {
                console.error("MySQL query error: ", error);
                return res.status(500).json({ error: "Internal server error" });
              }

              // boards 테이블에서 해당 ID를 가지고 있는 행 삭제
              const deleteBoardsQuery = "DELETE FROM boards WHERE boKey = ?";
              connection.query(
                deleteBoardsQuery,
                [ID],
                (error, boardsDeleteResult) => {
                  if (error) {
                    console.error("MySQL query error: ", error);
                    return res
                      .status(500)
                      .json({ error: "Internal server error" });
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
    }
  );
});

module.exports = router;

/*
const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /deleteassignment?assignmentID=*
router.delete("/", (req, res) => {
  const assignmentID = req.query.assignmentID; // 삭제할 과제의 ID

  // 먼저, boardfiles 테이블에서 해당 assignmentID(boKey)에 해당하는 행 삭제
  const deleteBoardFilesQuery = "DELETE FROM boardfiles WHERE boKey = ?";
  connection.query(deleteBoardFilesQuery, [assignmentID], (error, boardFilesDeleteResult) => {
    if (error) {
      console.error("MySQL query error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

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

            // 마지막으로, boards 테이블에서 해당 assignmentID를 가지고 있는 행 삭제
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
*/
