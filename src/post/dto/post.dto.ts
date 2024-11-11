import { IsNotEmpty, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  // @Type(() => PictureDto)
  // pictureContent?: PictureDto[];
  // pictureContent?: Express.Multer.File[];
  pictureContent?: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsArray()
  @IsOptional()
  @Type(() => PictureDto)
  pictureContent?: PictureDto[];
}