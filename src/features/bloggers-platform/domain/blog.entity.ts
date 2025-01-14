// const urlRegex = new RegExp(
//   '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
// );

/*

@Prop({ type: String, maxlength: 15, required: true })
  name: string;

  @Prop({ type: String, maxlength: 500, required: true })
  description: string;

  @Prop({ type: String, maxlength: 100, match: urlRegex, required: true })
  websiteUrl: string;

  @Prop({ type: Boolean, required: true })
  isMembership: boolean;

  @Prop({ type: Date })
  createdAt: Date;
 */

export class Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
}
