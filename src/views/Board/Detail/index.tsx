import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getBoardRequest } from 'src/apis';
import { MAIN_PATH } from 'src/constants';


//              component             //
// description :  게시물 상세 화면 //
export default function BoardDetail() {

    //              state               //
    // description : 게시물 번호 path variable 상태 //
    const { boardNumber } = useParams();

    //              function              //
    // description : navigate 함수 //
    const navigator = useNavigate();

    //              component             //
    // description :  게시물 내용 컴포넌트 //
    const Board = () => {

    //              function              //
    

    //              effect              //
    // description : 게시물 번호가 바뀔 때 마다 실행 //
    useEffect(() => {
        if(!boardNumber) {
            alert('게시물 번호가 잘못되었습니다.');
            navigator(MAIN_PATH);
            return;
        }
        getBoardRequest(boardNumber)
    }, [boardNumber]);

    //              render              //
    return (
        <div className='board-detail-container'>
            <div className='board-detail-header'>
                <div className='board-detail-title'></div>
                <div className='board-detail-meta-data'>
                    <div className='board-detail-write-data'>
                        <div className='board-detail-writer-profile-image'></div>
                        <div className='board-detail-writer-nickname'></div>
                        <div className='board-detail-meta-divider'></div>
                        <div className='board-detail-write-date'></div>
                    </div>
                    <div className='board-detail-more-button-box'>
                        <div className='more-button-group'>
                            <div className='more-button'></div> 
                            <div className='divider'></div> 
                            <div className='more-button-red'></div> 
                        </div>
                        <div className='board-detail-more-button'>
                            <div className='more-icon'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='divider'></div>
            <div className='board-detail-body'>
                <div className='board-detail-contents'></div>
                <div className='board-detail-image-box'></div>
            </div>
        </div>
    );
}

    //              component             //
    // description : 게시물 하단 컴포넌트 //
    const BoardBottom = () => {

    //              render              //
    return (
        <div></div>
    )
    }

    //              render              //
    return (
     <div id='board-detail-wrapper'>
        <Board />
        <BoardBottom />
     </div>
  )
}
