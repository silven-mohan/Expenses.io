# ExpenseLedger

A premium personal finance ledger application built with Next.js, TypeScript, and Dexie.js for offline-first expense tracking.

## Features

- 📊 **Expense Tracking** - Organize expenses by categories with detailed notes
- 💰 **Debt Management** - Track money you lent and borrowed
- 📈 **Advanced Analytics** - Beautiful charts and graphs for spending analysis
- 📄 **Report Generation** - Export reports as PDF or CSV
- 🔐 **Offline First** - Works completely offline with local database
- 💾 **Backup & Restore** - Full data backup and restore functionality
- 🌙 **Dark Mode** - Beautiful dark mode support
- 📱 **PWA** - Progressive Web App for mobile-like experience
- 🌍 **Multi-currency** - Support for multiple currencies

## Tech Stack

- **Framework**: Next.js 15.1 with TypeScript
- **Database**: Dexie.js (IndexedDB)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Export**: PDF (pdf-lib), CSV (papaparse)
- **UI**: Custom components with Radix UI primitives
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/silven-mohan/Expenses.io.git
cd Expenses.io

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main app layout
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── analytics/
│   │   ├── debt/
│   │   └── reports/
│   └── layout.tsx
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── Sidebar.tsx
│   └── MobileNav.tsx
├── db/                    # Database setup
│   └── index.ts          # Dexie instance
├── hooks/                 # Custom React hooks
├── services/             # Business logic
│   ├── categoryService.ts
│   ├── expenseService.ts
│   ├── lentService.ts
│   ├── borrowedService.ts
│   ├── reportService.ts
│   ├── pdfService.ts
│   └── csvService.ts
├── stores/               # State management
│   ├── appStore.ts       # Zustand store
│   └── uiStore.ts
├── types/                # TypeScript types
└── utils/                # Utility functions
    ├── dateUtils.ts
    ├── helpers.ts
    ├── validation.ts
    └── constants.ts
```

## Usage

### Add an Expense

1. Go to **Transactions** page
2. Fill in the category, amount, date, and optional note
3. Click "Add Expense"

### Track Debts

1. Go to **Debt Tracking** page
2. Switch between "Lent" and "Borrowed" tabs
3. Add new transactions by filling the form
4. Mark as settled when the debt is cleared

### View Analytics

1. Go to **Analytics** page
2. See visual representations of your spending
3. View category breakdown, daily trends, etc.

### Generate Reports

1. Go to **Reports** page
2. Navigate to the desired month
3. View summary and category breakdown
4. Export as PDF or CSV

### Backup & Restore

1. Go to **Settings**
2. Click "Download Backup" to save your data
3. Use "Restore from Backup" to import saved data

## Key Features Explained

### Offline First

All data is stored in your browser's IndexedDB. No internet required!

### PWA Support

Install as an app on your phone or desktop for native-like experience.

### Data Export

Export your financial data in PDF or CSV format for further analysis.

### Category Management

Customizable expense categories with color coding.

### Debt Tracking

Track both money lent and borrowed with settlement status.

## API Routes

The application uses Dexie.js for local data storage. No backend API is required.

## Performance

- Optimized bundle size (~200KB gzipped)
- IndexedDB for instant data access
- Lazy loading of routes
- Image optimization
- PWA caching strategy

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please create an issue on GitHub.

## Roadmap

- [ ] Cloud sync support
- [ ] Multi-user support
- [ ] Advanced budgeting features
- [ ] Recurring expenses
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Mobile app (React Native)

---

**ExpenseLedger** - Your personal finance, always at your fingertips
