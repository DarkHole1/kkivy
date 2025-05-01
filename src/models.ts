import { z } from "zod";

const datetime = z.string().datetime({ offset: true });

export const Media = z.object({
  id: z.number(),
  url: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string().optional(),
  preview: z.string().nullable(),
  is_video: z.boolean(),
  is_looped: z.boolean().optional(),
});
export type Media = z.infer<typeof Media>;

export const Embed = z.object({
  uid: z.string(),
  url: z.string().optional(),
  embed_type: z.string(),
});
export type Embed = z.infer<typeof Embed>;

export const ContentBlock = z.discriminatedUnion("block", [
  z.object({
    block: z.literal("paragraph"),
    json: z.object({
      content: z.string(),
    }),
    is_expanded: z.boolean(),
  }),
  z.object({
    block: z.literal("gallery"),
    json: z.object({
      images: Media.array(),
      is_hidden: z.boolean(),
    }),
    is_expanded: z.boolean(),
  }),
  z.object({
    block: z.literal("divider"),
    json: z.object({}),
    is_expanded: z.boolean(),
  }),
  z.object({
    block: z.literal("embed"),
    json: Embed,
    is_expanded: z.boolean(),
  }),
  z.object({
    block: z.literal("sideGallery"),
    json: z.object({
      images: Media.array(),
      content: z.string(),
      is_hidden: z.boolean(),
      gallery_location: z.enum(["left", "right"]),
    }),
    is_expanded: z.boolean(),
  }),
  z.object({
    block: z.literal("quote"),
    json: z.object({
      cite: z.string(),
      content: z.string(),
    }),
    is_expanded: z.boolean(),
  }),
]);
export type ContentBlock = z.infer<typeof ContentBlock>;

export const UserCommon = z.object({
  id: z.number(),
  username: z.string(),
  avatar: z.object({
    tiny: z.string(),
    small: z.string(),
    big: z.string(),
  }),
  background_url: z.string(),
  is_supporter: z.boolean().nullable(),
});
export type UserCommon = z.infer<typeof UserCommon>;

export const UserFull = UserCommon.extend({
  social_accounts: z
    .object({
      id: z.number(),
      title: z.string(),
      icon: z.string(),
      background: z.string(),
      is_link: z.boolean(),
      social_uid: z.string(),
    })
    .array(),
  wallet: z.string().nullable(),
});
export type UserFull = z.infer<typeof UserFull>;

export const UserShort = UserCommon.extend({
  datetime_last_seen: datetime,
});
export type UserShort = z.infer<typeof UserShort>;

export const Tag = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});
export type Tag = z.infer<typeof Tag>;

const Pwnd = z.object({
  is_pwnd: z.boolean(),
  pwnd: z.number(),
  is_ownd: z.boolean(),
  ownd: z.number(),
});

export const CommentShort = z.object({
  id: z.number(),
  user: UserShort,
  text: z.string(),
  depth: z.number().optional(),
  datetime_created: datetime,
});
export type CommentShort = z.infer<typeof CommentShort>;

const CommentBase = CommentShort.extend({
  is_deleted: z.boolean(),
  is_edit_mode: z.boolean(),
  is_images_hidden: z.boolean(),
  images: Media.array(),
  embeds: Embed.array(),
  respond_to_comment: CommentShort.nullable(),
  ...Pwnd.shape,
  is_ignored: z.boolean().optional(),
});
type CommentBase = z.infer<typeof CommentBase>;

export type Comment = CommentBase & {
  children?: Comment[];
};
export const Comment: z.ZodType<Comment> = CommentBase.extend({
  children: z.lazy(() => Comment.array().optional()),
});

export const Post = z.object({
  id: z.number(),
  image: z.string().nullable(),
  is_video_background: z.boolean(),
  user: UserFull,
  main_tag: Tag,
  tags: Tag.array(),
  title: z.string(),
  short_title: z.string(),
  description: z.string(),
  slug: z.string(),
  preview: z.string(),
  content: ContentBlock.array(),
  comments: Comment.array(),
  ...Pwnd.shape,
  views_count: z.number(),
  datetime_published: datetime,
  is_longread: z.boolean(),
  is_comments_disabled: z.boolean(),
  is_pinned: z.boolean(),
  is_published: z.boolean(),
});
export type Post = z.infer<typeof Post>;

export const Shout = z.object({
  is_deleted: z.boolean(),
  is_edit_mode: z.boolean(),
  id: z.number(),
  user: UserShort,
  text: z.string(),
  images: Media.array(),
  embeds: Embed.array(),
  is_media_hidden: z.boolean(),
  is_images_hidden: z.boolean(),
  ...Pwnd.shape,
  datetime_created: datetime,
  is_bookmarked: z.boolean(),
  is_frozen: z.boolean(),
  is_muted_value: z.boolean(),
  is_pinned: z.boolean(),
  is_public: z.boolean(),
  is_reversed: z.boolean(),
  short_title: z.string(),
  description: z.string(),
  comments: Comment.array(),
  comments_count: z.number(),
  views_count: z.number(),
});
export type Shout = z.infer<typeof Shout>;
