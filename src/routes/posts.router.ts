import { Router, Request, Response } from 'express';
import Comment, { IComment } from '../models/comment.model';
import Post, { IPost } from '../models/post.model';

const router: Router = Router();

interface IRequestWithPostBody extends Request {
  body: IPost
}

router.route('/').get(
  async (_req: Request, res: Response<Array<IPost> | string>): Promise<void> => {
    try {
      const posts: Array<IPost> = await Post.find({}, null, { sort: { created: -1 } });
      res.json(posts);
    } catch (err) {
      res.status(500).json((err as Error).message);
    }
  }
);

router.route('/add').post(
  async (req: IRequestWithPostBody, res: Response<IPost | string>): Promise<void> => {
    const { body: { content, posterId } } = req;
    const newPost: IPost = new Post({ posterId: posterId, content: content });
    try {
      const ret: IPost = await newPost.save();
      res.status(201).json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:id/delete').delete(
  async (req: IRequestWithPostBody, res: Response<IPost | string>): Promise<void> => {
    const { params: { id }, body: { posterId } } = req;
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      if (post.posterId !== posterId) {
        res.status(401).json('You are unauthorized to remove that post');
        return;
      }
      const ret: IPost = await Post.findByIdAndDelete(id) as IPost;
      res.status(200).json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:id/update').put(
  async (req: IRequestWithPostBody, res: Response<IPost | string>): Promise<void> => {
    const { params: { id }, body: { content, posterId } } = req;
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      if (post.posterId !== posterId) {
        res.status(401).json('You are unauthorized to modify that post');
        return;
      }
      const ret: IPost = await Post.findByIdAndUpdate(id, { content: content, edited: true }, { new: true }) as IPost;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

interface IRequestWithUserIdBody extends Request {
  body: {userId: string}
}

router.route('/:id/upvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IPost | string>): Promise<void> => {
    const { body: { userId }, params: { id } } = req;
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      if (post.upvoters?.includes(userId)) {
        res.status(403).json('Duplicate upvoter');
        return;
      }
      const ret: IPost | null = await Post.findByIdAndUpdate(id, { $push: { upvoters: userId } }, { new: true }) as IPost;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:id/remove_upvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IPost | string>): Promise<void> => {
    const { body: { userId }, params: { id } } = req;
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      const ret: IPost | null = await Post.findByIdAndUpdate(id, { $pull: { upvoters: userId } }, { new: true }) as IPost;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:id/downvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IPost | string>): Promise<void> => {
    const { body: { userId }, params: { id } } = req;
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      if (post.downvoters?.includes(userId)) {
        res.status(403).json('Duplicate downvoters');
        return;
      }
      const ret: IPost | null = await Post.findByIdAndUpdate(id, { $push: { downvoters: userId } }, { new: true }) as IPost;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:id/remove_downvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IPost | string>): Promise<void> => {
    const { body: { userId }, params: { id } } = req;
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      const ret: IPost | null = await Post.findByIdAndUpdate(id, { $pull: { downvoters: userId } }, { new: true }) as IPost;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

interface IRequestWithCommentBody extends Request {
  body: IComment
}

router.route('/:id/add_comment').post(
  async (req: IRequestWithCommentBody, res: Response<IComment | string>): Promise<void> => {
    const { body: { content, commenterId }, params: { id } } = req;
    const newComment: IComment = new Comment({ content: content, commenterId: commenterId });
    try {
      const post: IPost | null = await Post.findById(id);
      if (!post) {
        res.status(404).json(`Post with id ${id} not found`);
        return;
      }
      await Post.findByIdAndUpdate(id, { $push: { comments: newComment } });
      res.status(201).json(newComment);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:postId/comments/:commentId/delete').delete(
  async (req: IRequestWithCommentBody, res: Response<IComment | string>): Promise<void> => {
    const { params: { postId, commentId }, body: { commenterId } } = req;
    try {
      const post: IPost | null = await Post.findById(postId);
      if (!post) {
        res.status(404).json(`Post with id ${postId} not found`);
        return;
      }
      const comment: IComment | undefined = post.comments?.id(commentId);
      if (!comment) {
        res.status(404).json(`Comment with id ${commentId} not found`);
        return;
      }
      if (comment.commenterId !== commenterId) {
        res.status(401).json('You are unauthorized to remove that comment');
        return;
      }
      await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, { new: true }) as IPost;
      res.status(200).json(comment);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:postId/comments/:commentId/update').put(
  async (req: IRequestWithCommentBody, res: Response<IComment | string>): Promise<void> => {
    const { params: { postId, commentId }, body: { content, commenterId } } = req;
    try {
      const post: IPost | null = await Post.findById(postId);
      if (!post) {
        res.status(404).json(`Post with id ${postId} not found`);
        return;
      }
      const comment: IComment | undefined = post.comments?.id(commentId);
      if (!comment) {
        res.status(404).json(`Comment with id ${commentId} not found`);
        return;
      }
      if (commenterId !== comment.commenterId) {
        res.status(401).json('You are unauthorized to modify that comment');
        return;
      }
      const modifiedPost: IPost = await Post.findOneAndUpdate({ '_id': postId, 'comments._id': commentId }, { $set: { 'comments.$.content': content } }, { new: true }) as IPost;
      const ret: IComment = modifiedPost.comments?.id(commentId) as IComment;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:postId/comments/:commentId/upvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IComment | string>): Promise<void> => {
    const { body: { userId }, params: { postId, commentId } } = req;
    try {
      const post: IPost | null = await Post.findById(postId);
      if (!post) {
        res.status(404).json(`Post with id ${postId} not found`);
        return;
      }
      const comment: IComment | undefined = post.comments?.id(commentId);
      if (!comment) {
        res.status(404).json(`Comment with id ${commentId} not found`);
        return;
      }
      if (comment.upvoters?.includes(userId)) {
        res.status(403).json('Duplicate upvoter');
        return;
      }
      const modifiedPost: IPost = await Post.findOneAndUpdate({ '_id': postId, 'comments._id': commentId }, { $push: { 'comments.$.upvoters': userId } }, { new: true }) as IPost;
      const ret: IComment = modifiedPost.comments?.id(commentId) as IComment;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:postId/comments/:commentId/remove_upvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IComment | string>): Promise<void> => {
    const { body: { userId }, params: { postId, commentId } } = req;
    try {
      const post: IPost | null = await Post.findById(postId);
      if (!post) {
        res.status(404).json(`Post with id ${postId} not found`);
        return;
      }
      const comment: IComment | undefined = post.comments?.id(commentId);
      if (!comment) {
        res.status(404).json(`Comment with id ${commentId} not found`);
        return;
      }
      if (!comment.upvoters?.includes(userId)) {
        res.status(400).json('Not an upvoter');
        return;
      }
      const modifiedPost: IPost = await Post.findOneAndUpdate({ '_id': postId, 'comments._id': commentId }, { $pull: { 'comments.$.upvoters': userId } }, { new: true }) as IPost;
      const ret: IComment = modifiedPost.comments?.id(commentId) as IComment;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:postId/comments/:commentId/downvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IComment | string>): Promise<void> => {
    const { body: { userId }, params: { postId, commentId } } = req;
    try {
      const post: IPost | null = await Post.findById(postId);
      if (!post) {
        res.status(404).json(`Post with id ${postId} not found`);
        return;
      }
      const comment: IComment | undefined = post.comments?.id(commentId);
      if (!comment) {
        res.status(404).json(`Comment with id ${commentId} not found`);
        return;
      }
      if (comment.downvoters?.includes(userId)) {
        res.status(403).json('Duplicate downvote');
        return;
      }
      const modifiedPost: IPost = await Post.findOneAndUpdate({ '_id': postId, 'comments._id': commentId }, { $push: { 'comments.$.downvoters': userId } }, { new: true }) as IPost;
      const ret: IComment = modifiedPost.comments?.id(commentId) as IComment;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

router.route('/:postId/comments/:commentId/remove_downvote').put(
  async (req: IRequestWithUserIdBody, res: Response<IComment | string>): Promise<void> => {
    const { body: { userId }, params: { postId, commentId } } = req;
    try {
      const post: IPost | null = await Post.findById(postId);
      if (!post) {
        res.status(404).json(`Post with id ${postId} not found`);
        return;
      }
      const comment: IComment | undefined = post.comments?.id(commentId);
      if (!comment) {
        res.status(404).json(`Comment with id ${commentId} not found`);
        return;
      }
      if (!comment.downvoters?.includes(userId)) {
        res.status(403).json('Not a downvoter');
        return;
      }
      const modifiedPost: IPost = await Post.findOneAndUpdate({ '_id': postId, 'comments._id': commentId }, { $pull: { 'comments.$.downvoters': userId } }, { new: true }) as IPost;
      const ret: IComment = modifiedPost.comments?.id(commentId) as IComment;
      res.json(ret);
    } catch (err) {
      res.status(400).json((err as Error).message);
    }
  }
);

export default router;
