export function getDaysInSelectedMonth(selectedMonth: string, selectedYear: string | number): number {
    const monthNumber = Number(selectedMonth);
    if (!Number.isFinite(monthNumber) || monthNumber < 1 || monthNumber > 12) return 30;

    const parsedYear = Number(selectedYear);
    const currentYear = new Date().getFullYear();
    const effectiveYear =
        Number.isFinite(parsedYear) && parsedYear >= 1900 && parsedYear <= 9999
            ? parsedYear
            : currentYear;

    return new Date(effectiveYear, monthNumber, 0).getDate();
}
