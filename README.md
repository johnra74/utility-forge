# Utility Forge

A static single-page application providing a collection of developer utility tools. Built with React 18, Bootstrap 5, and Vite. Check out **[live demo](https://johnra74.github.io/utility-forge/)**.

## Tools

| Tool | Route | Description |
|------|-------|-------------|
| QR Generator | `/qr` | Generate QR codes from any text or URL with custom colors, sizes, and error correction levels. Download as PNG. |
| Base64 Encoder/Decoder | `/base64` | Encode and decode Base64 for text, images, audio, video, PDF, and arbitrary files. Live file preview included. |
| Markdown Previewer | `/markdown` | Side-by-side Markdown editor and rendered preview with GitHub Flavored Markdown support. |
| JSON Formatter | `/json` | Format, minify, and validate JSON. Shows real-time validity, byte size, key count, and nesting depth. |
| UUID Generator | `/uuid` | Generate v1 (time-based) and v4 (random) UUIDs individually or in batches up to 100. Includes a UUID validator. |
| URL Encoder/Decoder | `/url` | Encode/decode URL components or full URLs. Parse query strings into key-value pairs. |
| Cron Generator | `/cron` | Build cron expressions field-by-field or enter a custom expression. Includes 8 presets and a human-readable description. |
| Ms → DateTime | `/milliseconds` | Convert a millisecond timestamp to UTC ISO 8601, UTC string, local date/time, and Unix seconds. |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```sh
npm install
```

### Develop

```sh
npm run dev
```

Opens at `http://localhost:5173` by default.

### Test

```sh
npm test                # run once
npm run test:watch      # watch mode
npm run test:coverage   # coverage report
```

198 tests across 16 test files covering all services and components.

### Build

```sh
npm run build
```

Outputs a fully static site to `dist/`. Serve with any static file host (Nginx, GitHub Pages, Netlify, S3, etc.).

```sh
npm run preview   # preview the production build locally
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── AppNavbar.jsx       # top navigation
│   └── tools/
│       ├── QRGenerator/
│       ├── Base64Tool/
│       ├── MarkdownPreviewer/
│       ├── JsonFormatter/
│       ├── UuidGenerator/
│       ├── UrlTool/
│       ├── CronGenerator/
│       └── MillisecondConverter/
├── hooks/
│   └── useClipboard.tsx        # shared clipboard hook
├── services/                   # pure-function service layer (framework-free)
│   ├── base64Service.tsx
│   ├── cronService.tsx
│   ├── jsonService.tsx
│   ├── millisecondService.tsx
│   ├── urlService.tsx
│   └── uuidService.tsx
├── App.jsx
└── main.jsx
```

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/) + [React Bootstrap](https://react-bootstrap.github.io/)
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- [qrcode.react](https://github.com/zpao/qrcode.react)
- [marked](https://marked.js.org/)
- [uuid](https://github.com/uuidjs/uuid)
- [cronstrue](https://github.com/bradymholt/cronstrue)
