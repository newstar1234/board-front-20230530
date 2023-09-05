export default interface BoardListResponseDto {
    
    boardNumber : number;
    title : string;
    content : string;
    imageUrl : string | null;
    viewCount : number;
    commentCount : number;
    favoriteCount : number;
    writeDatetime : string;
    writerProfileImage : string | null;  
    writerNickname : string;
    
}