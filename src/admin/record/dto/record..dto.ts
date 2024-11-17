import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RecordDto {
    @IsOptional()
    @IsString()
    message?:  string;

    @IsDate()
    date: Date;
}
