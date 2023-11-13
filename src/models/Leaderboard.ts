import mongoose, { Document, Schema } from 'mongoose';

export interface Leaderboard extends Document {
  name: string;
  created_at: Date;
  updated_at: Date;
}

const leaderboardSchema: Schema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

leaderboardSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret._id = ret._id.toHexString();
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<Leaderboard>('Leaderboard', leaderboardSchema);