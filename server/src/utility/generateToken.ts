import jwt from "jsonwebtoken";
import { UserDto } from "src/user/dto/user.dto";

export default  async function generateToken(user:UserDto):Promise<string>{
    return jwt.sign(
      {
        _id:user._id,email:user.email
      },
      process.env.TOKEN_SECRET,
      {expiresIn:process.env.TOKEN_EXPIRE_TIME}
    );
  }