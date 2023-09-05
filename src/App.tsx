import { Routes, Route, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Header from 'src/layouts/Header';
import Footer from 'src/layouts/Footer';

import Main from 'src/views/Main';
import Authentication from 'src/views/Authentication';
import Search from 'src/views/Search';
import UserPage from 'src/views/UserPage';
import BoardDetail from 'src/views/Board/Detail';
import BoardWrite from 'src/views/Board/Write';
import BoardUpdate from 'src/views/Board/Update';

import { AUTH_PATH, BOARD_NUMBER_PATH_VARIABLE, BOARD_PATH, DETAIL_PATH, MAIN_PATH, SEARCH_PATH, SEARCH_WORD_PATH_VARIABLE, UPDATE_PATH, USER_EMAIL_PATH_VARIABLE, USER_PAGE_PATH, WRITE_PATH } from './constants';
import { useEffect } from 'react';
import { useUserStore } from './stores';
import { getSignInUserRequest } from './apis';
import { GetLoginUserResponseDto } from './interfaces/response/user';
import ResponseDto from './interfaces/response/response.dto';
import './App.css';

// 메인화면         - path: '/' / component : <Main />
// 로그인 / 회원가입 - path: '/auth' / component : <Authentication />
// 검색             - path: '/search/:searchWord' / component : <Search />
// 유저페이지        - path: '/user-page/:userEmail' / component : <UserPage />
// 게시글 상세       - path: '/board/detail/:boardNumber' / component : <BoardDetail />
// 게시글 작성       - path: '/board/write' / component : <BoardWrite />
// 게시글 수정       - path: '/board/update/:boardNumber' / component : <BoardUpdate />

function App() {
  //          state          //
  // description: 현재 페이지 url 상태 //
  const { pathname } = useLocation();
  // description : 유저 스토어 상태 //
  const { user, setUser } = useUserStore();
  // description : Cookie 정보 상태 //
  const [cookies, setCookie] = useCookies();

  //          function          //
  const getSignInUserResponseHandler = (result: GetLoginUserResponseDto | ResponseDto) => {
    const { code } = result;
    if(code === 'NU') alert('토큰 정보가 잘못되었습니다.');
    if(code === 'DE') alert('데이터 베이스 에러입니다.');
    if(code !== 'SU') return;

    setUser({...result as GetLoginUserResponseDto });
  }  

  //          effect          //
  useEffect(() => {
    const accessToken = cookies.accessToken;
    console.log(accessToken);
    if(!user && accessToken ) getSignInUserRequest(accessToken).then(getSignInUserResponseHandler);
  }, [pathname]);

  //          render          //
  return (
    <>
      <Header />
      <Routes>
        <Route path={MAIN_PATH} element={<Main />} />
        <Route path={AUTH_PATH} element={<Authentication />} />
        <Route path={SEARCH_PATH(SEARCH_WORD_PATH_VARIABLE)} element={<Search />} />
        <Route path={USER_PAGE_PATH(USER_EMAIL_PATH_VARIABLE)} element={<UserPage />} />
        <Route path={BOARD_PATH}>
          <Route path={DETAIL_PATH(BOARD_NUMBER_PATH_VARIABLE)} element={<BoardDetail />} />
          <Route path={WRITE_PATH} element={<BoardWrite />} />
          <Route path={UPDATE_PATH(BOARD_NUMBER_PATH_VARIABLE)} element={<BoardUpdate />} />
        </Route>
      </Routes>
      { pathname !== AUTH_PATH && (<Footer />) }
    </>
  );
}

export default App;
