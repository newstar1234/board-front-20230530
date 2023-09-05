import { useState, useEffect, KeyboardEvent, ChangeEvent, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {useCookies} from 'react-cookie';

import { useBoardWriteStore, useUserStore } from 'src/stores';
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PATH, SEARCH_PATH, USER_PAGE_PATH } from 'src/constants';
import PatchBoardRequestDto from 'src/interfaces/request/board/patch-board.request.dto';
import { patchBoardRequest, postBoardRequest, uploadFileRequest } from 'src/apis';
import './style.css';
import { PostBoardRequestDto } from 'src/interfaces/request/board';

//              component             //
// description : Header 레이아웃 //
export default function Header() {

  //              state             //
  // description : 검색 버튼 Ref 상태 //
  const searchButtonRef = useRef<HTMLDivElement | null>(null);
  
  //description : url 경로 상태 //
  const { pathname } = useLocation();

  // description : 로그인 유저 정보 상태  //
  const { user, setUser } = useUserStore();
  //description : 게시물 작성 데이터 상태 //
  const { boardNumber, boardTitle, boardContent, boardImage, boardImageUrl, resetBoard } = useBoardWriteStore();
  
  // description : Cookie 상태 //
  const [cookies, setCookie] = useCookies();

  //description : 검색 아이콘 클릭 상태 //
  const [searchState, setSearchState] = useState<boolean>(false);
  // description : 로그인 상태 //
  const [login, setLogin] = useState<boolean>(false);
  // description : 검색어 상태 //
  const [search, setSearch] = useState<string>('');

  //              function              //
  //description : 페이지 이동을 위한 네비게이터 함수 //
  const navigator = useNavigate();
  // description : 파일 업로드 함수 //
  const fileUpload = async() => {
      if(boardImage === null) return null;

      const data = new FormData();  
        data.append('file' , boardImage);

      const imageUrl = await uploadFileRequest(data); 
        return imageUrl;
  }
  // description : 게시물 작성 요청 함수 //
  const postBoardResponseHandler = (code: string) => {
    if(code === 'NE') alert('존재하지 않는 회원입니다.');
    if(code === 'VF') alert('필수 데이터를 입력하지 않았습니다.');
    if(code === 'DE') alert('데이터 베이스 에러입니다.'); 
    if(code !== 'SU') return;

    resetBoard();

    if(!user) return;
    navigator(USER_PAGE_PATH(user.email));
  }

  // description : 게시물 수정 요청 함수 //
  const patchBoardResponseHandler = (code: string) => {
    if (code === 'NE') alert('존재하지 않는 회원입니다.');
    if (code === 'NB') alert('존재하지 않는 게시물입니다.');
    if (code === 'NP') alert('권한이 없습니다.');
    if (code === 'VF') alert('필수 데이터를 입력하지 않았습니다.');
    if (code === 'DE') alert('데이터베이스 에러입니다.');
    if (code !== 'SU') return;

    resetBoard();

    if (!boardNumber) return;
    navigator(BOARD_DETAIL_PATH(boardNumber));
  }

  //description : search 버튼 출력 여부 //
  const showSearch = !pathname.includes(USER_PAGE_PATH('')) && pathname !== BOARD_WRITE_PATH() && !pathname.includes(BOARD_UPDATE_PATH(''));
  //description : 현재 페이지가 인증 화면인지 여부 //
  const isAuth = pathname === AUTH_PATH;
  //description : 현재 페이지가 마이페이지인지 여부 // 포함여부로 바꿈
  const isMyPage = user && pathname.includes(USER_PAGE_PATH(user.email));
  //description : upload 버튼 출력 여부 //
  const showUpload = pathname === BOARD_WRITE_PATH() || pathname.includes(BOARD_UPDATE_PATH(''));
  //description : upload 버튼 활성화 여부 //
  const activeUpload = boardTitle !== ''  && boardContent !== '' ;

  //              event handler             //
  // description : 검색어 변경 이벤트 //
  const onSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  // description : 검색 아이콘 버튼 클릭 이벤트  //
  const onSearchOpenButtonClickHandler = () => {
    setSearchState(true);
  }
  // description : 검색 버튼 클릭 이벤트 //
  const onSearchButtonClickHandler = () => {
    if(!search){
      alert('검색어를 입력해주세요!');
      return;
    }
    navigator(SEARCH_PATH(search));
  }
  //description : 로고 클릭 이벤트 //
  const onLogoClickHandler = () => {
    navigator(MAIN_PATH);
  }
  //description : 로그인 버튼 클릭 이벤트 //
  const onSignInButtonClickHandler = () => {
    setLogin(true);
    navigator(AUTH_PATH);
  }
  //description : 유저(마이)페이지 버튼 클릭 이벤트 //
  const onMyPageButtonClickHandler = () => {
    if(!user) return;
    navigator(USER_PAGE_PATH(user.email));  //undefind가 올수있어서 위에서 리턴해줘야함
  }
  //description : 로그아웃 버튼 클릭 이벤트 // 
  const onSignOutButtonClickHandler = () => {
    setCookie('accessToken', '', { expires: new Date(), path: MAIN_PATH });
    setLogin(false); //로그인 false
    setUser(null);  // 유저 정보 없음
    navigator(MAIN_PATH);
  }
  // description: 업로드 버튼 클릭 이벤트 //
  const onUploadButtonClickHandler = async () => {

    const token = cookies.accessToken;

    if (pathname === BOARD_WRITE_PATH()) {
      const imageUrl = await fileUpload();

      const data: PostBoardRequestDto = {
        title: boardTitle,
        content: boardContent,
        imageUrl
      }
      postBoardRequest(data, token).then(postBoardResponseHandler);
    } 
    else {
      if (!boardNumber) return;

      const imageUrl = boardImage ? await fileUpload() : boardImageUrl;

      const data: PatchBoardRequestDto = {
        title: boardTitle,
        content: boardContent,
        imageUrl
      }
      patchBoardRequest(boardNumber, data, token).then(patchBoardResponseHandler);
    }
    
  }
  
  // description: 검색 인풋 창 Enter 이벤트 //
  const onSearchEnterPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!searchButtonRef.current) return;
    searchButtonRef.current.click();
  }

  //              effect              //
  // description : 로그인 유저 정보가 바뀔 때마다 실행 //
  useEffect(() => {
    setLogin(user !== null);
  }, [user]);
  // description : path url이 바뀔 때마다 실행 // path name이 바뀔떄마다 
  useEffect(() => {
    if(!pathname.includes(SEARCH_PATH(''))) {
      setSearch('');
      setSearchState(false);
    }
  }, [pathname]);

  //              render              //
  return (
    <div id='header'>
      <div className='header-left' onClick={onLogoClickHandler}>
        <div className='header-left-logo-icon'></div>
        <div className='header-left-logo-text'>NEWSTAR's Board</div>
      </div>
      <div className='header-right'>
        {(showSearch) && (searchState ? (
            <div className='header-search-box'>
              <input className='header-search-input' value={search} onChange={onSearchChangeHandler} onKeyDown={onSearchEnterPressHandler} />
              <div ref={searchButtonRef} className='header-icon-box' onClick={onSearchButtonClickHandler}>
                <div className='header-search-icon'></div>
              </div>
            </div>
          ) : (
            <div className='header-icon-box' onClick={onSearchOpenButtonClickHandler}>
              <div className='header-search-icon'></div>
            </div>
        ))}
        {!isAuth && (
          isMyPage ? (<div className='white-button' onClick={onSignOutButtonClickHandler}>로그아웃</div>) :
          showUpload && activeUpload ? (<div className='black-button' onClick={onUploadButtonClickHandler}>업로드</div>) :
          showUpload && !activeUpload ? (<div className='disable-button'>업로드</div>) :
          login ? (<div className='white-button' onClick={onMyPageButtonClickHandler}>마이페이지</div>) :
                  (<div className='black-button' onClick={onSignInButtonClickHandler}>로그인</div>)
        )}
      </div>
    </div>
  )
}
