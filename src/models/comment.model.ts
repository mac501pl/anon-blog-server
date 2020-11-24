import { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  commenterId: string;
  content?: string;
  upvoters?: Array<string>;
  downvoters?: Array<string>;
  edited?: boolean;
  created?: Date;
}

export const commentSchema: Schema = new Schema({
  commenterId: { type: String, required: true },
  content: { type: String, required: true, trim: true },
  upvoters: { type: [String], default: [] },
  downvoters: { type: [String], default: [] },
  edited: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

export default model<IComment>('Comment', commentSchema);
