# Cyberpunk Red/Black GSAP Template

A simple, sophisticated cyberpunk (red/black) template powered by GSAP 3.
Includes three sections (About, Experience, Contact) and a simple animated
reel gallery with local image upload.

## Quick start

- Open `index.html` in a modern browser. For best results, use a local server:

```bash
# from the template folder
python3 -m http.server 5173
# then open http://localhost:5173
```

- Click "Upload Images" in the Experience → Showcase block to add your images.
  Hover over the reel to pause the animation.

## Edit content (easy)

- Update `config.js` to change title, tagline, about text, experience items, and contact info.
- Colors and style live in `styles.css` under CSS variables at the top (e.g., `--red`, `--bg`).

## Files

- `index.html` — Markup and section layout
- `styles.css` — Red/black neon theme
- `config.js` — Content configuration
- `script.js` — GSAP animations, navigation, and gallery logic

## Notes

- The reel uses GSAP for a continuous marquee-like animation. When you upload images,
  placeholder images are replaced.
- No build step required. This is a pure static template.