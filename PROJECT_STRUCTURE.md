# Wealth Management Application - Project Structure

## Monorepo Structure
```
wealth-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── routes/
│   │   │   └── authRoutes.ts
│   │   ├── utils/
│   │   │   ├── prisma.ts
│   │   │   └── jwtUtils.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── SectionCard.tsx
    │   │   ├── InputField.tsx
    │   │   └── Button.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Account.tsx
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   └── useWealth.ts
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.tsx
    │   └── index.tsx
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── tsconfig.json
```

## Technology Stack
- **Backend**: Node.js (Express) with TypeScript, Prisma ORM (PostgreSQL), JWT, bcrypt
- **Frontend**: React with TypeScript, Tailwind CSS for styling
- **Database**: PostgreSQL (via Prisma)