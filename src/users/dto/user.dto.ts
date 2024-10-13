import { isNotEmpty, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';
export class SignupUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsOptional()
    @IsString()
    role?: string;
  
    @IsOptional()
    @IsString()
    profilePicture?: string;
}

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class UpdatedUserDto {
    @IsOptional()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    role?: string;
}