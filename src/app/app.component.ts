import { AfterViewInit, Component } from '@angular/core';
import * as Feather from 'feather-icons';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(private bnIdle: BnNgIdleService, router: Router) {
    this.bnIdle.startWatching(18000).subscribe((res: any) => {
      if (res) {
        router.navigate(['/login']);
      }
    })
  }

  title = 'POS';
  ngAfterViewInit() {
    Feather.replace();
  }

}
