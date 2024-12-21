import { IsNotEmpty, IsNumber, IsArray, IsOptional, IsString, ValidateNested, isNotEmpty } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { PictureDto } from './picture.dto';
import { User } from '../../users/schema/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNotEmpty()
  @IsString()
  audience: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  pictureContent?: string[];

  @IsOptional()
  @IsNumber()
  postLikeCount?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  comment?: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsNotEmpty()
  @IsString()
  audience?: string;

  @IsArray()
  @IsOptional()
  @Type(() => PictureDto)
  pictureContent?: PictureDto[];

  @IsNotEmpty()
  @IsNumber()
  postLikeCount?: number;

  @IsArray()
  @IsString()
  @IsOptional()
  comment?: string[];
}