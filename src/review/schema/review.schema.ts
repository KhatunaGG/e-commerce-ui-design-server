// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';

// @Schema({ timestamps: true })
// export class Likes {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   likedById: Types.ObjectId;
//   like: number;
// }

// export const LikeSchema = SchemaFactory.createForClass(Likes);

// @Schema({ timestamps: true })
// export class RatedBy {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   ratedById: Types.ObjectId;

//   @Prop({ type: Number, required: true })
//   rating: number;
// }

// export const RatedBySchema = SchemaFactory.createForClass(RatedBy);

// @Schema({ timestamps: true })
// export class Reply {
//   @Prop()
//   productId: string;

//   @Prop()
//   replyToId?: string;

//   @Prop()
//   replyOwnerId?: string;

//   @Prop()
//   status: string;

//   @Prop()
//   text: string;

//   @Prop()
//   replyOwnerName: string;

//   @Prop()
//   replyOwnerLastName: string;

//   @Prop({ type: [RatedBySchema], default: [] })
//   ratedBy: RatedBy[];

//   @Prop({ required: true })
//   _id: Types.ObjectId;

//   @Prop({ type: Number, min: 1, max: 5 })
//   rating?: number;
// }

// export const ReplySchema = SchemaFactory.createForClass(Reply);



// @Schema({ timestamps: true })
// export class Review {
//   @Prop()
//   reviewText: string;

//   @Prop()
//   productId: string;

//   @Prop()
//   reviewOwnerId: string | null;

//   // @Prop()
//   // likes: number;

//   @Prop()
//   status: string;

//   @Prop({ type: Number, min: 1, max: 5 })
//   rating?: number;

//   @Prop({ type: [ReplySchema], default: [] })
//   replies: Reply[];

//   @Prop({ type: [RatedBySchema], default: [] })
//   ratedBy: RatedBy[];

//   @Prop({ type: [LikeSchema], default: [] })
//   likes: Likes[];
// }

// export const ReviewSchema = SchemaFactory.createForClass(Review);




import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: false })
export class Likes {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  likedById: Types.ObjectId;
  
  @Prop({ type: Number, required: true, default: 1 }) 
  like: number;
}

export const LikeSchema = SchemaFactory.createForClass(Likes);

@Schema({ timestamps: true })
export class RatedBy {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ratedById: Types.ObjectId;

  @Prop({ type: Number, required: true })
  rating: number;
}

export const RatedBySchema = SchemaFactory.createForClass(RatedBy);

@Schema({ timestamps: true })
export class Reply {
  @Prop()
  productId: string;

  @Prop()
  replyToId?: string;

  @Prop()
  replyOwnerId?: string;

  @Prop()
  status: string;

  @Prop()
  text: string;

  @Prop()
  replyOwnerName: string;

  @Prop()
  replyOwnerLastName: string;

  @Prop({ type: [RatedBySchema], default: [] })
  ratedBy: RatedBy[];

  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ type: Number, min: 1, max: 5 })
  rating?: number;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);

@Schema({ timestamps: true })
export class Review {
  @Prop()
  reviewText: string;

  @Prop()
  productId: string;

  @Prop()
  reviewOwnerId: string | null;

  @Prop()
  status: string;

  @Prop({ type: Number, min: 0, max: 5, default: 0 })
  rating?: number;

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];

  @Prop({ type: [RatedBySchema], default: [] })
  ratedBy: RatedBy[];

  @Prop({ type: [LikeSchema], default: [] })
  likes: Likes[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);