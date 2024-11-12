import { IsEmail, isNotEmpty, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';
export class SignupUserDto {
    @IsOptional()
    @IsString()
    googleId?: string;

    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsOptional()
    @IsString()
    password?: string;
  
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

    @IsOptional()
    @IsString()
    profilePicture?: string;
}

export class UpdatedUserDto {
    @IsOptional()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    role?: string;

    @IsString()
    displayName: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;
}