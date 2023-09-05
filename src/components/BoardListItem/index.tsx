import { useNavigate } from 'react-router-dom';
import { BOARD_DETAIL_PATH } from 'src/constants';
import { BoardListResponseDto } from 'src/interfaces/response/board';
import defaultImage from 'src/assets/default-profile-icon.png';

import './style.css';
import { dateFormat } from 'src/utils';
import emptyBoard from 'src/assets/empty-board.jpg';

interface Props {  //속성이 같으면 받아짐 // 자바는 클래스가 다르면 안 받아짐 // 혹시 모르니 다 받게 해둠 
  item: BoardListResponseDto;
}

//              component             //
// description : 게시물 리스트 아이템 컴포넌트 //
export default function BoardListItem({item}: Props) {

  //              state             //
  // description : 속성으로 받아오는 게시물 관련 상태 //
  const { boardNumber, title, content, imageUrl } = item;
  const { writerProfileImage, writerNickname, writeDatetime } = item;
  const { favoriteCount, viewCount, commentCount } = item;
  
  //            function              //
  // description : 페이지 이동을 위한 네비게이터 함수 //
  const navigator = useNavigate();

  //              event handler             //
  // description : 컴포넌트 클릭 이벤트 //
  const onClickHandler = () => {
    navigator(BOARD_DETAIL_PATH(boardNumber));
  }

  //              component             //

  //              effect             //

  //               render             //
  return (
    <div className='board-list-item-box' onClick= {onClickHandler}>
      <div className='board-list-item-left'>
        <div className='board-list-item-writer'>
          <div className='board-list-item-profile'>
            <div className='board-list-item-profile-image' style={{ backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultImage})` }}></div>
          </div>
          <div className='board-list-item-writer-right'>
            <div className='board-list-item-writer-nickname' >
              { writerNickname }
            </div>
            <div className='board-list-item-write-date'>
              { dateFormat(writeDatetime) }
            </div>
          </div>
        </div>
        <div className='board-list-item-title'>
          { title }
        </div>
        <div className='board-list-item-content'>
          { content }
        </div>
        <div className='board-list-item-count'>
          { `댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}` }
        </div>
      </div>
      <div className='board-list-item-right'>
        <div className='board-list-item-board-image' style={{ backgroundImage: `url(${imageUrl ? imageUrl : emptyBoard})` }}></div>
      </div>
    </div>
  )
}
