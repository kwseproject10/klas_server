connection.query(query, (err, results) => {
  if (err) {
    console.error("MySQL query error: ", err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  if (results.length > 0) {
    let response = results.map((row, index) => {
      let professors = row.place.split(".");
      let times = row.lecTime.split(".");

      return {
        key: index.toString(),
        name: row.lecName,
        professor: professors,
        major: row.major,
        type: row.lecType,
        credit: row.credit.toString(),
        numOfTime: row.numofTime.toString(),
        time: times,
        place: places,
        ID: `${row.majorID}-${row.lecLevel}-${row.subjectID}-${row.class}`,
      };
    });

    res.json(response);
  } else {
    // 데이터가 없는 경우
    const response = {
      result: "false",
    };
    res.json(response);
  }
});
