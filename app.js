const express = require('express'); // Express 웹 프레임워크 불러오기
const cookieParser = require('cookie-parser'); // cookie-parser 미들웨어: 쿠키 파싱
const morgan = require('morgan'); // Morgan 미들웨어: HTTP 요청 로깅
const session = require('express-session'); // express-session 미들웨어: 세션 관리
const nunjucks = require('nunjucks'); // Nunjucks: 템플릿 엔진
const dotenv = require('dotenv'); // dotenv: .env파일(환경변수)

dotenv.config(); // .env 파일의 환경 변수를 불러와 process.env에 설정
const indexRouter = require('./routes'); // 메인 인덱스 라우터 모듈

const app = express(); // Express 애플리케이션 인스턴스 생성
app.set('port', process.env.PORT || 4000); // 서버가 사용할 포트를 설정, 환경 변수 PORT가 없으면 기본값 8002 사용
app.set('view engine', 'html'); // Nunjucks를 사용하여 HTML 템플릿을 렌더링하도록 설저 

nunjucks.configure('views', {
    express: app, // Express 애플리케이션과 연동
    watch: true, // 템플릿 파일이 변경될 때 자동으로 다시 로드하도록 설정
}); // Nunjucks 템플릿 엔진 설정

app.use(morgan('dev')); // Morgan 미들웨어: 'dev' 모드로 HTTPS 요청 로깅
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 팡싱을 위한 미들웨어 설정, 쿠키 서명에 사용할 비밀키 설정
app.use(session({
    resave: false, // 세션이 변경되지 않은 경우 -> 저장 X 설정
    saveUninitialized: false, //  초기화되지 않은 세션 -> 저장 X 설정
    secret: process.env.COOKIE_SECRET, // 세션 암호화를 위한 비밀키 설정
    cookie: {
        httpOnly: true, // JavaScript를 통해 클라이언트 측에서 퀴에 접근할 수 없도록 설정
        secure: false, // HTTPS에서만 쿠키를 전송할지 여부를 설정 -> 개발환경에서는 false로 설정
    },
}));

app.use('/', indexRouter); // 루트 경로 '/'에 대해 indexRouter를 사용하여 기본 라우트 처리

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404; // 에러 상태 코드를 404로 설정
    next(error); // 다음 에러 처리 미들웨어로 에러를 전달
}); // 정의되지 않은 라우트로 접근했을 때 404 오류를 처리하기 위한 미들웨어 설정

app.use((err, req, res, next) => {
    res.locals.message = err.message; // 템플릿에서 사용할 수 있도록 에러 메시지를 지역 변수로 설정
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 프로덕션 환경이 아닌 경우에만 에러 객체를 지역 변수로 설정
    res.status(err.status || 500); // 응답 상태 코드를 에러의 상태 코드로 설정하고, 설정되지 않은 경우 500(서버 오류)으로 설정
    res.render('error'); // 'error' 템플릿을 렌더링하여 에러 페이지를 응답으로 보냄.
}); // 에러를 처리하기 위한 미들웨어 설정

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중'); // 서버가 시작되면 콘솔에 메시지 출력
}); // 설정된 포트에서 서버를 시작하여 요청 대기