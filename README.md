# Ambrose Mogambi — Portfolio

A dependency free static portfolio built with semantic HTML, CSS, and vanilla JavaScript.

## Local development

You need Node.js 18 or later for the build script. To preview the site, serve this folder with any static web server. For example, with Python installed:

```sh
python -m http.server 8000
```

Open `http://localhost:8000`. To generate the production output:

```sh
npm run build
```

The built site is written to `dist/`.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
3. Import the GitHub repository (authorize GitHub access if prompted).
4. Use these settings:
   - Framework preset: **Other**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: leave blank (there are no dependencies)
5. Deploy. No environment variables are required.

Vercel will run the build on each deployment. The included `vercel.json` configures clean URLs and standard static hosting.

## Personalize before publishing

- Replace the portrait placeholder in `index.html` with a professional image and meaningful alt text. Keep the supplied placeholder until then.
- The project cards in `index.html` reflect features checked against repository source. Keep descriptions tied to working code and leave demo links off when a running deployment cannot be verified.
- Add a CV file to the project and link it if you want a downloadable resume.
- Confirm the current education status before adding dates or completion wording.

There were no CV files in the supplied project directory at build time. The portfolio itself needs no credentials, APIs, backend services, or environment variables. External portfolio entries may rely on their own environment configuration; no secrets are included here.

## Portfolio personalization

### WhatsApp links

The WhatsApp contact link is configured for the number Ambrose supplied. The community group invitation is still unset; add the real invite URL to `whatsappGroupUrl` in `site-config.js` when available:

```js
window.AMBROSE_PORTFOLIO_CONFIG = Object.freeze({
  whatsappGroupUrl: 'https://chat.whatsapp.com/YOUR_REAL_INVITE_CODE',
  whatsappContactUrl: 'https://wa.me/254742427300',
});
```

Keep the group value empty until you have a real invitation; the group button stays hidden and the page explains where to configure it. The group link must use `chat.whatsapp.com`; a contact link must use `wa.me` with your country code and digits. Do not add private API keys or secrets. No Vercel environment variables are required. The contact link includes a short prefilled enquiry message.

### Creative samples

The Creative Studio gallery intentionally contains clearly labeled placeholders, not client work. Replace a `.gallery-placeholder` block in `index.html` with a real local image such as `<img src="/assets/my-sample.webp" alt="Short description of the actual work" loading="lazy">`, then update the card title, details, tools, and placeholder status. For video, use a user-controlled `<video controls preload="none" poster="/assets/thumbnail.webp">` element. Avoid autoplaying videos with audio. Keep only samples you have permission to publish.

The portrait is also a placeholder in the hero. Replace the contents of `.portrait-frame` with your optimized image and an accurate `alt` description when ready.

### Verified profile links

Email, GitHub, and LinkedIn links are set to the details supplied for this portfolio. Repository cards are fetched from the public GitHub API, exclude archived repositories, and label forks. Do not rewrite a fork's description to imply original authorship.
