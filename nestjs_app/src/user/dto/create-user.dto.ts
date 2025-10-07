import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @IsNotEmpty({ message: "Email cannot be empty" })
  @IsEmail({}, { message: "Please provide a valid email" })
  email: string;

  @IsNotEmpty({ message: "Password cannot be empty" })
  @MinLength(5, { message: "Password must be at least 5 characters long" })
  password: string;

  @IsNotEmpty({ message: "Avatar cannot be empty" })
  @IsString({ message: "Avatar must be a string" })
  avatar: string;
}

