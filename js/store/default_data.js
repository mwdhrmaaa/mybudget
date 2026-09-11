/**
 * Default telemetry financial dataset for initial load.
 */
export const DEFAULT_EXPENSES = [
    {
        id: "exp-101",
        amount: 35000,
        description: "Makan Siang Nasi Padang",
        category: "Makanan & Minuman",
        expenseDate: new Date(Date.now() - 0 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    },
    {
        id: "exp-102",
        amount: 50000,
        description: "Isi Bensin Pertamax",
        category: "Transportasi",
        expenseDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    },
    {
        id: "exp-103",
        amount: 250000,
        description: "Langganan Internet Fiber",
        category: "Tagihan & Utilitas",
        expenseDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    },
    {
        id: "exp-104",
        amount: 125000,
        description: "Buku Rekayasa Perangkat Lunak",
        category: "Pendidikan & Buku",
        expenseDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    },
    {
        id: "exp-105",
        amount: 85000,
        description: "Belanja Kebutuhan Dapur",
        category: "Belanja & Logistik",
        expenseDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    }
];

export const DEFAULT_BUDGETS = [
    {
        id: "bud-201",
        amount: 2500000,
        period: "monthly",
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
        description: "Pagu Operasional Bulanan"
    },
    {
        id: "bud-202",
        amount: 500000,
        period: "weekly",
        startDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        description: "Pagu Konsumsi Mingguan"
    }
];
