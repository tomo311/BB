const allowedCategories = new Set([
  "shooting-form",
  "finish",
  "dribble",
  "post-play"
]);

const memoLabels = {
  usage: "使いどころ",
  advantages: "メリット",
  points: "気をつけるポイント"
};

async function loadCategory() {
  const requestedCategory = new URLSearchParams(window.location.search).get("category");
  const categoryId = allowedCategories.has(requestedCategory) ? requestedCategory : "shooting-form";

  try {
    const response = await fetch(`data/${categoryId}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    renderCategory(data);
  } catch (error) {
    console.error(error);
    renderError();
  }
}

function renderCategory(data) {
  document.title = `${data.category.name} | Center Circle`;
  document.querySelector("#category-title").textContent = data.category.name;

  const indexList = document.querySelector("#skill-index-list");
  const skillList = document.querySelector("#skill-list");

  indexList.replaceChildren(...data.skills.map(createIndexItem));
  skillList.replaceChildren(
    ...data.skills.map((skill, index) => createSkill(skill, index))
  );
}

function createIndexItem(skill, index) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#${skill.id}`;
  link.textContent = `${String(index + 1).padStart(2, "0")} ${skill.name}`;
  item.append(link);
  return item;
}

function createSkill(skill, index) {
  const article = document.createElement("article");
  article.className = "skill";
  article.id = skill.id;

  const summary = document.createElement("div");
  summary.className = "skill__summary";

  const headingGroup = document.createElement("div");
  headingGroup.className = "skill__heading-group";

  const number = document.createElement("span");
  number.className = "skill__number";
  number.textContent = String(index + 1).padStart(2, "0");

  const heading = document.createElement("h2");
  heading.textContent = skill.name;
  headingGroup.append(number, heading);

  const preview = document.createElement("div");
  preview.className = "skill__preview";

  const detailsId = `${skill.id}-details`;
  const thumbnail = createPreviewThumbnail(skill.videos[0], skill.name, detailsId);

  const memo = document.createElement("p");
  memo.className = "skill__memo-preview";
  memo.textContent = truncateText(skill.memo.summary, 100);

  const toggle = document.createElement("button");
  toggle.className = "skill__toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", detailsId);
  toggle.textContent = "詳しく見る";

  preview.append(thumbnail, memo, toggle);
  summary.append(headingGroup, preview);

  const details = createDetails(skill, detailsId);
  const toggleDetails = () => {
    const willOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.textContent = willOpen ? "閉じる" : "詳しく見る";
    details.hidden = !willOpen;
  };

  toggle.addEventListener("click", toggleDetails);
  thumbnail.addEventListener("click", toggleDetails);

  article.append(summary, details);
  return article;
}

function createPreviewThumbnail(video, skillName, detailsId) {
  const button = document.createElement("button");
  button.className = "skill__thumbnail-button";
  button.type = "button";
  button.setAttribute("aria-controls", detailsId);
  button.setAttribute("aria-label", `${skillName}の詳細を開く`);

  const image = createThumbnailImage(video, `${video.title}のサムネイル`);
  const play = document.createElement("span");
  play.className = "play-mark";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "+";

  button.append(image, play);
  return button;
}

function createDetails(skill, detailsId) {
  const details = document.createElement("div");
  details.className = "skill__details";
  details.id = detailsId;
  details.hidden = true;

  details.append(
    createVideosSection(skill.videos),
    createPracticeSection(skill.practice),
    createMemoSection(skill.memo)
  );
  return details;
}

function createVideosSection(videos) {
  const section = createDetailSection("参考動画");
  const list = document.createElement("div");
  list.className = "video-list";
  list.append(...videos.map(createVideoItem));
  section.append(list);
  return section;
}

function createVideoItem(video) {
  const item = document.createElement("article");
  item.className = "video-item";
  item.append(createVideoPlayer(video));

  const title = document.createElement("h4");
  title.textContent = video.title;
  item.append(title);
  return item;
}

function createVideoPlayer(video) {
  const button = document.createElement("button");
  button.className = "video-button";
  button.type = "button";
  button.setAttribute("aria-label", `${video.title}を再生する`);
  button.style.aspectRatio = "16 / 9";

  const image = createThumbnailImage(video, `${video.title}のサムネイル`);
  const play = document.createElement("span");
  play.className = "play-mark";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "▶";
  button.append(image, play);

  button.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.className = "video-frame";
    frame.src = createEmbedUrl(video);
    frame.title = video.title;
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    button.replaceWith(frame);
  });

  return button;
}

function createPracticeSection(practices) {
  const section = createDetailSection("練習方法");
  const list = document.createElement("ol");
  list.className = "practice-list";

  practices.forEach((practice) => {
    const item = document.createElement("li");
    item.className = "practice-item";
    const body = document.createElement("div");

    const title = document.createElement("h4");
    title.textContent = practice.title;
    const description = document.createElement("p");
    description.textContent = practice.description;
    body.append(title, description);

    if (practice.video) {
      const video = createVideoPlayer(practice.video);
      video.classList.add("practice-video");
      body.append(video);
    }

    item.append(body);
    list.append(item);
  });

  section.append(list);
  return section;
}

function createMemoSection(memo) {
  const section = createDetailSection("メモ");
  const list = document.createElement("dl");
  list.className = "memo-list";

  Object.entries(memoLabels).forEach(([key, label]) => {
    const row = document.createElement("div");
    row.className = "memo-row";
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = memo[key];
    row.append(term, description);
    list.append(row);
  });

  section.append(list);
  return section;
}

function createDetailSection(titleText) {
  const section = document.createElement("section");
  section.className = "detail-section";
  const title = document.createElement("h3");
  title.textContent = titleText;
  section.append(title);
  return section;
}

function createThumbnailImage(video, alt) {
  const image = document.createElement("img");
  image.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
  image.alt = alt;
  image.loading = "lazy";
  image.width = 480;
  image.height = 360;
  return image;
}

function createEmbedUrl(video) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0"
  });

  if (Number.isFinite(video.start)) params.set("start", video.start);
  if (Number.isFinite(video.end)) params.set("end", video.end);

  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?${params}`;
}

function truncateText(text, limit) {
  const characters = Array.from(text);
  return characters.length > limit ? `${characters.slice(0, limit).join("")}…` : text;
}

function renderError() {
  document.querySelector("#category-title").textContent = "ページを表示できません";
  const message = document.createElement("p");
  message.className = "error-message";
  message.textContent = "技術データを読み込めませんでした。";
  document.querySelector("#skill-list").replaceChildren(message);
}

loadCategory();
