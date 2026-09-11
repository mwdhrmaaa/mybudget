import { test } from "node:test";
import assert from "node:assert";
import { generateTransactionsCSV } from "../js/domain/csv_export.js";

test("generateTransactionsCSV formats headers and handles quotes properly", () => {
    const records = [
        {
            id: "exp-1",
            expenseDate: "2026-09-10",
            type: "income",
            category: "Investasi & Tabungan",
            description: 'Dividen "Saham" Q3',
            amount: 1500000
        },
        {
            id: "exp-2",
            expenseDate: "2026-09-11",
            type: "expense",
            category: "Makanan & Minuman",
            description: "Makan Siang",
            amount: 45000
        }
    ];

    const csv = generateTransactionsCSV(records);
    const lines = csv.split("\r\n");

    assert.strictEqual(lines.length, 3);
    assert.strictEqual(lines[0], "ID,Tanggal,Tipe,Kategori,Keterangan,Nominal (IDR)");
    assert.ok(lines[1].includes('"Dividen ""Saham"" Q3"'));
    assert.ok(lines[1].includes('"Pemasukan"'));
    assert.ok(lines[2].includes('"Pengeluaran"'));
    assert.ok(lines[2].includes("45000"));
});
