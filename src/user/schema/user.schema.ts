import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop()
  yourName: string;

  @Prop()
  userName: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ selected: false })
  password: string;

  @Prop([
    { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', default: [] },
  ])
  orders: mongoose.Schema.Types.ObjectId[];

  //   @Prop({ type: [Types.ObjectId], ref: 'Purchase', default: [] })
  // orders: Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }])
  reviews: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: String,
    enum: [Role.ADMIN, Role.USER],
    default: Role.USER,
  })
  role: Role;

  // @Prop({ type: String, enum: Role, default: Role.USER })
  // role: string;

  @Prop()
  isTerms: boolean;

  @Prop()
  lastName: string;


  @Prop({ type: String })
  filePath: string;


}

export const UserSchema = SchemaFactory.createForClass(User);
