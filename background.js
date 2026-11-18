const api = typeof browser !== "undefined" ? browser : chrome;
const activeTabs = {};

// Record tab metadata when updated or opened
api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:") && !tab.url.startsWith("edge://")) {
    activeTabs[tabId] = {
      title: tab.title || tab.url,
      url: tab.url,
      favIconUrl: tab.favIconUrl || "",
      openedAt: activeTabs[tabId]?.openedAt || Date.now()
    };
  }
});

// Snapshot already-open tabs when browser starts
api.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:") && !tab.url.startsWith("edge://")) {
      activeTabs[tab.id] = {
        title: tab.title || tab.url,
        url: tab.url,
        favIconUrl: tab.favIconUrl || "",
        openedAt: Date.now()
      };
    }
  });
});

// Save tab into Vault when closed
api.tabs.onRemoved.addListener((tabId) => {
  const closedTab = activeTabs[tabId];
  if (!closedTab) return;
  delete activeTabs[tabId];

  const minutesOpen = Math.max(1, Math.round((Date.now() - closedTab.openedAt) / 60000));

  api.storage.local.get({ vault: [] }, (data) => {
    const existing = data.vault.find((t) => t.url === closedTab.url);
    const entry = {
      id: Date.now().toString(),
      title: closedTab.title,
      url: closedTab.url,
      favIconUrl: closedTab.favIconUrl,
      closedAt: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      minutesOpen,
      pinned: existing ? existing.pinned : false
    };

    const filtered = data.vault.filter((t) => t.url !== closedTab.url);
    const updatedVault = [entry, ...filtered].slice(0, 300);
    api.storage.local.set({ vault: updatedVault });
  });
});