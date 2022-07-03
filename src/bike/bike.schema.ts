import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bike {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  models: [string];

  @Prop()
  timestamps: true;
}

export type BikeDocument = Bike & Document;
export const BikeSchema = SchemaFactory.createForClass(Bike);
