export class DateUtils {
  static getCombinedDateTime(date: Date, time: string): Date | null {
    if (date && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(hours, minutes);
      return combinedDateTime;
    }
    return null;
  }
}
