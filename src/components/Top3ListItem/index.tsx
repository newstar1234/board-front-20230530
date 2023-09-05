import { useNavigate } from 'react-router-dom';
import { BOARD_DETAIL_PATH } from 'src/constants';
import { BoardListResponseDto } from 'src/interfaces/response/board';
import defaultImage from 'src/assets/default-profile-icon.png';
import './style.css';
import { dateFormat } from 'src/utils';

interface Props {
  item: BoardListResponseDto;
}
//              component              //
// description : Top3 게시물 컴포넌트 //
export default function Top3ListItem({item}:Props) {

  //              state             //
  // description : 속성으로 받아오는 Top3 게시물 상태 //
  const { boardNumber, title, content, imageUrl } = item;
  const { writerProfileImage, writerNickname, writeDatetime } = item;
  const { favoriteCount, viewCount, commentCount } = item;

  const background = imageUrl ? 
    { backgroundImage: `url(${ imageUrl })`} : 
    { backgroundColor : 'rgba(0,0,0,0.7)'};

  //              function              //
  // description : 페이지 이동을 위한 네비게이터 함수 //
  const navigator = useNavigate();

  //              event handler              //
  // description : 컴포넌트 클릭 이벤트 //
  const onClickHandler = () => {
    navigator(BOARD_DETAIL_PATH(boardNumber));
  }

  //              component              //

  //              effect              //

  //              render              //
  return (
    <div className='top3-list-item-box' style={background} onClick={onClickHandler} >
      <div className='top3-list-item-container'>
        <div className='top3-list-item-writer'>
          <div className='top3-list-item-profile'>
            <div className='top3-list-item-profile-image' style={{ backgroundImage: `url(${ writerProfileImage ? writerProfileImage : defaultImage })` }}></div>
          </div>
          <div className='top3-list-item-writer-right'>
            <div className='top3-list-item-writer-nickname'>
              { writerNickname }
            </div>
            <div className='top3-list-item-write-date'>
              { dateFormat(writeDatetime) }
            </div>
          </div>
        </div>
        <div className='top3-list-item-title'>
          { title }
        </div>
        <div className='top3-list-item-content'>
          { content }
        </div>
        <div className='top3-list-item-count'>
          { `댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}` }
        </div>
      </div>
    </div>
  )
}
