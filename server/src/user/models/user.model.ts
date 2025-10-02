import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Mongoose, { HydratedDocument } from 'mongoose';
import { userRoles } from 'src/utility/userRoles';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  id: false,
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  _id?: Mongoose.Types.ObjectId;
  @Prop()
  name: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  email: string;

  @Prop()
  avatar: string;

  // defult is "reader"
  @Prop({ type: [String], enum: [userRoles], default: userRoles.Reader })
  role: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
