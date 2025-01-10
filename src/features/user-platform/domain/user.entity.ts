// const emailRegex = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
// const loginRegex = new RegExp('^[a-zA-Z0-9_-]*$');

// export class UserReaction {
//   commentOrPostId: string;
//   type: string;
//   status: string;
// }

export class User {
  id: string;

  login: string;

  password: string;

  email: string;

  isConfirmed: boolean;

  confirmationCode: string;

  confirmationCodeExpirationDate: string;

  recoveryCode: string;

  recoveryCodeExpirationDate: string;

  // userReactions: string[];

  createdAt: Date;
}
