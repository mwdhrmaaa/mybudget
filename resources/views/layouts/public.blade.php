<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'MyBudget') }} - Enterprise Expense & Budget Platform</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Chart.js for high-fidelity data visualizer -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <style>
        :root {
            --bg-canvas: #090a0d;
            --bg-surface: #111318;
            --bg-surface-elevated: #161922;
            --bg-card: rgba(17, 19, 24, 0.85);
            --border-subtle: rgba(255, 255, 255, 0.08);
            --border-highlight: rgba(255, 255, 255, 0.16);
            --text-primary: #f4f4f6;
            --text-secondary: #9da1b2;
            --text-muted: #5e6272;
            --accent-brand: #3b82f6;
            --accent-brand-hover: #2563eb;
            --accent-brand-glow: rgba(59, 130, 246, 0.25);
            --status-safe: #10b981;
            --status-warning: #f59e0b;
            --status-danger: #ef4444;
            --radius-md: 10px;
            --radius-lg: 16px;
            --radius-xl: 20px;
            --transition-smooth: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        body {
            background-color: var(--bg-canvas);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.5;
            background-image:
                radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.08), transparent 70%),
                radial-gradient(ellipse at 100% 100%, rgba(16, 185, 129, 0.04), transparent 50%);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
            width: 100%;
        }

        /* Top Navigation Header */
        header.site-header {
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: rgba(9, 10, 13, 0.85);
            border-bottom: 1px solid var(--border-subtle);
        }

        .nav-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 68px;
        }

        .brand-logo {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            color: var(--text-primary);
            font-weight: 700;
            font-size: 1.15rem;
            letter-spacing: -0.02em;
        }

        .brand-icon {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            background: linear-gradient(135deg, #2563eb, #3b82f6);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px var(--accent-brand-glow);
            color: #ffffff;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            font-weight: 500;
            text-decoration: none;
            color: var(--text-secondary);
            transition: var(--transition-smooth);
            border: 1px solid transparent;
        }

        .nav-btn:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.04);
            border-color: var(--border-subtle);
        }

        .nav-btn.active {
            color: #ffffff;
            background: var(--bg-surface-elevated);
            border-color: var(--border-highlight);
        }

        .action-btn-primary {
            background: var(--accent-brand);
            color: #ffffff !important;
            font-weight: 600;
            border-color: var(--accent-brand);
        }

        .action-btn-primary:hover {
            background: var(--accent-brand-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 14px var(--accent-brand-glow);
        }

        /* Main Content Wrapper */
        main.main-content {
            flex: 1;
            padding: 2rem 0 3.5rem;
        }

        /* Global Cards & Components */
        .glass-panel {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-lg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            transition: var(--transition-smooth);
        }

        .glass-panel:hover {
            border-color: var(--border-highlight);
        }

        /* Status Toast / Alert */
        .alert-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.875rem 1.25rem;
            border-radius: var(--radius-md);
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            font-weight: 500;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.25);
            color: #34d399;
        }

        .alert-banner-error {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.25);
            color: #f87171;
        }

        /* Buttons & Forms Defaults */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.625rem 1.25rem;
            border-radius: var(--radius-md);
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: 1px solid transparent;
            transition: var(--transition-smooth);
        }

        .btn-primary {
            background: var(--accent-brand);
            color: #ffffff;
        }

        .btn-primary:hover {
            background: var(--accent-brand-hover);
            box-shadow: 0 4px 12px var(--accent-brand-glow);
        }

        .btn-ghost {
            background: transparent;
            border: 1px solid var(--border-subtle);
            color: var(--text-secondary);
        }

        .btn-ghost:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: var(--border-highlight);
            color: var(--text-primary);
        }

        .btn-danger-ghost {
            background: transparent;
            border: 1px solid rgba(239, 68, 68, 0.2);
            color: #f87171;
        }

        .btn-danger-ghost:hover {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.4);
            color: #ef4444;
        }

        /* Footer */
        footer.site-footer {
            border-top: 1px solid var(--border-subtle);
            padding: 1.75rem 0;
            color: var(--text-muted);
            font-size: 0.8125rem;
            background: rgba(9, 10, 13, 0.95);
        }

        .footer-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.25rem 0.65rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.02em;
        }

        .badge-safe {
            background: rgba(16, 185, 129, 0.12);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .badge-warning {
            background: rgba(245, 158, 11, 0.12);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .badge-danger {
            background: rgba(239, 68, 68, 0.12);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.25);
        }

        @media (max-width: 768px) {
            .footer-content {
                flex-direction: column;
                gap: 0.75rem;
                text-align: center;
            }
            .nav-links {
                gap: 0.25rem;
            }
        }
    </style>

    @yield('styles')
</head>
<body>
    <header class="site-header">
        <div class="container nav-wrapper">
            <a href="{{ route('public.expense.index') }}" class="brand-logo">
                <div class="brand-icon">
                    <i data-lucide="wallet-cards" style="width: 18px; height: 18px;"></i>
                </div>
                <span>MyBudget</span>
            </a>

            <nav class="nav-links">
                <a href="{{ route('public.expense.index') }}" class="nav-btn {{ request()->routeIs('public.expense.index') ? 'active' : '' }}">
                    <i data-lucide="layout-dashboard" style="width: 16px; height: 16px;"></i>
                    <span>Dashboard</span>
                </a>
                <a href="{{ route('public.finance.budget.index') }}" class="nav-btn {{ request()->routeIs('public.finance.budget.*') ? 'active' : '' }}">
                    <i data-lucide="pie-chart" style="width: 16px; height: 16px;"></i>
                    <span>Anggaran</span>
                </a>
                <a href="{{ route('public.expense.create') }}" class="nav-btn action-btn-primary">
                    <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
                    <span>Catat Transaksi</span>
                </a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            @if(session('success'))
                <div class="alert-banner">
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <i data-lucide="check-circle-2" style="width: 18px; height: 18px;"></i>
                        <span>{{ session('success') }}</span>
                    </div>
                    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:inherit; cursor:pointer;">
                        <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            @endif

            @if($errors->any())
                <div class="alert-banner alert-banner-error">
                    <div style="display: flex; align-items: flex-start; gap: 0.65rem;">
                        <i data-lucide="alert-triangle" style="width: 18px; height: 18px; margin-top: 2px;"></i>
                        <div>
                            <div style="font-weight: 600; margin-bottom: 0.25rem;">Validasi Input Gagal:</div>
                            <ul style="padding-left: 1.25rem; font-size: 0.85rem;">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:inherit; cursor:pointer;">
                        <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                    </button>
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    <footer class="site-footer">
        <div class="container footer-content">
            <p>&copy; {{ date('Y') }} MyBudget. Financial Telemetry & Expense Analytics.</p>
            <p style="color: var(--text-muted); font-size: 0.75rem;">Engineered with Semantic Atomic Architecture.</p>
        </div>
    </footer>

    <script>
        lucide.createIcons();
    </script>
    @yield('scripts')
</body>
</html>
