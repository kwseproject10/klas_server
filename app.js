// 포함된 module
var createError = require("http-errors");
var express = require("express");
const bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// routes 소스 가져옴
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// 요구 router 경로
// GET
const authRouter = require("./routes/auth");
const loadlectureallRouter = require("./routes/loadlectureall");
const userInformRouter = require("./routes/userInform");
const semestersRouter = require("./routes/semesters");
// const scheduleRouter = require("./routes/schedule");
// 5
const creditRouter = require("./routes/credit");
const wholelectureRouter = require("./routes/wholelecture");
const lecturesRouter = require("./routes/lectures");
const wholeattendanceRouter = require("./routes/wholeattendance");
const wholenoticeRouter = require("./routes/wholenotice");
// 10
const wholeassignmentRouter = require("./routes/wholeassignment");
const syllabusRouter = require("./routes/syllabus");
const noticeRouter = require("./routes/notice");
const noticepostRouter = require("./routes/noticepost");
const archiveRouter = require("./routes/archive");
// 15
const archivepostRouter = require("./routes/archivepost");
const assignmentRouter = require("./routes/assignment");
const assignmentnotsubmittedRouter = require("./routes/assignmentnotsubmitted");
const lectureattendanceRouter = require("./routes/lectureattendance");

const assignmentpostRouter = require("./routes/assignmentpost");
const attendanceRouter = require("./routes/attendance");
const professorlecturesRouter = require("./routes/professorlectures");

const lecturelastboardRouter = require("./routes/lecturelastboard");

const enrolllectureRouter = require("./routes/enrolllecture");

// DELETE
const deletelectureRouter = require("./routes/deletelecture");
const deletenoticeRouter = require("./routes/deletenotice");
const deletearchiveRouter = require("./routes/deletearchive");
const deleteassignmentRouter = require("./routes/deleteassignment");
const deleteassignmentsubmitRouter = require("./routes/deleteassignmentsubmit");

// POST
const signupRouter = require("./routes/signup");
const updateuserinformRouter = require("./routes/updateuserinform");
const postnoticeRouter = require("./routes/postnotice");

const updatenoticepostRouter = require("./routes/updatenoticepost");
const postarchiveRouter = require("./routes/postarchive");
const updatearchivepostRouter = require("./routes/updatearchivepost");
const postassignmentRouter = require("./routes/postassignment");
const postassignmentsubmitRouter = require("./routes/postassignmentsubmit");
const updateassignmentpostRouter = require("./routes/updateassignmentpost");

const createlectureRouter = require("./routes/createlecture");

// express 객체 생성
var app = express();

// view engine setup
// view 템플릿 엔진 셋업
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cors 설정
app.use(cors());

// express.static 미들웨어를 사용하여 정적 파일 경로를 설정
// public 디렉토리를 정적 파일 디렉토리로 설정
app.use(express.static(path.join(__dirname, "public")));

// 경로의 GET 요청에 대한 핸들러 정의
// 클라이언트에서 이미지를 요청할 때 해당 엔드포인트 사용
app.get("/api/render-image/:imageName", (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "public", "files", imageName);

  // 이미지 파일 전송
  res.sendFile(imagePath);
});

// express.static 미들웨어를 사용하여 public/files 디렉토리를 정적 파일 경로로 설정
app.use("/files", express.static(path.join(__dirname, "public/files")));

// 해당 경로로 router 등록
app.use("/", indexRouter);
app.use("/users", usersRouter);
// 요구 router 등록
// GET
app.use("/auth", authRouter);
app.use("/loadlectureall", loadlectureallRouter);
app.use("/userInform", userInformRouter);
app.use("/semesters", semestersRouter);
// app.use("/schedule", scheduleRouter);
//5
app.use("/credit", creditRouter);
app.use("/wholelecture", wholelectureRouter);
app.use("/lectures", lecturesRouter);
app.use("/wholeattendance", wholeattendanceRouter);
app.use("/wholenotice", wholenoticeRouter);
// 10
app.use("/wholeassignment", wholeassignmentRouter);
app.use("/syllabus", syllabusRouter);
app.use("/notice", noticeRouter);
app.use("/noticepost", noticepostRouter);
app.use("/archive", archiveRouter);
// 15
app.use("/archivepost", archivepostRouter);
app.use("/assignment", assignmentRouter);
app.use("/assignmentnotsubmitted", assignmentnotsubmittedRouter);
app.use("/assignmentpost", assignmentpostRouter);
app.use("/attendance", attendanceRouter);

app.use("/lecturelastboard", lecturelastboardRouter);
app.use("/lectureattendance", lectureattendanceRouter);
app.use("/professorlectures", professorlecturesRouter);

app.use("/enrolllecture", enrolllectureRouter);

// DELETE
app.use("/deletelecture", deletelectureRouter);
app.use("/deletenotice", deletenoticeRouter);
app.use("/deletearchive", deletearchiveRouter);
app.use("/deleteassignment", deleteassignmentRouter);
app.use("/deleteassignmentsubmit", deleteassignmentsubmitRouter);

//POST
app.use("/signup", signupRouter);
app.use("/updateuserinform", updateuserinformRouter);
app.use("/postnotice", postnoticeRouter);

app.use("/postassignment", postassignmentRouter);

app.use("/postassignmentsubmit", postassignmentsubmitRouter);

app.use("/postarchive", postarchiveRouter);

app.use("/createlecture", createlectureRouter);

// 404 잡아서 에러 핸들러에게 전달
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 에러 핸들러
// error handler
app.use(function (err, req, res, next) {
  // locals 설정, 개발자에게만 보임
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 에러 페이지 렌더링
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
