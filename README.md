# Motion-Map

A beautiful, interactive geographic visualization of motion designers around the world.

## Features

- 🌍 Interactive world and country-level maps
- 🎨 Grid and map view modes
- 📅 Monthly archive navigation
- 🎬 Artist profiles with video previews
- 📱 Responsive design

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to project directory:
```bash
cd motion-map-vercel
```

3. Deploy:
```bash
vercel
```

Follow the prompts to complete deployment.

### Option 2: Deploy via GitHub

1. Push this project to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Zip this entire `motion-map-vercel` folder
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Click "Upload" and select your zip file
5. Vercel will auto-detect settings
6. Click "Deploy"

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` folder.

## Technology Stack

- React 18
- Vite
- Tailwind CSS
- Modern JavaScript (ES6+)

## Project Structure

```
motion-map-vercel/
├── src/
│   ├── App.jsx          # Main application component
│   ├── Icons.jsx        # SVG icon components
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles and animations
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## License

MIT
