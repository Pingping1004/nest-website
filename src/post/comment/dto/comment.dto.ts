import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsNumber()
    commentLikeCount?: number;
}