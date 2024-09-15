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
  static getTimeFromDate(date: Date){
    return date.toTimeString().slice(0, 5);
  }
  static getDateLabel(date: Date){
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  static getTimeLabel(date: Date){
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }
  static getTomorrow(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Clear time portion of today's date
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to tomorrow
    return tomorrow;
  }

}
