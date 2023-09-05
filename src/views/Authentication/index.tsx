import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

import { SignUpRequestDto } from 'src/interfaces/request/auth';
import SignInRequestDto from 'src/interfaces/request/auth/sign-in.request.dto';
import { useUserStore } from 'src/stores';
import InputBox from 'src/components/InputBox';
import { signInMock } from 'src/mocks';
import { INPUT_ICON, MAIN_PATH, emailPattern, telNumberPattern } from 'src/constants';
import { signInRequest, signUpRequest } from 'src/apis';
import { SignInResponseDto } from 'src/interfaces/response/auth';
import ResponseDto from 'src/interfaces/response/response.dto';
import './style.css';

//              component             //
// description : 인증 화면  //
export default function Authentication() {

  //              state             //
  // description : Cookie 상태 //
  const [cookies, setCookie] = useCookies();

  //description: 로그인 혹은 회원가입 view 상태 //
  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

  //              function             //
  // description : 페이지 이동을 위한 네비게이터 함수 //
  const navigator = useNavigate();

  //              event handler             //

  //              component             //
  // description : 로그인 card 컴포넌트 //
  const SignInCard = () => {

  //              state             //
  // description : 로그인 유저 정보 상태 //
  const {setUser} = useUserStore();

  // description : 비밀번호 input 타입 상태 //
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // description : 로그인 error 상태 //
  const [error, setError] =useState<boolean>(false);
  // description : 이메일 입력값 상태 //
  const [email, setEmail]=useState<string>('');
  // description : 비밀번호 입력값 상태 //
  const [password, setPassword]=useState<string>('');
  // 로그인 정보가 맞으면 user로 정보 전달
  
  //              function              //
  // ! result as (SignInResponseDto) -> 타입을 강제로 명시해서 ()로 지정 //
  // ! setCookie("accessToken", token, { expires })  -> expires는 객체로 넣어준거임 //
  // ! expiredTime 는 ms니까 *1000 해줘야 함 //
  const signInResponseHandler = (result: SignInResponseDto | ResponseDto) => {
    const { code } = result;
    if (code === 'DM') setError(true);
    if (code === 'DE') alert ('데이터 베이스 에러입니다!!');
    if (code !== 'SU') return;

    const  { token, expiredTime } = result as SignInResponseDto;

    const now = new Date().getTime();
    const expires = new Date(now + expiredTime * 1000);

    setCookie("accessToken", token, { expires, path:MAIN_PATH });
    navigator(MAIN_PATH);

  }


  //              event handler             //
  // description : 비밀번호 타입 변경 버튼 클릭 이벤트 //
  const onPasswordIconClicHandler = () => {
    setShowPassword(!showPassword);
  }
  // description : 회원가입 이동 클릭 이벤트 //
  const onSignUpClickHandler = () => {
    setView('sign-up');
  }
  // description : 로그인 버튼 클릭 이벤트 //
  const onSignInButtonClickHandler = async () => {

    const data:SignInRequestDto = {
      email,
      password
    }

    signInRequest(data).then(signInResponseHandler);
   
  }

  //              component             //

  //              effect             //

  //              render             //
    return(
      <div className='auth-card'>
        <div className='auth-card-top'>
          <div className='auth-card-top-text-container'>
            <div className='auth-card-top-text' >로그인</div>
          </div>
          <div className='auth-card-top-input-container'>
            <InputBox label='이메일주소' type='text' placeholder='이메일 주소를 입력해주세요.' error={ error } value={ email } setValue={ setEmail }/>
            <InputBox label='비밀번호' type={showPassword ? 'text' : 'password'} placeholder='비밀번호를 입력해주세요' icon={ showPassword ? INPUT_ICON.ON : INPUT_ICON.OFF } buttonHandler = { onPasswordIconClicHandler } error={ error } value={password} setValue={setPassword} />
          </div>
        </div>
        <div className='auth-card-bottom'>
          { error && (
              <div className='auth-card-bottom-error-message'>
              {`이메일 주소 또는 비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.`}
              </div>
          )}
          <div className='auth-card-bottom-button' onClick={onSignInButtonClickHandler}>로그인</div>  
          <div className='auth-card-bottom-text'>
            신규 사용자이신가요? <span className='auth-emphasis' onClick={onSignUpClickHandler}>회원가입</span></div>
        </div>
      </div>
    )  
  }
  
  //               component              //
  // description : 회원가입 card 컴포넌트 //
  const SignUpCard = () => {

    //              state              //
    // description : 다음 포스트 (우편번호 검색) 팝업 상태 //
    const open = useDaumPostcodePopup();
    // description : 회원가입 card 페이지 상태 //
    const [page, setPage] = useState< 1 | 2 >(1);

    // description : 비밀번호 input 타입 상태 //
    const [showPassword, setShowPassword] = useState<boolean>(false);
    // description : 비밀번호 확인 input 타입 상태 //
    const [showPasswordCheck, setShowPasswordCheck] = useState<boolean>(false);
    // description : 이메일 패턴 error 상태 // 
    const [emailPatternError, setEmailPatternError] = useState<boolean>(false);
     // description : 이메일 중복 error 상태 //
    const [emailDuplicationError, setEmailDuplicationError ] = useState<boolean>(false);
     // description : 비밀번호 길이 error 상태 //
    const [passwordError, setPasswordError ] = useState<boolean>(false);
     // description : 비밀번호 확인 error 상태 //
    const [passwordCheckError, setPasswordCheckError] = useState<boolean>(false);
    // description : 닉네임 error 상태 //
    const [nicknameError, setNicknameError] = useState<boolean>(false);
    // description : 닉네임 중복 에러 상태 //
    const [nicknameDuplicationError, setNicknameDuplicationError] = useState<boolean>(false);

    // description : 휴대전화 번호 pattern error 상태 //
    const [telNumberError, setTelNumberError] = useState<boolean>(false);
    // description : 휴대전화번호 중복 에러 상태 //
    const [telNumberDuplicationError, setTelNumberDuplicationError] = useState<boolean>(false);

    // description : 주소 error 상태 //
    const [addressError, setAddressError] = useState<boolean>(false);

    // description : email 입력값 상태 //
    const [email, setEmail] =useState<string>('');
    // description : 비밀번호 입력값 상태 //
    const [password, setPassword] =useState<string>('');
    // description : 비밀번호 확인 입력값 상태 //
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    // description : 닉네임 입력값 상태 //
    const [nickname, setNickname] = useState<string>('');
    // description : 휴대전화번호 입력값 상태 //
    const [telNumber, setTelNumber] = useState<string>('');
    // description : 주소 입력값 상태 //
    const [address, setAddress] = useState<string>('');
    // description : 상세주소 입력값 상태 //
    const [addressDetail, setAddressDetail] = useState<string>('');

    //              function              //
    // description : 페이지 1에서 페이지2로 이동 시 검증 함수 //
    const checkPage1 = () => {
      const emailPatternFlag = !emailPattern.test(email);
      const passwordFlag = password.length < 8;
      const passwordCheckFlag = password !== passwordCheck;

      setEmailPatternError(emailPatternFlag);
      setPasswordError(passwordFlag);
      setPasswordCheckError(passwordCheckFlag);

      if(!emailPatternFlag && !passwordFlag && !passwordCheckFlag ) setPage(2);
    }
    // description : 페이지 2에서 회원가입 시 검증 함수 //
    const checkPage2 = () => {
      const telNumberFlag = !telNumberPattern.test(telNumber);

      setTelNumberError(telNumberFlag);
      setNicknameError(!nickname);
      setAddressError (!address);

      // if(!telNumberFlag && nickname && address) setView('sign-in');

      // description : 백엔드로 데이터 전송(회원가입 포맷에 맞춰서) // 
      const data:SignUpRequestDto = {
        email,
        password,
        nickname,
        telNumber,
        address,
        addressDetail
      } 

      signUpRequest(data).then(signUpResponseHandler);
    }

    const signUpResponseHandler = (code:string) => {
      // description : SU -> 성공 //
      if(code === 'SU') setView('sign-in');

      // description : EE -> 존재하는 이메일 //
      if(code === 'EE') {
        setEmailDuplicationError(true);
        setPage(1);
      }

      // description : EN -> 존재하는 닉네임 //
      if(code === 'EN') setNicknameDuplicationError(true);

      // description : ET -> 존재하는 전화번호 //
      if(code === 'ET') setTelNumberDuplicationError(true);

      // description : DE -> 데이터베이스 에러 //
      if(code === 'DE') alert('데이터 베이스 에러입니다.');
    };

    //              event handler             //
    // description : 비밀번호 타입 변경 버튼 클릭 이벤트 //
    const onPasswordIconClicHandler = () => {
      setShowPassword(!showPassword);
    }
    // description : 비밀번호 확인 타입 변경 버튼 클릭 이벤트 //
    const onPasswordCheckIconClicHandler = () => {
      setShowPasswordCheck(!showPasswordCheck);
    }
    // description : 주소 조회(검색) 버튼 클릭 이벤트 //
    const onAddressIconClickHandler = () => {
      open({ onComplete });
    }
    // description : 다음 혹은 회원가입 버튼 클릭 이벤트 //
    const onButtonClickHandler = () => {
      setEmailPatternError(false);
      setPasswordError(false);
      setPasswordCheckError(false);
      setNicknameError(false);
      setNicknameDuplicationError(false);
      setTelNumberError(false);
      setTelNumberDuplicationError(false);
      setAddressError(false);

      if ( page === 1 ) checkPage1();
      if ( page === 2 ) checkPage2();
    }
    // description : 로그인 이동 버튼 클릭 이벤트 //
    const onSignInClickHandler = () => {
      setView('sign-in');
    }
    // description : 주소 검색 완료 이벤트 //
    const onComplete = (data:Address) => {
      const address = data.address;
      setAddress(address);
    }

    //              component             //

    //              effect              //

    //              render              //
    return(
      <div className='auth-card'>
        <div className='auth-card-top'>
          <div className='auth-card-top-text-container'>
            <div className='auth-card-top-text'>회원가입</div>
            <div className='auth-card-top-text-opacity'>{ `${page}/2` }</div>
          </div>
          <div className='auth-card-top-input-container'>
            {
              page === 1 ? (
                <>
                <InputBox label='이메일 주소*' type='text' placeholder='이메일 주소를 입력해주세요.' error={ emailPatternError || emailDuplicationError } helper={ emailPatternError ? '이메일 주소 포맷이 맞지않습니다.' : emailDuplicationError ? '중복되는 이메일 주소입니다.' : '' } value={email} setValue={setEmail} />
                <InputBox label='비밀번호*' type={ showPassword ? 'text' : 'password' } placeholder='비밀번호를 입력해주세요.' icon={showPassword ? INPUT_ICON.ON : INPUT_ICON.OFF} buttonHandler={onPasswordIconClicHandler} error={ passwordError } helper={passwordError ? '비밀번호는 8자 이상 입력해주세요.' : '' } value={password} setValue={setPassword} />
                <InputBox label='비밀번호 확인*' type={showPasswordCheck ? 'text' : 'password'} placeholder='비밀번호를 다시 입력해주세요.' icon={showPasswordCheck ? INPUT_ICON.ON : INPUT_ICON.OFF} buttonHandler={onPasswordCheckIconClicHandler} error={ passwordCheckError } helper={passwordCheckError ? '비밀번호가 일치하지않습니다.' : ''} value={passwordCheck} setValue={setPasswordCheck} />
                </>
              ) : ( 
                <> 
                <InputBox label='닉네임*' type='text' placeholder='닉네임을 입력해주세요.' error={nicknameError || nicknameDuplicationError} helper={nicknameError ? '닉네임을 입력해주세요' : nicknameDuplicationError ? '중복되는 닉네임입니다.' : '' } value={nickname} setValue={setNickname} />
                <InputBox label='핸드폰 번호*' type='text' placeholder='핸드폰 번호를 입력해주세요.' error={telNumberError || telNumberDuplicationError} helper={ telNumberError ? '숫자만 입력해주세요.' : telNumberDuplicationError ? '중복되는 휴대전화번호입니다.' : ''} value={telNumber} setValue={setTelNumber} />
                <InputBox label='주소*' type='text' placeholder='우편번호 찾기' icon={INPUT_ICON.ARROW} error={addressError} helper={ addressError ? '우편번호를 선택해주세요.' : ''} value={address} setValue={setAddress} buttonHandler={onAddressIconClickHandler} />
                <InputBox label='상세주소*' type='text' placeholder='상세 주소를 입력해주세요.' value={addressDetail} setValue={setAddressDetail} />
                </> 
              )
            }
          </div>
        </div>
        <div className='auth-card-bottom'>
          <div className='auth-card-bottom-button' onClick={onButtonClickHandler}>
            { page === 1 ? '다음 단계' : '회원가입' }
          </div>
          <div className='auth-card-bottom-text'>
            이미 계정이 있으신가요? <span className='auth-emphasis' onClick={onSignInClickHandler}>로그인</span>
          </div>
        </div>
      </div>
    )  
  }
      
  //              effect              //
  
  //              render              //
  return (
    <div id='auth-wrapper'>
      <div className='auth-left'>
        <div className='auth-left-icon'></div>
        <div className='auth-left-text-container'>
          <div className='auth-left-text'>환영합니다.</div>
          <div className='auth-left-text'>NEWSTAR's Board입니다.</div>
        </div>
      </div>
      <div className='auth-right'>
      {view === 'sign-in' ? (<SignInCard />) : (<SignUpCard />)}
      </div>
    </div>
  )
}
