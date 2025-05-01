import Koa from "koa";
import axios from "axios";
import { ContentBlock, Embed, Media, Post, Shout } from "./models";

const app = new Koa();
const api = axios.create({
  baseURL: `https://kknights.com/api/v1`,
});

const displayGallery = (images: Media[]) => {
  const elements = images
    .map((image: any) => {
      let result = `<img src="https://kknights.s3.eu-central-003.backblazeb2.com${image.url}">`;
      if (image.is_video) {
        result = `<video src="https://kknights.s3.eu-central-003.backblazeb2.com${image.url}"></video>`;
      }
      if (image.caption) {
        result = `<figure>${result}<figcaption>${image.caption}</figcaption></figure>`;
      }
      return result;
    })
    .join("");
  return `<slideshow>${elements}</slideshow>`;
};

const displayEmbed = (embed: Embed) => {
  if (embed.embed_type === "youtube") {
    return `<iframe src="https://youtube.com/embed/${embed.uid}"></iframe>`;
  }
  return "";
};

const displayBlock = (block: ContentBlock) => {
  if (block.block === "paragraph") {
    return block.json.content;
  }
  if (block.block === "embed") {
    return displayEmbed(block.json);
  }
  if (block.block === "gallery") {
    return displayGallery(block.json.images);
  }
  if (block.block === "sideGallery") {
    return block.json.content + displayGallery(block.json.images);
  }
  if (block.block === "divider") {
    return `<hr>`;
  }
  if (block.block === "quote") {
    let content = block.json.content;
    if (block.json.cite) {
      content += `<cite>${block.json.cite}</cite>`;
    }
    return `<blockquote>${content}</blockquote>`;
  }
  return "";
};

const displayImage = (data: Post) => {
  if (!data.image) {
    return "";
  }
  let res = `<img src="${data.image}">`;
  if (data.is_video_background) {
    return `<video src="${data.image}"></video>`;
  }
  return `<figure>${res}</figure>`;
};

const displayPost = async (slug: string) => {
  try {
    const response = await api.get(`/post/${slug}/`);
    const data = Post.parse(response.data);
    const site_name = "Kknights";
    const title = data.title;
    const description = data.description;
    const author = data.user.username;
    const blocks = data.content;
    const datetime_published = data.datetime_published;
    return `<!DOCTYPE html>

    <head>
        <title>${title}</title>
        <meta property="og:site_name" content="${site_name}">
        <meta property="og:description" content="${description}">
        <meta property="article:author" content="${author}">
        <meta property="tg:site_verification" content="g7j8/rPFXfhyrq5q0QQV7EsYWv4=">
        <meta property="article:published_time" content="${datetime_published}">
    </head>

    <body>
        <div class="article">
            <article class="article__content">
                ${displayImage(data)}
                ${blocks.map(displayBlock).join("")}
            </article>
        </div>
    </body>
    `;
  } catch (e) {
    console.error(e);
  }
  return null;
};

const displayShout = async (id: string) => {
  try {
    const response = await api.get(`/shout/${id}/`);
    const data = Shout.parse(response.data);
    const site_name = "Kknights";
    const title = data.short_title;
    const description = data.description;
    const author = data.user.username;
    const datetime_published = data.datetime_created;
    return `<!DOCTYPE html>

    <head>
        <title>${title}</title>
        <meta property="og:site_name" content="${site_name}">
        <meta property="og:description" content="${description}">
        <meta property="article:author" content="${author}">
        <meta property="tg:site_verification" content="g7j8/rPFXfhyrq5q0QQV7EsYWv4=">
        <meta property="article:published_time" content="${datetime_published}">
    </head>

    <body>
        <div class="article">
            <article class="article__content">
                ${data.text}
                ${displayGallery(data.images)}
                ${data.embeds.map(displayEmbed)}
            </article>
        </div>
    </body>
    `;
  } catch (e) {
    console.error(e);
  }
  return null;
};

app.use(async (ctx) => {
  const path = ctx.request.path;

  if (!ctx.header["user-agent"]?.includes("TelegramBot")) {
    ctx.redirect(`https://kknights.com${path}`);
    return;
  }

  const parsedPostPath = path.match(/^\/posts\/([^\/]+)$/);
  if (parsedPostPath) {
    const slug = parsedPostPath[1];
    const post = await displayPost(slug);
    if (post) {
      ctx.body = post;
      return;
    }
  }

  const parsedBonfirePath = path.match(/^\/bonfire\/(\d+)$/);
  if (parsedBonfirePath) {
    const id = parsedBonfirePath[1];
    const shout = await displayShout(id);
    if (shout) {
      ctx.body = shout;
      return;
    }
  }

  ctx.redirect(`https://kknights.com${path}`);
});

app.listen(process.env.PORT ?? 9980);
