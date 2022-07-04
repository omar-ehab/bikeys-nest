import { ObjectId } from 'mongoose';

class GeoPointDto {
  type: string;
  coordinates: number[];
  constructor(partial: Partial<GeoPointDto>) {
    Object.assign(this, partial);
  }
}

class OwnedBikeDto {
  brand: string;
  model: string;
  year: number;
  picture: string;
  constructor(partial: Partial<OwnedBikeDto>) {
    Object.assign(this, partial);
  }
}

export class UserDto {
  _id: ObjectId;
  name: string;
  mobile: string;
  email: string;
  profile_picture: string;
  license_picture: string;
  is_mobile_verified: boolean;
  is_verified: boolean;
  is_blocked: boolean;
  rate: number;
  two_factor_code: number;
  two_factor_expires_at: Date;
  latest_known_location: GeoPointDto;
  owned_bike: OwnedBikeDto;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
