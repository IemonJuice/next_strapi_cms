# Practicum 2.3 — Headless CMS як керований PaaS

> **Strapi + Next.js + Vercel** — повнофункціональна система керування контентом із headless-архітектурою.

🔗 **Live Demo:** admin [https://uplifting-friends-1e5303dc17.strapiapp.com/admin](https://uplifting-friends-1e5303dc17.strapiapp.com/admin)
🔗 **Live Demo:** front [https://next-strapi-kdcrp71sp-xixsenturys-projects.vercel.app/](https://next-strapi-kdcrp71sp-xixsenturys-projects.vercel.app/)
🔗 **GITHUB:** [https://github.com/IemonJuice/practicum-2-3](https://github.com/IemonJuice/practicum-2-3)


---

## Опис проекту

Проект реалізує концепцію **Headless CMS як керованого PaaS-рішення**. Система складається з двох незалежних частин:

- **Backend** — Strapi v5 (Node.js/TypeScript) виступає як headless CMS, надаючи REST API для управління контентом та адміністративну панель для редакторів.
- **Frontend** — Next.js 14 (TypeScript/React) з App Router, що споживає контент через Strapi REST API та рендерить публічний вебсайт.

Розгортання фронтенду відбувається на **Vercel** з підтримкою SSR та автоматичним CI/CD через GitHub.

---

##  Архітектура системи

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                    (IemonJuice/next_strapi_cms)                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ git push → Vercel webhook
                             ▼
┌──────────────────────────────────────────┐
│         Vercel Edge Network / CDN        │
│   ┌──────────────────────────────────┐   │
│   │       Next.js 14 Frontend        │   │
│   │   (TypeScript / React / SSR)     │   │
│   │   - App Router                   │   │
│   │   - Server Components            │   │
│   │   - Client Components            │   │
│   └──────────────┬───────────────────┘   │
└─────────────────-│──────────────────────┘
                   │ REST API (HTTPS)
                   ▼
┌──────────────────────────────────────────┐
│        Strapi v5 Backend (PaaS)          │
│   - REST Content API (/api/*)            │
│   - Admin Panel (/admin)                 │
│   - Users & Permissions                  │
│   - Media Library                        │
│                  │                       │
│     ┌────────────▼────────────┐          │
│     │  SQLite / PostgreSQL DB │          │
│     └─────────────────────────┘          │
└──────────────────────────────────────────┘
```

### Ключові архітектурні рішення

| Рішення | Обґрунтування |
|---------|---------------|
| **Headless CMS (Strapi)** | Розділення контенту та представлення. Backend-агностичний підхід дозволяє підключити будь-який фронтенд або мобільний клієнт до одного API. |
| **Next.js 14 App Router** | Server Components мінімізують клієнтський JS-bundle. SSR/SSG забезпечує кращу SEO та продуктивність. |
| **Vercel як PaaS** | Zero-config деплой для Next.js. Edge Network гарантує глобальний CDN без налаштувань інфраструктури. |
| **TypeScript** | Повне покриття типами як у backend (Strapi), так і у frontend (Next.js). Зменшує runtime-помилки. |
| **Monorepo структура** | `/backend` та `/frontend` в одному репозиторії. Спрощує управління версіями та локальну розробку. |
| **REST API з Bearer токеном** | Stateless авторизація між Next.js та Strapi. `NEXT_PUBLIC_STRAPI_API_TOKEN` передається у заголовку кожного запиту. |

---

##  Структура проекту

```
next_strapi_cms/
├── backend/                    # Strapi CMS Backend
│   ├── config/                 # Конфігурація (database, server, middlewares)
│   ├── src/
│   │   ├── api/                # Content Types: контролери, роути, сервіси
│   │   ├── components/         # Reusable Strapi components
│   │   └── extensions/         # Розширення Strapi plugins
│   ├── public/                 # Статичні файли Strapi
│   └── package.json
│
├── frontend/                   # Next.js 14 Frontend
│   ├── app/                    # App Router: layout, pages, routes
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Головна сторінка
│   │   └── [...routes]/        # Динамічні маршрути
│   ├── components/             # Reusable React компоненти
│   ├── lib/                    # Утиліти: Strapi API client, helpers
│   ├── public/                 # Статичні ресурси
│   └── package.json
│
└── docs/                       # Документація та діаграми
    ├── c4_level1_context.puml
    ├── c4_level2_container.puml
    ├── c4_level3_strapi_components.puml
    └── c4_level3_nextjs_components.puml
```

---

##  Інструкція з запуску

### Вимоги

- Node.js >= 18.x
- npm >= 9.x або yarn >= 1.22.x

### 1. Клонування репозиторію

```bash
git clone https://github.com/IemonJuice/next_strapi_cms.git
cd next_strapi_cms
```

### 2. Запуск Backend (Strapi)

```bash
cd backend
npm install         # або yarn
cp .env.example .env   # налаштуйте змінні середовища
npm run develop     # або yarn develop
```

Strapi буде доступний на: `http://localhost:1337`
Admin Panel: `http://localhost:1337/admin`

При першому запуску необхідно створити адміністратора через Admin Panel.

**Змінні середовища backend (`.env`):**
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
JWT_SECRET=your-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-salt
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### 3. Отримання API токена

1. Відкрийте Strapi Admin Panel → `Settings` → `API Tokens`
2. Натисніть `Create new API Token`
3. Тип: `Read-only`, Duration: `Unlimited`
4. Скопіюйте згенерований токен

### 4. Запуск Frontend (Next.js)

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
```

**Змінні середовища frontend (`.env.local`):**
```env
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your-api-token-from-step-3
```

```bash
npm run dev
```

Next.js буде доступний на: `http://localhost:3000`

### 5. Запуск обох сервісів одночасно (опціонально)

З кореневої директорії (якщо встановлено `concurrently`):
```bash
npm install
npm run dev
```

---

##  Деплой на Vercel

Фронтенд автоматично деплоїться на Vercel при push у гілку `main`.

**Налаштування на Vercel:**
1. Підключіть репозиторій до Vercel
2. `Root Directory`: встановіть `frontend`
3. Додайте Environment Variables:
   - `NEXT_PUBLIC_STRAPI_API_URL` — URL вашого Strapi (prod)
   - `NEXT_PUBLIC_STRAPI_API_TOKEN` — API токен

---

## C4 Model Діаграми

Діаграми розташовані у директорії `/docs` у форматі PlantUML (`.puml`).

Для рендерингу діаграм:
- **Online:** [PlantUML Online Server](https://www.plantuml.com/plantuml/uml/)
- **VS Code:** розширення [PlantUML](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml)
- **IntelliJ IDEA:** вбудована підтримка PlantUML

| Файл | Рівень | Опис |
|------|--------|------|
| `c4_level1_context.puml` | Level 1 — System Context | Загальний контекст системи та зовнішні актори |
| `c4_level2_container.puml` | Level 2 — Container | Контейнери: Next.js, Strapi, SQLite, Media Storage |
| `c4_level3_strapi_components.puml` | Level 3 — Components (Strapi) | Внутрішня структура Strapi Backend |
| `c4_level3_nextjs_components.puml` | Level 3 — Components (Next.js) | Внутрішня структура Next.js Frontend |

---

## 🛠 Технологічний стек

| Категорія | Технологія | Версія |
|-----------|-----------|--------|
| CMS Backend | Strapi | v5.x |
| Runtime | Node.js | >= 18.x |
| Frontend Framework | Next.js | 14.x |
| UI Library | React | 18.x |
| Мова | TypeScript | 5.x |
| Стилізація | CSS Modules | — |
| База даних (dev) | SQLite | — |
| Хостинг | Vercel | — |
| Репозиторій | GitHub | — |

---

## Ліцензія

MIT License
