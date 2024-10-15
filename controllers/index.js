const axios = require('axios');
// HTTP 요청을 쉽게 보내기 위한 axios 모듈을 불러옴

const URL = process.env.API_URL; // 환경 변수에서 API의 기본 URL을 가져옴
axios.defaults.headers.origin = process.env.ORIGIN; // origin 헤더 설정

// API 요청을 처리하는 비동기 함수
const request = async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰(JWT)이 없으면 토큰 발급 시도
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET, // 클라이언트 비밀키 사용
      });
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, { // API요청
      headers: { authorization: req.session.jwt }, // 요청 헤더에 JWT 포함
    });
  } catch (error) {
    if (error.response?.status === 419) { // 토큰 만료 시 처리
      delete req.session.jwt; // 세션에서 JWT 삭제
      return request(req, api); // 새로운 토큰 요청 후 재시도
    }
    throw error; // 419 외의 다른 에러이면 에러 발생
  }
};

// 사용자의 게시물을 가져오는 비동기 함수
exports.getMyPosts = async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my'); // 사용자의 게시물 요청
    res.json(result.data); // 요청 결과를 JSON형식으로 반환
  } catch(error) {
    console.error(error); // 에러 로그 출력
    next(error); // 에러를 다음 미들웨어로 전달
  }
};

// 해시태그로 게시물을 검색하는 비동기 함수
exports.searchByHashtag = async (req, res, next) => {
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`, // 해시태그로 게시물 요청
    );
    res.json(result.data); // 요청 결과를 JSON 형식으로 반환
  } catch(error) {
    if (error.code) { // 에러 코드가 있는 경우
      console.error(error); // 에러 로그 출력
      next(error); // 에러르 다음 미들웨어로 전달
    }
  }
};