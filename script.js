const TABLE = "cards";
const STATUSES = ["todo", "in-progress", "done"];

let cards = [];

function showError(message) {
  const banner = document.getElementById("error-banner");
  banner.textContent = message;
  banner.hidden = false;
}

function clearError() {
  const banner = document.getElementById("error-banner");
  banner.hidden = true;
  banner.textContent = "";
}

async function loadCards() {
  const { data, error } = await supabaseClient
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    showError("카드를 불러오지 못했습니다. Supabase 연결 설정을 확인해주세요.");
    return;
  }

  clearError();
  cards = data;
  render();
}

function render() {
  STATUSES.forEach((status) => {
    const list = document.getElementById(status);
    list.innerHTML = "";

    const cardsForStatus = cards.filter((c) => c.status === status);
    cardsForStatus.forEach((card) => {
      list.appendChild(createCardElement(card));
    });

    document.getElementById(`count-${status}`).textContent = cardsForStatus.length;
  });
}

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = "card";
  el.draggable = true;
  el.dataset.id = card.id;

  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", card.id);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => el.classList.add("dragging"), 0);
  });

  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
  });

  const text = document.createElement("span");
  text.className = "card-text";
  text.textContent = card.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "card-delete";
  deleteBtn.textContent = "✕";
  deleteBtn.title = "삭제";
  deleteBtn.addEventListener("click", () => deleteCard(card.id, deleteBtn));

  el.appendChild(text);
  el.appendChild(deleteBtn);
  return el;
}

async function deleteCard(id, triggerBtn) {
  if (triggerBtn) triggerBtn.disabled = true;

  const { error } = await supabaseClient.from(TABLE).delete().eq("id", id);

  if (error) {
    console.error(error);
    showError("카드를 삭제하지 못했습니다. 다시 시도해주세요.");
    if (triggerBtn) triggerBtn.disabled = false;
    return;
  }

  clearError();
  cards = cards.filter((c) => c.id !== id);
  render();
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.currentTarget.classList.add("drag-over");
}

async function handleDrop(e) {
  e.preventDefault();
  const list = e.currentTarget;
  list.classList.remove("drag-over");

  const id = e.dataTransfer.getData("text/plain");
  const card = cards.find((c) => c.id === id);
  if (!card) return;

  const newStatus = list.id;
  const { error } = await supabaseClient
    .from(TABLE)
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error(error);
    showError("카드 상태를 변경하지 못했습니다. 다시 시도해주세요.");
    return;
  }

  clearError();
  card.status = newStatus;
  render();
}

document.querySelectorAll(".card-list").forEach((list) => {
  list.addEventListener("dragleave", () => {
    list.classList.remove("drag-over");
  });
});

document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("card-input");
  const text = input.value.trim();
  if (!text) return;

  const submitBtn = e.currentTarget.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  const { data, error } = await supabaseClient
    .from(TABLE)
    .insert({ text, status: "todo" })
    .select()
    .single();

  submitBtn.disabled = false;

  if (error) {
    console.error(error);
    showError("카드를 추가하지 못했습니다. 다시 시도해주세요.");
    return;
  }

  clearError();
  cards.push(data);
  render();

  input.value = "";
  input.focus();
});

loadCards();
