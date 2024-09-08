export class UrlHelper {
  static getLastElementFromUrl(url: string): string {
    return url.split('/').pop()!;
  }
}
