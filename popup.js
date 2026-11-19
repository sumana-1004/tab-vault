const api = typeof browser !== "undefined" ? browser : chrome;

const tabList = document.getElementById("tabList");
const searchInput = document.getElementById("searchInput");
const countLabel = document.getElementById("countLabel");
const filterBtns = document.querySelectorAll(".filter-btn");

let vault = [];
let currentFilter = "all";

function saveVault() {
  api.storage.local.set({ vault }, render);
}

function render() {
  const query = searchInput.value.toLowerCase().trim();
  const sorted = [...vault].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const filtered = sorted.filter((tab) => {
    const matchesFilter = currentFilter === "all" || tab.pinned;
    const matchesQuery =
      tab.title.toLowerCase().includes(query) ||
      tab.url.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  countLabel.textContent = `${vault.length} tab${vault.length === 1 ? "" : "s"} vaulted`;
  tabList.innerHTML = "";

  if (filtered.length === 0) {
    tabList.innerHTML = `<div class="empty">No matching tabs in vault.<br/>Close any browser tab to see it appear here automatically.</div>`;
    return;
  }

  filtered.forEach((tab) => {
    const card = document.createElement("div");
    card.className = "tab-card";
    card.innerHTML = `
      <div class="tab-meta">
        <div class="tab-title" title="${tab.title}">${tab.title}</div>
        <div class="tab-sub">Closed ${tab.closedAt} · Open ${tab.minutesOpen}m</div>
      </div>
      <div class="card-btns">
        <button class="icon-btn pin-btn ${tab.pinned ? "pinned" : ""}" title="Pin forever">★</button>
        <button class="icon-btn del-btn" title="Remove">✕</button>
        <button class="restore-btn">Restore</button>
      </div>
    `;

    card.querySelector(".pin-btn").onclick = () => {
      tab.pinned = !tab.pinned;
      saveVault();
    };

    card.querySelector(".del-btn").onclick = () => {
      vault = vault.filter((t) => t.id !== tab.id);
      saveVault();
    };

    card.querySelector(".restore-btn").onclick = () => {
      api.tabs.create({ url: tab.url });
    };

    tabList.appendChild(card);
  });
}

searchInput.addEventListener("input", render);

filterBtns.forEach((btn) => {
  btn.onclick = () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  };
});

document.getElementById("exportBtn").onclick = async () => {
  const jsonText = JSON.stringify(vault, null, 2);
  const dataUrl =
    "data:application/json;charset=utf-8," + encodeURIComponent(jsonText);

  try {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `tab-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(jsonText);
      const btn = document.getElementById("exportBtn");
      const originalText = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  }
};

document.getElementById("clearBtn").onclick = () => {
  vault = vault.filter((t) => t.pinned);
  saveVault();
};

api.storage.local.get({ vault: [] }, (data) => {
  vault = data.vault;
  render();
});