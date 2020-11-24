import { Schema, model, Document, Types } from 'mongoose';
import { commentSchema, IComment } from './comment.model';

export interface IPost extends Document {
  posterId: string;
  content?: string;
  upvoters?: Array<string>;
  downvoters?: Array<string>;
  created?: Date;
  edited?: boolean;
  comments?: Types.DocumentArray<IComment>
}

const postSchema: Schema = new Schema({
  posterId: { type: String, required: true },
  content: { type: String, required: true, trim: true },
  upvoters: { type: [String], default: [] },
  downvoters: { type: [String], default: [] },
  edited: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  comments: { type: [commentSchema], default: [] }
});

export default model<IPost>('Post', postSchema);
