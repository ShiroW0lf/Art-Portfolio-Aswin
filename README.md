# ✦ aswin draws — Art Portfolio

A healing, inspiring art portfolio site built for GitHub Pages.

---

## 🚀 Deploy to GitHub Pages (step by step)

### 1. Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository** (the green button or the `+` icon)
3. Name it exactly: `aswin-draws` (or anything you like)
4. Set it to **Public**
5. Click **Create repository**

---

### 2. Upload the files

**Option A — Drag & drop (easiest):**
1. On your new repo page, click **uploading an existing file**
2. Drag all files from this folder into the browser
3. Make sure the folder structure is preserved:
   ```
   index.html
   css/style.css
   css/admin.css
   js/data.js
   js/gallery.js
   js/admin.js
   admin/index.html
   images/  ← your art goes here
   ```
4. Scroll down, write a commit message like `Initial portfolio`, click **Commit changes**

**Option B — Git (if you have Git installed):**
```bash
git init
git add .
git commit -m "Initial portfolio"
git remote add origin https://github.com/YOUR_USERNAME/aswin-draws.git
git push -u origin main
```

---

### 3. Enable GitHub Pages

1. Go to your repo → **Settings** (top tab)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: **main** and folder: **/ (root)**
5. Click **Save**
6. Wait ~60 seconds, then your site is live at:
   ```
   https://YOUR_USERNAME.github.io/aswin-draws/
   ```

---

## 🖼 Adding your artwork

### Method 1: Admin Dashboard (recommended)

1. Open `admin/index.html` in your browser — or visit `your-site.github.io/aswin-draws/admin/`
2. Select a section (Fundamentals, Environments, etc.)
3. Upload your images using the upload zone or drag & drop
4. Edit titles, mediums, and mark pieces as Featured
5. Click **Export data.js**
6. Copy the output, replace the `js/data.js` file in your repo, and push

### Method 2: Edit data.js directly

Open `js/data.js` and add entries like this:

```js
const PORTFOLIO_DATA = {
  fundamentals: [
    {
      id: "f1",
      title: "Light & Shadow Study",
      meta: "Pencil on paper · 2024",
      image: "images/fundamentals/light-shadow.jpg",
      featured: true   // ← shows large in gallery
    }
  ],
  environments: [ /* ... */ ],
  characters:   [ /* ... */ ],
  fanarts:      [ /* ... */ ]
};
```

Then put your image files in the matching folders:
- `images/fundamentals/`
- `images/environments/`
- `images/characters/`
- `images/fanarts/`

---

## 🗂 File structure

```
aswin-draws/
├── index.html          ← public portfolio (what visitors see)
├── admin/
│   └── index.html      ← your private dashboard
├── css/
│   ├── style.css       ← main styles
│   └── admin.css       ← admin dashboard styles
├── js/
│   ├── data.js         ← all your artwork data lives here
│   ├── gallery.js      ← renders the public gallery
│   └── admin.js        ← powers the dashboard
└── images/
    ├── fundamentals/
    ├── environments/
    ├── characters/
    └── fanarts/
```

---

## 💡 Tips

- **Featured pieces** appear as wide hero cards at the top of each section
- Keep image files under **2MB** each for fast load times
- Recommended image sizes: landscape `1600×900`, portrait `900×1125`
- The admin page is publicly accessible at `/admin/` — it's not password-protected (GitHub Pages is static). If you want privacy, just keep the URL secret, or delete the admin folder after updating data.js.

---

Made with love · [@aswin_draws](https://instagram.com/aswin_draws)
