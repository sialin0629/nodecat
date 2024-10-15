const express = require('express'); // Express 모듈을 불러옴, 라우터 기능을 사용하기 위함
const { test } = require('../controllers');
// '../controllers' 경로엥 ㅣㅆ는 test 함수를 불러옴, 컨트롤러에 정의된 로직을 사용하기 위함

const router = express.Router();
// Express 라우터 객체를 생성함, 라우트를 정의하고 사용할 수 있도록 함

// POST /test
router.get('/test', test);
// '/test' 경로로 들어오는 GET 요청을 test 함수로 처리함

module.exports = router;
// 라우터 모듈을 외부에서 사용할 수 있도록 내보냄