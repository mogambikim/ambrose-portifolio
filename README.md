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
