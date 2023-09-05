import ResponseDto from "../response.dto";

export default interface GetBoardResponseDto extends ResponseDto {
    
    boardNumber : number;
    title : string;
    content : string;
    imageUrl : string | null;
    writeDatetime : string;
    writerProfileImage : string | null;  
    writerNickname : string;
    writerEmail : string;

}