# Salary File API Integration

## Overview
The salary management system now integrates with the backend API at `/SalaryGenerate/salary-master` to dynamically fetch and manage salary files.

## Files Created

### 1. API Layer (`/src/api/salary/salary-file-api.ts`)

**Endpoints:**
- `getSalaryFiles()` - Fetches all salary files
- `getSalaryFilesByDate(month, year)` - Fetches files filtered by month/year  
- `generateSalaryFile(payload)` - Creates a new salary file
- `downloadSalaryFile(fileId)` - Downloads a specific file

**Types Defined:**
```typescript
interface SalaryFile {
  id: number;
  fileName: string;
  fileType: string;
  generatedDate: string;
  month: number;
  year: number;
  status: string;
}

interface GenerateSalaryFilePayload {
  month: number;
  year: number;
  fileType: string;
  selectedEmployeeIds?: number[];
}
```

### 2. React Hooks (`/src/features/montly-salary-management/hooks/useGetSalaryFile.ts`)

**Hooks:**
- `useSalaryFiles(month?, year?)` - Query hook to fetch files
- `useGenerateSalaryFile()` - Mutation hook to generate files
- `useDownloadSalaryFile()` - Mutation hook to download files

**Features:**
- Automatic caching with TanStack Query
- Cache invalidation on file generation
- Automatic file download handling

### 3. Updated Page (`/src/pages/salaryTransfer.tsx`)

**Changes:**
- Import API hooks
- Changed state from `selectedFile` to `selectedFileId`
- Added `selectedEmployeeIds` for checkbox selection
- Integrated `useSalaryFiles` hook with month/year filters
- Added `useGenerateSalaryFile` mutation

## Usage Flow

### 1. Fetching Files
```typescript
// Fetch all files
const { data, isLoading, error } = useSalaryFiles();

// Fetch filtered by month and year
const { data } = useSalaryFiles(1, 2026); // January 2026
```

### 2. Generating Files
```typescript
const mutation = useGenerateSalaryFile();

mutation.mutate({
  month: 1,
  year: 2026,
  fileType: "salary-sheet",
  selectedEmployeeIds: [1, 2, 3]
});
```

### 3. Downloading Files
```typescript
const downloadMutation = useDownloadSalaryFile();
downloadMutation.mutate(fileId);
```

## Integration Steps Remaining

1. **Update File Dropdown:**
   - Replace static file type dropdown with dynamic file dropdown
   - Show files from API: `filesData?.data?.map(file => ...)`
   - Display file name, type, and date

2. **Add Generate Button:**
   - Button to generate new salary file
   - Validation for month, year, file type
   - Use `generateFileMutation.mutate()`

3. **Handle Selected Employees:**
   - Capture selected employee IDs from table checkboxes
   - Pass to generation payload via callback

4. **Loading/Error States:**
   - Show loading spinner while fetching files
   - Display error messages if API fails
   - Show success/error toasts after generation

## Example Implementation

```tsx
// File dropdown with API data
<Select
  label="Select File"
  value={selectedFileId}
  onChange={(e) => setSelectedFileId(e.target.value)}
>
  {isLoadingFiles && <MenuItem disabled>Loading...</MenuItem>}
  {filesData?.data?.map((file) => (
    <MenuItem key={file.id} value={file.id}>
      {file.fileName} - {file.fileType} ({file.month}/{file.year})
    </MenuItem>
  ))}
</Select>

// Generate button
<Button
  onClick={() => {
    generateFileMutation.mutate({
      month: parseInt(selectedMonth),
      year: selectedYear,
      fileType: "salary-sheet",
      selectedEmployeeIds: selectedEmployeeIds
    });
  }}
  disabled={generateFileMutation.isPending}
>
  {generateFileMutation.isPending ? "Generating..." : "Generate File"}
</Button>
```

## API Response Structure

**Expected Response from `/SalaryGenerate/salary-master` (POST):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fileName": "Salary_Jan_2026.xlsx",
      "fileType": "salary-sheet",
      "generatedDate": "2026-01-02",
      "month": 1,
      "year": 2026,
      "status": "completed"
    }
  ]
}
```

## Next Steps

1. Complete UI integration in `salaryTransfer.tsx`
2. Add error handling and toast notifications
3. Test API endpoints with actual backend
4. Add file download functionality to UI
5. Implement employee selection callback from table
