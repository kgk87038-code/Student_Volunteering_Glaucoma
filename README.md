# Student Volunteering & Glaucoma Awareness

Vue 3 + Vite app for student volunteering and glaucoma awareness, styled with Tailwind CSS.

## Tailwind quickstart

### How styles work
- Tailwind is utility-first: you apply small classes directly to elements (e.g. `px-3 py-2 bg-slate-900`).
- The build only includes classes used in `index.html` and `src/**/*`.
- Tailwind base styles are loaded from `src/style.css` (see `@tailwind base/components/utilities`).

### Common patterns in this repo

#### Page container
```
class="mx-auto max-w-5xl px-4 py-6"
```

#### Card / panel
```
class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
```

#### Primary button
```
class="rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
```

#### Secondary button
```
class="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-indigo-400"
```

#### Error box
```
class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
```

#### Success box
```
class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200"
```

### Recommended workflow
- Start with layout: spacing + flex/grid + max widths.
- Add surface styles: `bg-*`, `border`, `rounded-*`.
- Add typography: `text-*`, `font-*`.
- Add interaction: `hover:*`, `focus:*`, `transition`.
- Add responsive tweaks: `md:*`, `lg:*`.

## Development
```
npm install
npm run dev
```
