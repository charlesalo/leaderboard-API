import mongoose, { Document, Schema } from 'mongoose';
import { User } from './User';
import { Leaderboard } from './Leaderboard';

export interface Entry extends Document {
  score: number;
  scored_at: Date;
  user_id: User['_id'];
  board_id: Leaderboard['_id'];
}

const entrySchema: Schema = new Schema({
  score: { type: Number, required: true },
  scored_at: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  board_id: { type: Schema.Types.ObjectId, ref: 'Leaderboard', required: true },
});

entrySchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.user_id = ret.user_id.toHexString();
    ret.board_id = ret.board_id.toHexString();
    ret._id = ret._id.toHexString();
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<Entry>('Entry', entrySchema);
