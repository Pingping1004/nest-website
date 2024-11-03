import { isNotEmpty, IsNotEmpty, IsOptional, isString, IsString } from 'class-validator';
export class SignupUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsOptional()s
    @IsString()
    role?: string;
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

    @IsString()
    displayName: string;

    @IsOptional()
    @IsString()
    porfilePicture?: string;
}