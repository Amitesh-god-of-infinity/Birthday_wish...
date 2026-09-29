# Birthday Letter — Anwesha

A static, dark cinematic birthday-letter website with the original message preserved, integrated photos/videos, responsive layout, side-memory scrapbook effects, and optional background music.

## Media

All supplied photos and videos are already included in `assets/`.

To add your music, place your file here:

`assets/music.mp3`

Music starts after the visitor clicks **Begin Reading** (browser autoplay rules require a user gesture). It fades in gently and can be toggled with the Music button.

### Video audio behavior

When a visitor plays one of the embedded memory videos, the background music pauses so the video's own sound can be heard clearly. When the video finishes, the background music resumes if it had been playing before the video started.

## Message

The birthday message is stored in `content.js`. The wording, spelling, punctuation, emojis, capitalization and informal language are preserved. The numeric section markers are presentation-only and are not part of the message.

## Deployment

This is a static site. Upload the whole folder to GitHub Pages, Netlify, Vercel, or any static host. No build command is required.

## Local preview

Open `index.html` directly for a basic preview, or use VS Code Live Server for a more reliable local preview.
