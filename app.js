// 포함된 module
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// routes 소스 가져옴
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// 밑에서부터 내가 만들은 라우터들
const authRouter = require("./routes/auth");
const loadlectureallRouter = require("./routes/loadlectureall");
const userInformRouter = require("./routes/userInform")

const schedule = require("./routes/schedule")
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

// cors 설정
app.use(cors());

// 해당 경로로 router 등록
app.use("/", indexRouter);
app.use("/users", usersRouter);
// 밑에서부터 내가 만들은 라우터들
app.use("/auth", authRouter);
app.use("/loadlectureall", loadlectureallRouter);
app.use("/userInform", userInformRouter);

app.use("/schedule", schedule);
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
