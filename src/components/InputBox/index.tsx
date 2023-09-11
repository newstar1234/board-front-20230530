import { Dispatch, SetStateAction, KeyboardEvent } from 'react'
import { INPUT_ICON } from 'src/constants';
import './style.css';

interface Props {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  helper?: string;
  icon?: INPUT_ICON;
  error?: boolean;
  setValue: Dispatch<SetStateAction<string>>;
  buttonHandler?: () => void;
  keyDownHandler?: (event: KeyboardEvent<HTMLInputElement>) => void;
} // mocks 데이터 말고  Props로 

//              component              //
// description : input 상자 컴포넌트 //
export default function InputBox( { label, type, placeholder, value, helper, icon, error, setValue, buttonHandler, keyDownHandler } : Props) {

  //              state             //

  //              function              //

  //              event handler              //
  // description : 입력값 변경 이벤트 //
  const onChangeHandler = (value: string) => {
    setValue(value);
  }
  // description : 키보드 입력 이벤트 //
  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(!keyDownHandler) return;
    keyDownHandler(event);
  }
 
  //              component              //

  //              effect              //
    
  //              render              //
  return (
    <div className='input-box'>
      <div className='input-box-label'>{ label }</div>
      <div className={error ? 'input-box-container-error' : 'input-box-container' }>
        <input className='input' type={ type } placeholder={ placeholder } value={value} onChange={(event) => onChangeHandler(event.target.value)} onKeyDown={onKeyDownHandler} />
        {
          icon && (
            <div className='input-box-icon' onClick={buttonHandler} >
            {
              icon === INPUT_ICON.ON ? (<div className='input-on-icon'></div>) :
              icon === INPUT_ICON.OFF? (<div className='input-off-icon'></div>) :
              icon === INPUT_ICON.ARROW ? (<div className='input-right-arrow-icon'></div> ) : 
              (<></>) 
            }
          </div>
          )
        } 
      </div>
      { helper && <div className='input-box-helper'>{ helper }</div> }
      </div>
  )
}
