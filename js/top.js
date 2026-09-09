async function loadCategories() {
  const categoryList = document.querySelector("#category-list");

  try {
    const response = await fetch("data/categories.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const categories = await response.json();
    categoryList.replaceChildren(
      ...categories.map((category, index) => createCategoryLink(category, index))
    );
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.className = "error-message";
    message.textContent = "カテゴリを読み込めませんでした。";
    categoryList.replaceChildren(message);
  }
}

function createCategoryLink(category, index) {
  const link = document.createElement("a");
  link.className = "category-link";
  link.href = `category.html?category=${encodeURIComponent(category.id)}`;

  const number = document.createElement("span");
  number.className = "category-link__number";
  number.textContent = String(index + 1).padStart(2, "0");

  const text = document.createElement("span");
  const name = document.createElement("span");
  name.className = "category-link__name";
  name.textContent = category.name;

  const description = document.createElement("span");
  description.className = "category-link__description";
  description.textContent = category.description;
  text.append(name, description);

  const arrow = document.createElement("span");
  arrow.className = "category-link__arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";

  link.append(number, text, arrow);
  return link;
}

loadCategories();
