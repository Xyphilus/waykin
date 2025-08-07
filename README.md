# Cyberpunk Red/Black GSAP Template

A simple, sophisticated cyberpunk (red/black) website powered by GSAP 3.
Includes three panels (About, Experience, Contact) and an animated reel gallery
that supports local image uploads.

## Live deployment

This repo deploys automatically to GitHub Pages from `cyberpunk-redblack-template/`.
After pushing to `main`, check the Actions tab for the "Deploy to GitHub Pages"
workflow, or visit Settings → Pages for the live URL.

## Quick start (local)

```bash
# go to the template folder
cd cyberpunk-redblack-template
python3 -m http.server 5173
# open http://localhost:5173
```

- Experience → Showcase → Upload Images to add your images
- Hover the reel to pause the animation

## Edit content

- Update `cyberpunk-redblack-template/config.js` to change title, tagline, about text,
  experience items, and contact info.
- Tweak colors and styles in `cyberpunk-redblack-template/styles.css` (see CSS variables at top).

## Structure

- `cyberpunk-redblack-template/index.html` — HTML layout
- `cyberpunk-redblack-template/styles.css` — Red/black neon theme
- `cyberpunk-redblack-template/config.js` — Easy content configuration
- `cyberpunk-redblack-template/script.js` — GSAP animations, navigation, gallery
- `.github/workflows/pages.yml` — GitHub Pages deployment

## License

MIT