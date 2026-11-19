# Tab Vault

A quiet, privacy-first browser extension (Manifest V3) that saves recently closed tabs with open-duration tracking, instant search, pinning, and JSON export—across **Chrome, Edge, Brave, Arc, and Safari**.

We have all closed a tab mid-thought—right in the middle of reading documentation, comparing notes, or chasing down a research thread—and had to hunt through browser history to find it again. **Tab Vault** is built to keep those moments easy to recover without adding clutter, accounts, or background bloat.

---

## Key Features

- **Automatic Tab Vaulting:** Captures closed tabs in the background so you do not have to remember to bookmark or save them manually.
- **Open-Duration Tracking:** Records how long a tab stayed open before closing, making it easier to distinguish quick links from tabs you spent time researching.
- **Permanent Pinning (`★`):** Pin important tabs so they stay at the top and are protected when clearing unpinned entries.
- **Real-Time Search & Filtering:** Filter between **All** and **Pinned** tabs and search by page title or URL as you type.
- **Local-First Privacy:** Stores data locally in `browser.storage.local` with one-click JSON export—no external servers, accounts, or tracking.
- **Handcrafted UI & Custom Artwork:** Styled with a dark-academia, analog-stationery palette and custom-illustrated Procreate assets (`icon.png`, `header-banner.png`, and `empty-vault.png`).

---

## Installation

### Chrome, Edge, Brave & Arc

1. Clone or download the repository:
   ```bash
   git clone [https://github.com/sumana-1004/tab-vault.git](https://github.com/sumana-1004/tab-vault.git)

```

2. Open your browser's extension management page (`chrome://extensions`, `edge://extensions`, or `brave://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `tab-vault` project directory.
5. Pin **Tab Vault** to your toolbar for quick access.

### Safari on macOS

#### Option A: Download from GitHub Actions (No Xcode Setup Required)

1. Open the [**Actions** tab](https://github.com/sumana-1004/tab-vault/actions) in this repository and select the latest **Build Safari macOS Extension** workflow run.
2. Download **`Tab-Vault-macOS-Safari`** under **Artifacts**.
3. Unzip the archive, move **`Tab Vault.app`** into `/Applications`, and launch it once (**Right-click -> Open** if macOS prompts for confirmation).
4. In **Safari**, go to **Settings -> Advanced** and check **Show features for web developers**.
5. In the **Develop** menu bar item, enable **Allow Unsigned Extensions**.
6. Go to **Safari -> Settings -> Extensions** and check **Tab Vault** to enable it.

#### Option B: Build Locally via Xcode

1. Clone the repository and open the Xcode wrapper project inside `tab-vault`.
2. Verify web extension resources (`manifest.json`, `popup.html`, `popup.css`, `popup.js`, and `icons/`) are synced cleanly.
3. Build and run the target in Xcode, then enable **Tab Vault** in **Safari -> Settings -> Extensions** (with **Allow Unsigned Extensions** enabled in Safari's **Develop** menu for local unsigned builds).

---

## Project Structure

```text
tab-vault/
├── manifest.json        # Cross-browser Manifest V3 configuration
├── background.js        # Background service worker listening for closed tabs & duration tracking
├── popup.html           # Popup layout and controls
├── popup.css            # Dark-academia / analog-stationery styling and layout rules
├── popup.js             # Search, filtering, pinning, restore, clear, and JSON export logic
├── icons/               # Custom Procreate assets (icon.png, header-banner.png, empty-vault.png)
├── Tab Vault/           # macOS / Xcode Safari web extension wrapper resources
└── .github/workflows/   # Automated Safari build workflow

```

---

## Technical Notes & Design Decisions

* **Manifest V3 Architecture:** Built around MV3 conventions with background event listeners and local storage persistence so the extension remains lightweight and compatible across Chromium browsers and Safari's web extension bridge.
* **Relative Asset Pathing:** Extension popups and stylesheets resolve bundled assets relative to the extension package (`icons/header-banner.png`, `icons/empty-vault.png`), avoiding broken paths across packaged builds.
* **Safari Local Signing Behavior:** On macOS, locally built or unsigned Safari extensions require re-enabling unsigned extension permissions across browser restarts unless signed with an active Apple Developer certificate—a known macOS security constraint documented here so contributors know what to expect during local testing.

---

## Feedback & Contributions

Suggestions, bug reports, and pull requests are welcome. If you spot an edge case across browsers or have ideas to make everyday tab recovery smoother, feel free to open an issue.

```

```
