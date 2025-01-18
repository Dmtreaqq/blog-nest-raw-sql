import { Comment } from '../../domain/comment.entity';
import { ReactionModelStatus, ReactionStatus } from '../enums/ReactionStatus';
// import { ReactionDocument } from '../../domain/reaction.entity';

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
  ): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt;
    dto.commentatorInfo = {
      userId: comment.commentatorId,
      userLogin: comment.login!,
    };
    // TODO: FIX WHEN LIKES APPEAR
    dto.likesInfo = {
      likesCount: this.countLikes([]),
      dislikesCount: this.countDislikes([]),
      myStatus: userStatus ?? ReactionStatus.None,
    };

    return dto;
  }

  private static countLikes(reactions: any[]): number {
    const likes = reactions.filter(
      (reaction) => reaction.reactionStatus === ReactionModelStatus.Like,
    );

    return likes.length;
  }

  private static countDislikes(reactions: any[]): number {
    const likes = reactions.filter(
      (reaction) => reaction.reactionStatus === ReactionModelStatus.Dislike,
    );

    return likes.length;
  }
}
