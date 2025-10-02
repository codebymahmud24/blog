import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import { Model, Mongoose, ObjectId, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserRolesDto } from './dto/update-role.dto';
import { userRoles } from 'src/utility/userRoles';
// import {ObjectId} from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, avatar } = createUserDto;

    // 1️⃣ Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2️⃣ Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3️⃣ Create new user instance
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // 4️⃣ Save to DB
    try {
      return await newUser.save();
    } catch (err) {
      throw new BadRequestException('Failed to create user');
    }
  }

  async signin(signInDto: SignInDto): Promise<UserDto> {
    const user = await this.userModel
      .findOne({ email: signInDto.email })
      .select('+password');
    if (!user) throw new UnauthorizedException('Bad credentials.');

    const passwordMatched: boolean = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!passwordMatched)
      throw new UnauthorizedException(
        'Bad credentials. Password does not match.',
      );

    // user কে userDTO তে রূপান্তর করে শুধু দরকারি safe fields client এ পাঠানো হচ্ছে
    return plainToClass(UserDto, user);
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('user not found.');
    return user;
  }

  async updateRoles(updateUserRolesDto: UpdateUserRolesDto): Promise<User | null> {
  const user = await this.userModel.findOne({ _id: updateUserRolesDto.id });
  if (!user) throw new NotFoundException('User not found.');
  user.role = updateUserRolesDto.role; // matches schema
  return await user.save();
  }

  async getAuthors(): Promise<User[]> {
    return await this.userModel
      .find({ role: userRoles.Auther })
      .select('_id name avatar');
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

}
