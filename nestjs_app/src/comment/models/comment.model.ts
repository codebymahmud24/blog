import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

// Reply subdocument
export class Reply {
  _id?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', index: true })
  replyBy: string; 

  @Prop({ index: true })
  replyText: string; 

  @Prop()
  replyAt: Date;
}

@Schema({
  id: false,
  toJSON: {
    virtuals: true, // virtual fields JSON এ যাবে
    transform: (doc: any, ret: any) => {
      delete ret.__v; // mongoose internal version key বাদ
      return ret;
    },
  },
})
export class Comment {
  _id?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Post', index: true })
  postId: string; 

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', index: true })
  commentBy: string; // কোন user comment করেছে

  @Prop({ index: true })
  commentText: string;

  @Prop()
  commentAt: Date; 

  @Prop({ type: [Reply], default: [] })
  replies: Reply[]; // replies as subdocuments
}

// Create Mongoose schema
export const CommentSchema = SchemaFactory.createForClass(Comment);
