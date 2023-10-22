import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CommentService } from './comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { CommentController } from './comment.conroller.js';
import { IController } from '../../libs/rest/index.js';

export function createCommentContainer() {
  const container = new Container();
  container
    .bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);
  container.bind<ICommentService>(Component.CommentService).to(CommentService).inSingletonScope();
  container.bind<IController>(Component.CommentController).to(CommentController).inSingletonScope();

  return container;
}
