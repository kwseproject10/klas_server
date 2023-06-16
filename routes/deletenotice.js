const express = require("express");
const router = express.Router();
const connection = require("../modules/mysql");

// /deletenotice?ID=*
router.delete("/", (req, res) => {
  const ID = req.query.ID; // 삭제할 공지사항의 ID

  // 먼저, boardfiles 테이블에서 해당 ID(boKey)에 해당하는 행 삭제
  const deleteBoardFilesQuery = "DELETE FROM boardfiles WHERE boKey = ?";
  connection.query(deleteBoardFilesQuery, [ID], (error, deleteResult) => {
    if (error) {
      console.error("MySQL query error: ", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // 이후, boards 테이블에서 해당 ID에 해당하는 행 삭제
    const deleteNoticeQuery = "DELETE FROM boards WHERE boKey = ?";
    connection.query(deleteNoticeQuery, [ID], (error, deleteResult) => {
      if (error) {
        console.error("MySQL query error: ", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (deleteResult.affectedRows === 1) {
        // 삭제 성공
        return res.json({ result: "true" });
      } else {
        // 삭제할 공지사항이 없음
        return res.json({ result: "false" });
      }
    });
  });
});

module.exports = router;
