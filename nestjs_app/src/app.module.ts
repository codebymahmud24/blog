import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { CurrentUserMiddleware } from './utility/middleware/currentUserMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    UserModule,
    PostModule,
    CategoryModule,
    TagModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
