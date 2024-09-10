export default function useDate() {
  const date = new Date();

  const currentMonth = date.getMonth() + 1; // starts from 1 (e.g. January - 1)

  const currentMonthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);

  const currentYear = date.getUTCFullYear();

  return { currentMonth, currentMonthName, currentYear };
}
