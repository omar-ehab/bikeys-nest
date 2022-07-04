import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class GeoPoint {
  @Prop({ default: 'Point' })
  type: string;
  @Prop({ required: true, index: '2dsphere' })
  coordinates: number[];
}

class OwnedBike {
  @Prop({ required: true })
  brand: string;
  @Prop({ required: true })
  model: string;
  @Prop({ required: true })
  year: number;
  @Prop()
  picture: string;
}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop()
  email: string;

  @Prop()
  profile_picture: string;

  @Prop()
  license_picture: string;

  @Prop({ default: false })
  is_mobile_verified: boolean;

  @Prop({ default: false })
  is_verified: boolean;

  @Prop({ default: false })
  is_blocked: boolean;

  @Prop({ default: 0 })
  rate: number;

  @Prop()
  two_factor_code: number;

  @Prop()
  two_factor_expires_at: Date;

  @Prop()
  latest_known_location: GeoPoint;

  @Prop()
  owned_bike: OwnedBike;

  @Prop()
  timestamps: true;
}

export type UserDocument = User & Document;
export const UsersSchema = SchemaFactory.createForClass(User);
