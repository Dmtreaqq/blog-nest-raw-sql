import { Comment } from '../../domain/comment.entity';
import { ReactionDbStatus, ReactionStatus } from '../enums/ReactionStatus';

class CommentatorInfo {
  userId: string;
  userLogin: string;
}

class LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
}

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;
  createdAt!: Date;

  static mapToView(
    comment: any,
    userStatus: ReactionStatus | null,
    likesDislikesDto: { likesCount: number; dislikesCount: number },
  ): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt;
    dto.commentatorInfo = {
      userId: comment.commentatorId,
      userLogin: comment.login!,
    };

    dto.likesInfo = {
      likesCount: Number(likesDislikesDto?.likesCount) ?? 0,
      dislikesCount: Number(likesDislikesDto?.dislikesCount) ?? 0,
      myStatus: userStatus ?? ReactionStatus.None,
    };

    return dto;
  }
}
