import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentService } from './comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';

export function createCommentContainer() {
  const container = new Container();
  container.bind<ICommentService>(Component.CommentService).to(CommentService).inSingletonScope();
  container
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  return container;
}
