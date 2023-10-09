import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    return this.commentModel.create(dto);
  }

  public async findByOfferId(
    offerId: string,
    count?: number,
  ): Promise<DocumentType<CommentEntity>[]> {
    const limit = count && count < DEFAULT_COMMENT_COUNT ? count : DEFAULT_COMMENT_COUNT;
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate('author', ['name', 'avatar'])
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}
