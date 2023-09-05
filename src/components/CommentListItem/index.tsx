import { CommentListResponseDto } from 'src/interfaces/response/board/get-comment-list.response.dto';
import './style.css';
import defaultImage from 'src/assets/default-profile-icon.png';

interface Props {
  item: CommentListResponseDto;
}

//              component             //
// description : 댓글 리스트 아이템 컴포넌트 //
export default function CommentListItem({ item }:Props) {

  //              state             //
  // description : 속성으로 받아오는 댓글 관련 상태 //
  const { writeDatetime, content, nickname, profileImageUrl } = item;

  //              function              //
  // description : 현재 시간과 작성 시간의 차이 함수 (Ex. 몇분전) // 
  const getTimeGap = () => {
    const writeDate = new Date(writeDatetime);
    writeDate.setHours(writeDate.getHours() -9);

    const writerDateNumber = writeDate.getTime();
    const nowDateNumber = new Date().getTime();
    
    const gap = Math.floor((nowDateNumber - writerDateNumber) / 1000);

    let result = '';
    if(gap >= 3600) result = `${Math.floor(gap / 3600)}시간 전`;
    if(gap < 3600) result = `${Math.floor(gap / 60)}분 전`; 
    if(gap < 60) result = `${gap}초 전`;

    return result;
  } 

  //              event handler              //

  //              component              //

  //              effect              //
  
  //              render              //
  return (
    <div className='comment-list-item-box'>
      <div className='comment-list-item-writer'>
        <div className='comment-list-item-profile'>
          <div className='comment-list-item-profile-image' style={{ backgroundImage: `url(${ profileImageUrl ? profileImageUrl : defaultImage })` }}></div>
        </div>
        <div className='comment-list-item-writer-nickname'>
          { nickname }
        </div>
        <div className='comment-list-item-writer-divider'>|</div>
        <div className='comment-list-item-write-time'>
           {getTimeGap() } 
        </div>
      </div>
      <div className='comment-list-item-comment'>
        { content }
      </div>
    </div>
  )
}
