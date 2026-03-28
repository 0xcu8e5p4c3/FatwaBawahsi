# 🚀 Portfolio Website — Full Stack

**Next.js 14 · TypeScript · Tailwind CSS · Supabase · Render.com**

A modern, SEO-optimized, single-page portfolio for IT professionals specializing in Business Analysis, System Analysis, QA Testing, and QA Engineering. Includes a full admin panel for content management.

---

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, meta)
│   │   ├── page.tsx                # Main single-page portfolio
│   │   ├── globals.css             # Global styles + animations
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── sitemap.ts              # SEO sitemap auto-generator
│   │   ├── robots.ts               # Robots.txt generator
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout (auth guard + sidebar)
│   │   │   ├── page.tsx            # Admin dashboard overview
│   │   │   ├── login/page.tsx      # Supabase Auth login page
│   │   │   ├── profile/page.tsx    # Profile CRUD (photo, CV, social links)
│   │   │   ├── projects/page.tsx   # Projects CRUD + image upload
│   │   │   ├── skills/page.tsx     # Skills CRUD with proficiency sliders
│   │   │   ├── experience/page.tsx # Experience/timeline CRUD
│   │   │   └── certifications/page.tsx  # Certifications CRUD
│   │   └── api/
│   │       ├── contact/route.ts    # Contact form email API
│   │       └── download/route.ts   # CV download count tracker
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Sticky navbar + mobile menu
│   │   │   └── Footer.tsx          # Footer with social links
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx     # Hero with avatar, stats, CTAs
│   │   │   ├── AboutSection.tsx    # About me + role highlights
│   │   │   ├── SkillsSection.tsx   # Grouped skills with progress bars
│   │   │   ├── ProjectsSection.tsx # Filterable projects grid
│   │   │   ├── ExperienceSection.tsx  # Vertical timeline
│   │   │   ├── CertificationsSection.tsx  # Certifications grid
│   │   │   └── ContactSection.tsx  # Contact form + social links
│   │   └── admin/
│   │       └── AdminSidebar.tsx    # Admin navigation sidebar
│   ├── lib/
│   │   ├── supabase.ts             # Browser Supabase client
│   │   ├── supabase-server.ts      # Server Supabase client
│   │   └── utils.ts                # Helper functions + style maps
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── supabase/
│   └── schema.sql                  # Full database schema + RLS policies
├── public/                         # Static assets (favicon, og-image)
├── .env.example                    # Environment variable template
├── next.config.js                  # Next.js config (standalone for Render)
├── tailwind.config.ts              # Tailwind config with custom tokens
└── package.json
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Supabase (get from supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Email (Gmail App Password — NOT your regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # 16-char App Password
EMAIL_TO=yourname@gmail.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://yoursite.onrender.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — portfolio is live!
Open [http://localhost:3000/admin](http://localhost:3000/admin) — admin panel.

---

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose your organization, set a database password, select a region closest to your users
3. Wait for the project to initialize (~2 minutes)

### Step 2: Run Database Schema

1. Go to **SQL Editor** → **New Query**
2. Copy the entire content of `supabase/schema.sql`
3. Paste and click **Run**

This creates all tables, inserts sample data, and sets up Row Level Security.

### Step 3: Create Storage Bucket

1. Go to **Storage** → **New Bucket**
2. Name: `portfolio`
3. Toggle **Public bucket**: ✅ ON
4. Click **Create bucket**

### Step 4: Create Admin User

1. Go to **Authentication** → **Users** → **Add User**
2. Enter your email and a strong password
3. Click **Create User**

> ⚠️ Keep these credentials safe — this is your only admin account.

### Step 5: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 📧 Gmail App Password Setup (Contact Form)

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required)
3. Search for **App Passwords**
4. Select App: **Mail** → Device: **Other** → type "Portfolio"
5. Copy the 16-character password → paste into `EMAIL_PASS`

---

## 🎨 Customization

### Update Your Info

After setting up Supabase:
1. Go to `/admin/login` and sign in
2. Navigate to **Profile** and fill in all your information
3. Upload your photo and CV PDF
4. Add your projects, skills, experience, and certifications

### Change the Color Scheme

Edit `tailwind.config.ts` — the `brand` color object and `backgroundImage` values.

### Change Fonts

Edit `src/app/layout.tsx` — swap `DM_Sans` and `Syne` for any Google Fonts.

---

## 🚀 Deploy to Render.com

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio build"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node .next/standalone/server.js` |
| **Node Version** | `20` |

### Step 3: Set Environment Variables on Render

In your Render service → **Environment** tab, add all variables from `.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASS
EMAIL_TO
NEXT_PUBLIC_SITE_URL   ← Set this to your Render URL after first deploy
```

### Step 4: Deploy

Click **Create Web Service** — Render will automatically build and deploy.

Your site will be live at: `https://your-service-name.onrender.com`

> **Note:** Free tier Render services sleep after 15 minutes of inactivity. Upgrade to a paid plan for always-on availability.

---

## 🔍 SEO Features

| Feature | Implementation |
|---------|---------------|
| Dynamic meta tags | `src/app/layout.tsx` |
| Open Graph cards | `src/app/layout.tsx` |
| Twitter cards | `src/app/layout.tsx` |
| Sitemap.xml | `src/app/sitemap.ts` (auto-generated) |
| Robots.txt | `src/app/robots.ts` (auto-generated) |
| Clean URLs | Next.js App Router |
| Image optimization | Next.js `<Image>` component |
| Fast load | Server components + ISR (60s revalidate) |
| Accessibility | Semantic HTML, ARIA labels, keyboard nav |

---

## 🔐 Security

- Admin routes protected by Supabase Auth session check
- Row Level Security (RLS) on all Supabase tables
- Public can only READ data; writes require authentication
- Service role key only used server-side (API routes)
- Environment variables never exposed to the browser (except `NEXT_PUBLIC_*`)
- Email validation on contact form API

---

## 📱 Features Summary

| Feature | Status |
|---------|--------|
| Responsive design (mobile-first) | ✅ |
| Dark mode (default) | ✅ |
| Smooth scroll navigation | ✅ |
| Hero with animated avatar | ✅ |
| Skills with progress bars | ✅ |
| Projects with filter & search | ✅ |
| Experience timeline | ✅ |
| Certifications grid | ✅ |
| Contact form with email | ✅ |
| CV download with tracking | ✅ |
| Admin login (Supabase Auth) | ✅ |
| Admin CRUD (all sections) | ✅ |
| Image upload (Supabase Storage) | ✅ |
| SEO (meta, OG, sitemap, robots) | ✅ |
| Custom 404 page | ✅ |
| Deploy-ready for Render.com | ✅ |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Backend:** Supabase (Auth, Database, Storage)
- **Email:** Nodemailer (Gmail SMTP)
- **Deployment:** Render.com
- **Icons:** Lucide React

---

## 📄 License

MIT License — free to use and modify for personal portfolio use.

---

> Built with ❤️ for IT professionals who want to stand out.
