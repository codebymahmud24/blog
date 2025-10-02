import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/utility/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { SignInDto } from './dto/signin.dto';
import generateToken from 'src/utility/generateToken';
import type { Response } from 'express';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorize.guard';
import { userRoles } from 'src/utility/userRoles';
import { User } from './models/user.model';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { ObjectId } from 'mongoose';
import { UpdateUserRolesDto } from './dto/update-role.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Serialize(UserDto)
  @Post('/signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const user = await this.userService.signin(signInDto);
    const token = await generateToken(user);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    return user;
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true, // production এ HTTPS হলে এটা true রাখা ভালো
    });

    return { message: 'Logged out successfully' };
  }

  @Get()
  // @UseGuards(AuthenticationGuard , AuthorizeGuard([userRoles.Admin]))
  async findAll():Promise<User[]> {
    return await this.userService.findAll();
  }


  @Get(':id')
  @UseGuards(AuthenticationGuard , AuthorizeGuard([userRoles.Admin]))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
 @Get('/me/profile')
  @UseGuards(AuthenticationGuard)
  async me(@CurrentUser() currentUser:User){
    return await this.userService.findOne(currentUser._id?.toString() as string);
  }

  @Put('/roles/update')
  @UseGuards(AuthenticationGuard,AuthorizeGuard([userRoles.Admin]))
  async updateRoles(@Body() updateUserRolesDto:UpdateUserRolesDto):Promise<User | null>{
    return await this.userService.updateRoles(updateUserRolesDto)
  }

  @Get('roles/authors')
  async getAuthors():Promise<User[]>{
    return await this. userService.getAuthors();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
