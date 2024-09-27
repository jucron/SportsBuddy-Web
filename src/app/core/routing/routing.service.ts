import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router
  ) { }

  redirectTo(uri:string, hideLocation: boolean) {
    this.router.navigate([uri], {skipLocationChange: hideLocation, replaceUrl: true})
      .then(() => {
        // Handle success if needed, or leave this empty
      })
      .catch(err => {
        // Handle navigation error if needed
        console.error('Navigation error:', err);
      });
  }
  navigateWithParam(uri:string, hideLocation: boolean, param: string){
    this.router.navigate([uri, param], {skipLocationChange: hideLocation, replaceUrl: true})
      .then(() => {
        // Handle success if needed, or leave this empty
      })
      .catch(err => {
        // Handle navigation error if needed
        console.error('Navigation error:', err);
      });
  }
  reloadPage() {
    this.router.navigate([this.router.url]).then(() => {
      window.location.reload();
    });
  }
}
