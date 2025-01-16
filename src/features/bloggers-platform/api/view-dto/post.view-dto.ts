import { Post } from '../../domain/post.entity';
import { ReactionModelStatus, ReactionStatus } from '../enums/ReactionStatus';

class LikesDetails {
  addedAt: Date;
  userId: string;
  login: string;
}

class ExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: LikesDetails[];
}

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;

  extendedLikesInfo: ExtendedLikesInfo;

  static mapToView(post: Post, userStatus: ReactionStatus | null): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;

    // TODO: FIX WHEN LIKES APPEAR
    dto.extendedLikesInfo = {
      likesCount: this.countLikes([]),
      dislikesCount: this.countDislikes([]),
      myStatus: userStatus ?? ReactionStatus.None,
      newestLikes: this.countThreeLastLikesWithDetails([]),
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

  private static countThreeLastLikesWithDetails(
    reactions: any[],
  ): LikesDetails[] {
    const likes = reactions.filter(
      (reaction) => reaction.reactionStatus === ReactionModelStatus.Like,
    );

    return likes
      .slice(-3)
      .reverse()
      .map((like) => ({
        login: like.login,
        addedAt: like.createdAt,
        userId: like.userId,
      }));
  }
}
