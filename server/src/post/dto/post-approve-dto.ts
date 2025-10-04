import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class PostApproveDto{
    @IsNotEmpty({message:'approve can not be empty.'})
    @IsBoolean({message:'approve should be boolean'})
    approve:boolean;

    @IsNotEmpty({message:'ids can not be empty.'})
    @IsString({message:'id should be string.'})
    id:string;
}