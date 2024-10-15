const express = require('express'); // Express 모듈을 불러옴, 라우터 기능을 사용하기 위함
const { searchByHashtag, getMyPosts } = require('../controllers');
// 컨트롤러에서 해시태그로 검색하는 함수와 사용자의 게시물을 가져오는 함수를 불러옴

const router = express.Router();
// Express 라우터 객체를 생성함, 라우트를 정의하고 사용할 수 있도록 함

// POST /myposts
router.get('/myposts', getMyPosts);
// /myposts 경로로 GET 요청 시ㅏ getMyPosts 함수 호출

// POST /search/:hashtag
router.get('/search/:hashtag', searchByHashtag);
// /search/:hashtag 경로로 GET 요청 시 searchByHashtag 함수 호출, :hashtag는 동적 경로 매개변수

module.exports = router;
// 라우터 모듈을 외부에서 사용할 수 있도록 내보냄