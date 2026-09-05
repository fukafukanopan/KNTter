const timeline = document.querySelector("#timeline");
const template = document.querySelector("#post-template");

function setCount(button, value) {
  button.querySelector("span").textContent = Number(value ?? 0).toLocaleString("ja-JP");
}

function createPost(post) {
  const fragment = template.content.cloneNode(true);
  const article = fragment.querySelector(".post");
  const avatar = fragment.querySelector(".avatar");

  if (post.avatarImage) {
    const image = document.createElement("img");
    image.src = post.avatarImage;
    image.alt = "";
    image.loading = "lazy";
    avatar.append(image);
  } else {
    avatar.textContent = post.icon || "🌱";
  }

  fragment.querySelector(".name").textContent = post.name;
  fragment.querySelector(".meta").textContent = `${post.userId}${post.time ? ` · ${post.time}` : ""}`;
  fragment.querySelector(".post-text").textContent = post.text;

  const postImage = fragment.querySelector(".post-image");
  if (post.image) {
    postImage.src = post.image;
    postImage.alt = post.imageAlt || "投稿画像";
    postImage.hidden = false;
    postImage.loading = "lazy";
  }

  setCount(fragment.querySelector(".reply"), post.replies);
  setCount(fragment.querySelector(".repost"), post.reposts);
  setCount(fragment.querySelector(".like"), post.likes);

  for (const button of fragment.querySelectorAll(".repost, .like")) {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const count = button.querySelector("span");
      const selected = button.classList.toggle("active");
      const current = Number(count.textContent.replaceAll(",", ""));
      count.textContent = (current + (selected ? 1 : -1)).toLocaleString("ja-JP");
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  return article;
}

async function loadPosts() {
  try {
    const response = await fetch("../data/posts.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.posts)) throw new Error("posts が配列ではありません");
    timeline.replaceChildren(...data.posts.map(createPost));
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.className = "status error";
    message.textContent = "投稿を読み込めませんでした。ローカルサーバー経由で開いてください。";
    timeline.replaceChildren(message);
  }
}

loadPosts();
