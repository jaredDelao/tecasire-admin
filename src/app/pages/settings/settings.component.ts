import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  idxTab: number = 0;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idxTab = params?.['tab'] || 0;
    });
  }

  changeIndex(idx: number): void {
    this.router.navigate([], {
      queryParams: { tab: idx },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }
}
