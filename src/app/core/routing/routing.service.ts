import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute
              ) { }

  redirectTo(uri:string, hideLocation: boolean){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([uri], {skipLocationChange: hideLocation}));
  }
  getActivatedRoute(){
    return this.activatedRoute;
  }
}
