# Monthly Salary Management - Modular Structure

## Overview
The Monthly Salary Management feature has been refactored into a clean, modular architecture for better maintainability and scalability.

## File Structure

```
src/
├── features/
│   └── montly-salary-management/
│       ├── components/
│       │   ├── SalarySheetTable.tsx       # Displays salary sheet data
│       │   ├── BankTransferTable.tsx      # Displays bank transfer data
│       │   ├── TaxDeductionTable.tsx      # Displays tax deduction data
│       │   └── index.ts                   # Barrel exports
│       └── types.ts                       # Shared TypeScript interfaces
└── pages/
    └── salaryTransfer.tsx                 # Main page component
```

## Components

### 1. SalarySheetTable
- **Purpose**: Displays detailed salary breakdown for employees
- **Key Features**:
  - Combined LWF column (Hrs of Leave/Casual Leave/Annual Leave)
  - Removed "Working Days" column
  - Color-coded headers matching specification
  - Horizontally scrollable for wide data
  - **Editable Fields** (User Input):
    - ✏️ **Attendance**: Number input for days attended
    - ✏️ **LWF**: Text input for leave format (e.g., "16/2/0")
    - ✏️ **Arrear**: Number input for arrear amount
    - ✏️ **Deduction of Tax**: Number input for income tax deduction
    - ✏️ **Advances Deduction**: Number input for other deductions
  - Real-time state management with change callbacks

### 2. BankTransferTable
- **Purpose**: Shows bank transfer details for salary payments
- **Features**: Account details, IFSC codes, transfer amounts, status badges

### 3. TaxDeductionTable
- **Purpose**: Displays tax deduction information
- **Features**: PAN numbers, gross salary, taxable income, TDS amounts

## Types (types.ts)
Centralized type definitions:
- `SalarySheetData`
- `BankTransferData`
- `TaxDeductionData`
- `FileType`

## Main Page (salaryTransfer.tsx)

### Filters (Right-aligned, Compact)
1. **Year Selector**: 
   - Current year (marked as "Current")
   - Next year (+1)
   - Previous 2 years (-2, -1)
   
2. **Month Selector**: 
   - All 12 months

3. **File Type Selector**:
   - Salary Sheet
   - Bank Transfer
   - Tax Deduction

### Layout
- Title on the left
- Filters stacked horizontally on the right (responsive)
- Conditional table rendering based on selected file type

## Key Changes from Previous Version

1. ✅ **Modular Structure**: Separated into reusable components
2. ✅ **LWF Column**: Combined into single column (format: "Hrs/Casual/Annual")
3. ✅ **Removed Working Days**: Column eliminated as requested
4. ✅ **Year Selector**: Dynamic year generation (current + 1 future + 2 past)
5. ✅ **Compact Dropdowns**: Smaller size with `size="small"`
6. ✅ **Right-aligned Filters**: Moved to right side using flexbox
7. ✅ **Clean Imports**: Barrel exports for better import statements

## Usage Example

```typescript
import { SalarySheetTable } from "@/features/montly-salary-management/components";
import type { SalarySheetData } from "@/features/montly-salary-management/types";

const data: SalarySheetData[] = [...];

<SalarySheetTable data={data} />
```

## Future Enhancements
- Add API integration for dynamic data fetching
- Implement export functionality (Excel, PDF)
- Add pagination for large datasets
- Include search and filter capabilities within tables
- Add print-friendly views
