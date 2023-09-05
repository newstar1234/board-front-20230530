import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { usePagination } from 'src/hooks';
import { useUserStore } from 'src/stores';
import BoardListItem from 'src/components/BoardListItem';
import Pagination from 'src/components/Pagination';
import { AUTH_PATH, BOARD_WRITE_PATH, COUNT_BY_PAGE, MAIN_PATH, USER_PAGE_PATH } from 'src/constants';

import DefaultProflie from './asset/my_page_profile_default.png';
import { getUserBoardListRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest, uploadFileRequest } from 'src/apis';
import { GetUserResponseDto } from 'src/interfaces/response/user';
import ResponseDto from 'src/interfaces/response/response.dto';
import { BoardListResponseDto, GetUserListResponseDto } from 'src/interfaces/response/board';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'src/interfaces/request/user';
import './style.css';

//          component          //
// description: 유저 페이지 화면 //
export default function UserPage() {

  //          state          //
  // description: 유저 이메일 상태 //
  const { userEmail } = useParams();
  // description: 로그인한 사용자의 정보 상태 //
  const { user, setUser } = useUserStore();
  // description : Cookie 상태 //
  const [cookies, setCookie] = useCookies();
  // description: 마이페이지 여부 상태 //
  const [myPage, setMyPage] = useState<boolean>(false);

  //          function          //
  // description: 화면 이동을 위한 네비게이트 함수 //
  const navigator = useNavigate();

  //          event handler          //

  //          component          //
  // description: 마이페이지 상단 //
  const MyPageTop = () => {
    //          state          //
    // description: input 요소에 대한 참조용 상태 //
    const fileInputRef = useRef<HTMLInputElement>(null);
    // description: 사용자 프로필 사진 URL 상태 //
    const [profileImageUrl, setProfileImageUrl] = useState<string>(DefaultProflie);
    // description: 사용자 닉네임 상태 //
    const [nickname, setNickname] = useState<string>('  ');
    // description: 닉네임 변경 버튼 상태 //
    const [nicknameChange, setNicknameChange] = useState<boolean>(false);

    //          function          //
    //! 유저 정보 //
    const getUserResponseHandler = (result: GetUserResponseDto | ResponseDto) => {
      const { code } = result;
      if (code === 'NU') alert('존재하지 않는 유저입니다.');
      if (code === 'DE') alert('데이터베이스 오류입니다.');
      if (code !== 'SU') navigator(MAIN_PATH);

      const { nickname, profileImageUrl } = result as GetUserResponseDto;
      setNickname(nickname);
      if (profileImageUrl) setProfileImageUrl(profileImageUrl);
      else setProfileImageUrl(DefaultProflie);

      if(userEmail === user?.email) {
        const after = {email: userEmail as string, nickname, profileImageUrl };
        setUser(after);
      }
    }
    // description : 닉네임 변경 응답 처리 함수 //
    const patchNicknameResponseHandler = (code : string) => {
      if(!user) return;
      if( code === 'NU') alert('존재하지 않는 유저입니다.');
      if( code === 'EN') alert('중복되는 닉네임입니다.');
      if( code === 'VF') alert('잘못된 입력입니다.');
      if( code === 'DE') alert('데이터 베이스 에러입니다.');
      if( code !== 'SU') {
        setNickname(user.nickname);
        return;
      }

      getUserRequest(user.email).then(getUserResponseHandler);
    }
    // description : 프로필 이미지 업로드 응답 처리 함수 //
    const profileUploadResponseHandler = (url: string | null) => {
      if(!user) return;
      if(!url) {
        setProfileImageUrl(user?.profileImageUrl);
        return;
      } 
      const data: PatchProfileImageRequestDto = { profileImage: url };
      const token = cookies.accessToken;

      patchProfileImageRequest(data, token).then(patchProfileImageResponseHandler);
    }
    // description : 프로필 이미지 변경 응답 처리 함수 //
    const patchProfileImageResponseHandler = (code : string) => { 
      if(!user) return;
      if( code === 'NU') alert('존재하지 않는 유저입니다.');
      if( code === 'VF') alert('잘못된 입력입니다.');
      if( code === 'DE') alert('데이터 베이스 에러입니다.');
      if( code !== 'SU') {
        setProfileImageUrl(user?.profileImageUrl as string);
        return;
      }
      getUserRequest(user?.email).then(getUserResponseHandler);
    }

    //          event handler          //
    // description: 파일 인풋 변경 시 이미지 미리보기 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if(!event.target.files || !event.target.files.length) return;
      
      const data = new FormData();
      data.append('file', event.target.files[0])
      uploadFileRequest(data).then(profileUploadResponseHandler);
    }
    // description: 닉네임 변경 이벤트 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setNickname(event.target.value);
    }
    // description: 프로필 이미지 선택시 파일 인풋창 열림 이벤트 //
    const onProfileClickHandler = () => {
      if(userEmail !== user?.email) return;
      fileInputRef.current?.click();
    }
    // description: 닉네임 변경 버튼 클릭 이벤트 //
    const onNicknameButtonClickHandler = () => {
      if(nicknameChange) {
        const data: PatchNicknameRequestDto = { nickname };
        const token = cookies.accessToken;
        patchNicknameRequest(data, token).then(patchNicknameResponseHandler);
      }

      setNicknameChange(!nicknameChange);
    }

    //          component          //

    //          effect          //
    // description: 유저 이메일 상태가 바뀔 때마다 실행 //
    useEffect(() => {
      if (!userEmail) navigator(MAIN_PATH);
      
      const isMyPage = user?.email === userEmail;
      if (isMyPage) {
        if (user?.profileImageUrl) setProfileImageUrl(user?.profileImageUrl);
        else setProfileImageUrl(DefaultProflie);
        setNickname(user?.nickname as string);
      } else {
        getUserRequest(userEmail as string).then(getUserResponseHandler);
      }

    }, [userEmail, user]);

    //          render          //
    return (
      <div className='my-page-top'>
        <div className='my-page-top-container'>
          <div className='my-page-top-profile-box'>
            <div className='my-page-top-profile' style={{ backgroundImage: `url(${profileImageUrl})` }} onClick={onProfileClickHandler}></div>
            <input type='file' style={{ display: 'none' }} ref={fileInputRef} accept='image/*' onChange={onImageInputChangeHandler} />
          </div>
          <div className='my-page-top-info-box'>
            <div className='my-page-info-nickname-container'>
              {nicknameChange ? (
                <input className='my-page-info-nickname-input' type='text' value={nickname} onChange={onNicknameChangeHandler} size={nickname.length} />
              ) : (
                <div className='my-page-info-nickname'>{nickname}</div>
              )}
              {myPage && (
                <div className='my-page-info-nickname-button' onClick={onNicknameButtonClickHandler}>
                  <div className='my-page-edit-icon'></div>
                </div>
              )}
            </div>
            <div className='my-page-info-email'>{userEmail}</div>
          </div>
        </div>
      </div>
    );
  }

  //          component          //
  // description: 마이페이지 하단 //
  const MyPageBottom = () => {

    //          state          //
    // description: 페이지네이션과 관련된 상태 및 함수 //
    const { totalPage, currentPage, currentSection, onPageClickHandler, onNextClickHandler, onPreviousClickHandler, changeSection } = usePagination();
    // description: 전체 게시물 리스트 상태 //
    const [myPageBoardList, setMyPageBoardList] = useState<BoardListResponseDto[]>([]);
    // description: 전체 게시물 갯수 상태 //
    const [boardCount, setBoardCount] = useState<number>(0);
    // description: 현재 페이지에서 보여줄 게시물 리스트 상태 //
    const [pageBoardList, setPageBoardList] = useState<BoardListResponseDto[]>([]);
    
    //          function          //
    // description: 현재 페이지의 게시물 리스트 분류 함수 //
    const getPageBoardList = (boardList: BoardListResponseDto[]) => {
      const startIndex = COUNT_BY_PAGE * (currentPage - 1);
      const lastIndex = boardList.length > COUNT_BY_PAGE * currentPage ?
        COUNT_BY_PAGE * currentPage : boardList.length;
      const pageBoardList = boardList.slice(startIndex, lastIndex);

      setPageBoardList(pageBoardList);
    }
    // description : 유저 작성 게시물 리스트 불러오기 응답 처리 함수 //
    const getUserBoardListResponseHandler = (responseBody:GetUserListResponseDto | ResponseDto) => {
      const { code } = responseBody;
      if(code === 'VF') alert('잘못된 입력입니다.');
      if(code === 'DE') alert('데이터 베이스 에러입니다.');
      if(code !== 'SU') return;
      
      const { boardList } = responseBody as GetUserListResponseDto;
      setMyPageBoardList(boardList);
      setBoardCount(boardList.length);
      getPageBoardList(boardList);
      changeSection(boardList.length, COUNT_BY_PAGE);
    }
    

    //          event handler          //
    // description: 글쓰기 버튼 클릭 이벤트 //
    const onWriteButtonClickHandler = () => {
      navigator(BOARD_WRITE_PATH());
    }
    // description: 내 게시물로 가기 버튼 클릭 이벤트 //
    const onMoveMyPageButtonClickHanlder = () => {
      if (!user) {
        alert('로그인이 필요합니다.');
        navigator(AUTH_PATH);
        return;
      }
      if (!userEmail) return;
      navigator(USER_PAGE_PATH(userEmail));
    }

    //          component          //

    //          effect          //
    // description: 유저 이메일이 바뀔때 마다 게시물 리스트 불러오기 //
    useEffect(() => {
      if (!userEmail) {
        alert('잘못된 사용자 이메일입니다.');
        navigator(MAIN_PATH);
        return;
      }
      getUserBoardListRequest(userEmail).then(getUserBoardListResponseHandler);
    }, [userEmail]);
    
    // description: 현재 페이지가 바뀔때 마다 마이페이지 게시물 분류하기 //
    useEffect(() => {
      getPageBoardList(myPageBoardList);
    }, [currentPage]);
    // description: 현재 섹션이 바뀔때 마다 페이지 리스트 변경 //
    useEffect(() => {
      changeSection(boardCount, COUNT_BY_PAGE);
    }, [currentSection]);

    //          render          //
    return (
      <div className='my-page-bottom'>
        <div className='my-page-bottom-text'>{myPage ? '내 게시물 ' : '게시물 '} <span className='my-page-bottom-text-emphasis'>{boardCount}</span></div>
        <div className='my-page-bottom-container'>
          {boardCount ? (
            <div className='my-page-bottom-board-list'>
              {pageBoardList.map((item) => (<BoardListItem item={item} />))}
            </div>
          ) : (
            <div className='my-page-bottom-board-list-nothing'>게시물이 없습니다.</div>
          )}
          <div className='my-page-bottom-write-box'>
            {myPage ? (
              <div className='user-page-bottom-button' onClick={onWriteButtonClickHandler}>
                <div className='my-page-edit-icon'></div>
                <div className='user-page-bottom-button-text'>글쓰기</div>
              </div>
            ) : (
              <div className='user-page-bottom-button' onClick={onMoveMyPageButtonClickHanlder}>
                <div className='user-page-bottom-button-text'>내 게시물로 가기</div>
                <div className='user-page-right-arrow-icon'></div>
              </div>
            )}
          </div>
        </div>
        { boardCount !== 0 && (
          <Pagination 
            totalPage={totalPage} 
            currentPage={currentPage}
            onNextClickHandler={onNextClickHandler}
            onPageClickHandler={onPageClickHandler}
            onPreviousClickHandler={onPreviousClickHandler}
          />
        ) }
      </div>
    );
  }

  //          effect          //
  // description: 유저 이메일 상태가 바뀔 때마다 실행 //
  useEffect(() => {
    if (!userEmail) navigator(MAIN_PATH);

    const isMyPage = user?.email === userEmail;
    setMyPage(isMyPage);
  }, [userEmail, user]);

  //          render          //
  return (
    <div id='my-page-wrapper'>
      <MyPageTop />
      <MyPageBottom />
    </div>
  )
}