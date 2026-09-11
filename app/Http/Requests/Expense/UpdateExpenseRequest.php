<?php

namespace App\Http\Requests\Expense;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['required', 'numeric', 'min:0.01', 'max:999999999999.99'],
            'description' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:100'],
            'expense_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Nominal pengeluaran wajib diisi.',
            'amount.numeric' => 'Nominal harus berupa angka valid.',
            'description.required' => 'Keterangan pengeluaran wajib diisi.',
            'category.required' => 'Kategori pengeluaran wajib dipilih.',
            'expense_date.required' => 'Tanggal pengeluaran wajib diisi.',
        ];
    }
}
