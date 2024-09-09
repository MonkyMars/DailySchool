export function getWeek(date) {
    const currentDate = new Date(date.getTime());
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const dayOfYear = Math.floor(
      (currentDate - startOfYear) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
    return weekNumber;
}