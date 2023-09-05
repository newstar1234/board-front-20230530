import './style.css';

//              component             //
// description : footer 레이아웃 컴포넌트 //
export default function Footer() {

  //              state             //

  //              function              //

  //              event handler              //

  //              component              //

  //              effect              //
    
  //              render              //
  return (
    <div id='footer'>
      <div className='footer-top'>
        <div className='fotter-top-left'>
          <div className='footer-logo-icon'></div>
          <div className='footer-logo-text'>NEWSTAR's Board</div>
        </div>
        <div className='fotter-top-right'>
          <div className='footer-email'>email@email.kr</div>
          <div className='footer-icon-button'>
            <div className='footer-insta-icon'></div>
          </div>
          <div className='footer-icon-button'>
            <div className='footer-blog-icon'></div>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
       Copyright ⓒ 2023  Kim. All Rights Reserved.
      </div>
    </div>
  )
}
