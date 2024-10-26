import { Component, OnInit } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-trip-analysis-container',
  templateUrl: './trip-analysis-container.component.html',
  styleUrls: ['./trip-analysis-container.component.scss'],
})
export class TripAnalysisContainerComponent implements OnInit {
  showRightPanel$!: Observable<boolean>;

  constructor(
    private readonly uiStateService: UiStateService,
    private readonly menuCtrl: MenuController,
  ) {
  }

  ngOnInit(): void {
    this.showRightPanel$ = this.uiStateService.showRightPanel();

    this.uiStateService.showRightMenu()
      .subscribe((i ) => {
        if(i){
          this.menuCtrl.open('trip-content').then();
        } else{
          this.menuCtrl.close('trip-content').then();
        }
      });
  }

  toggleRightMenu(): void {
    this.uiStateService.toggleRightMenu();
  }
}
