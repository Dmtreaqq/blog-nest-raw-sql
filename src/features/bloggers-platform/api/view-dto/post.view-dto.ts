import { Post } from '../../domain/post.entity';
import { ReactionStatus } from '../enums/ReactionStatus';

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

  static mapToView(
    post: Post,
    userStatus: ReactionStatus | null,
    likesDislikesDto: { likesCount: number; dislikesCount: number },
    newestLikes: any[],
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post.id;
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;

    dto.extendedLikesInfo = {
      likesCount: Number(likesDislikesDto?.likesCount) ?? 0,
      dislikesCount: Number(likesDislikesDto?.dislikesCount) ?? 0,
      myStatus: userStatus ?? ReactionStatus.None,
      newestLikes: newestLikes.map((item) => {
        return {
          addedAt: item.addedAt,
          userId: item.userId || item.id,
          login: item.login,
        };
      }),
    };

    return dto;
  }
}
