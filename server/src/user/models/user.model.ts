import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { userRoles } from "src/utility/userRoles";


export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,

})
export class User {
    @Prop()
    name: string;

    @Prop()
    password: string;

    @Prop()
    email: string;

    @Prop()
    avatar: string;

    // defult is "reader"
    @Prop({ type: String, enum: userRoles, default: userRoles.Reader })
    role: string;

}
export const UserSchema = SchemaFactory.createForClass(User);