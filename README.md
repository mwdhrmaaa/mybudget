# Daily Expense Tracker

A premium, state-of-the-art daily expense tracking application built with **Laravel**. This project follows a **Universal Monolith Architecture** with a **Scope-First, Domain-Second** pattern, ensuring scalability and structural predictability.

## 🚀 Features

- **Daily Expense Logging**: Track your spending with ease.
- **Categorization**: Group expenses by category (Food, Transport, Entertainment, etc.).
- **Premium UI**: Modern, responsive design with vibrant aesthetics and smooth transitions.
- **Detailed Summary**: View daily and monthly spending summaries (Coming soon).

## 🛠 Tech Stack

- **Backend**: Laravel 11.x
- **Frontend**: Vanilla CSS & JavaScript
- **Database**: MySQL/SQLite

## 📂 Architecture

This project strictly adheres to the following standards:
- **Controllers**: Organized by Access Scope (e.g., `Public`, `Admin`).
- **Views**: Mirroring the Controller structure.
- **Routing**: Clean Route Protocol (One-Line Rule, No Closures, Strict Grouping).

## 📥 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   composer install
   npm install
   ```
3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Run migrations:
   ```bash
   php artisan migrate
   ```
5. Compile assets:
   ```bash
   npm run dev
   ```

## 📝 Standards

We follow strict naming conventions and directory structures as defined in our internal standard. No flat structures or closure-based routing allowed.

---
Built with ❤️ by [Antigravity](https://github.com/google-deepmind/antigravity)
