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
- Add project names, short accurate descriptions, and direct repository links only after checking each repository.
- Add a CV file to the project and link it if you want a downloadable resume.
- Confirm current education wording and any project details you add.

There were no CV files in the supplied project directory at build time. No credentials, APIs, backend services, or environment variables are used.
