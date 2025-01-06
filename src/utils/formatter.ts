export function formatToLongDate(dateStr: string) {
  if (!dateStr && dateStr.length <= 0) return "Invalid Date";
  const date = new Date(dateStr);
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
  }).format(date);
  return formattedDate;
}

export function formatToMediumDate(dateStr: string) {
  if (!dateStr && dateStr.length <= 0) return "Invalid Date";
  const date = new Date(dateStr);
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
  return formattedDate;
}

export function calculateLeaveDays(start: string, end: string): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMilliseconds = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.round(diffMilliseconds / oneDay) + 1;
  return diffDays;
}

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function formatTime(dateString: string) {
  const date = new Date(dateString);

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, "0");

  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

export function convertTo12HourFormat(time: any) {
  // If time is not valid (null or undefined), return 'N/A'
  if (!time || time === "null") return "N/A";

  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  return `${hour}:${minutes} ${ampm}`;
}
