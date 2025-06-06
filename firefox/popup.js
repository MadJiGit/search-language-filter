// Firefox
const defaultFilters = [
  '-lang:ru',
  '-site:ru',
  '-site:*.ru',
  '-site:*.su',
  '-site:*.рф',
  '-site:*.yandex.*',
  '-site:*.vk.com',
  '-site:*.mail.ru',
  '-site:*.ok.ru',
  '-site:gufo.me',
  '-site:redboxsoft.com',
  '-site:stackexchange.com',
  '-site:russkiypro.com',
  '-site:ru.wiktionary.org',
  '-site:*.wikipedia.org/*hl=ru*',
  '-site:*.wikipedia.org/*lang=ru*'
];

document.addEventListener("DOMContentLoaded", () => {
  const statusSpan = document.getElementById("status");
  const toggleBtn = document.getElementById("toggleBtn");
  const customInput = document.getElementById("customInput");
  const addBtn = document.getElementById("addBtn");

  function updateUI(isEnabled) {
    statusSpan.textContent = isEnabled ? "Filtering is ON" : "Filtering is OFF";
    toggleBtn.classList.remove("on", "off");
    toggleBtn.classList.add(isEnabled ? "on" : "off");
    toggleBtn.textContent = isEnabled ? "Turn OFF" : "Turn ON";
  }

  function renderList(list) {
    const container = document.getElementById("customList");
    container.innerHTML = "";

    if (list.length === 0) {
      container.innerHTML = "<i>No custom filters</i>";
      return;
    }

    list.forEach((item, index) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.justifyContent = "space-between";
      row.style.marginBottom = "4px";

      const span = document.createElement("span");
      if (item.startsWith("-site:")) {
        span.textContent = item.replace("-site:", "");
        span.title = item;
      } else if (item.startsWith("-lang:")) {
        span.textContent = item.replace("-lang:", "lang:");
        span.title = item;
      } else {
        span.textContent = item;
        span.title = item;
      }
      span.style.flexGrow = "1";
      span.style.textAlign = "left";

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.style.fontSize = "8px";
      removeBtn.style.cursor = "pointer";
      removeBtn.style.background = "transparent";
      removeBtn.style.border = "none";
      removeBtn.style.color = "red";
      removeBtn.style.marginRight = "6px";
      removeBtn.style.minWidth = "20px";
      removeBtn.style.textAlign = "center";

      removeBtn.addEventListener("click", () => {
        const updated = list.filter((_, i) => i !== index);
        chrome.storage.local.set({ customBlacklist: updated }, () => {
          renderList(updated); // Refresh
        });
      });

      row.appendChild(removeBtn);
      row.appendChild(span);
      container.appendChild(row);
    });
  }

  function renderCustomList() {
    chrome.storage.local.get(["customBlacklist", "wasInitialized"], (data) => {
      if (data.wasInitialized !== true) {
        chrome.storage.local.set({ customBlacklist: defaultFilters, wasInitialized: true }, () => {
          renderList(defaultFilters);
        });
        return;
      }
      const list = data.customBlacklist ?? [];
      renderList(list);
    });
  }

  chrome.storage.local.get("filterEnabled", (data) => {
    const isEnabled = data.filterEnabled ?? true;
    updateUI(isEnabled);
  });

  toggleBtn.addEventListener("click", () => {
    chrome.storage.local.get("filterEnabled", (data) => {
      const current = data.filterEnabled ?? true;
      const next = !current;
      chrome.storage.local.set({ filterEnabled: next }, () => {
        updateUI(next);
      });
    });
  });

  addBtn.addEventListener("click", () => {
    let newFilter = customInput.value.trim();
    const rawValue = newFilter;
    if (!newFilter) return;

    if (!newFilter.startsWith("-site:") && !newFilter.startsWith("-lang:")) {
      newFilter = `-site:${newFilter}`;
    }

    chrome.storage.local.get("customBlacklist", (data) => {
      const existing = data.customBlacklist ?? [];
      if (!existing.includes(newFilter)) {
        existing.push(newFilter);
        chrome.storage.local.set({ customBlacklist: existing }, () => {
          customInput.value = "";
          renderCustomList();
          const toast = document.getElementById("toast");
          toast.textContent = `Added: ${rawValue}`;
          setTimeout(() => (toast.textContent = ""), 2000);
        });
      } else {
        const toast = document.getElementById("toast");
        toast.textContent = "This filter is already added.";
        toast.style.color = "red";
        setTimeout(() => {
          toast.textContent = "";
          toast.style.color = "green";
        }, 2000);
      }
    });
  });

  renderCustomList();
});
