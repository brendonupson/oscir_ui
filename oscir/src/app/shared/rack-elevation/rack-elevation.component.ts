import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';


@Component({
  selector: 'rack-elevation',
  templateUrl: './rack-elevation.component.html',
  styleUrls: ['./rack-elevation.component.scss']
})
export class RackElevationComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ruList = [];
  freeSlots: number = 0;
  totalKW: number = 0;
  totalBTUhr: number = 0;

  ngOnInit(): void {
    //debugger;
    this.ruList = Array(this.rackUnits).fill(1).map((x, i) => i + 1).reverse();
    this.recalcStats();
  }

  recalcStats() //ngAfterViewInit()
  {
    var ruCount = 0;
    this.totalKW = 0;
    this.totalBTUhr = 0;
    if(this.rackItems)
    {
      this.rackItems.forEach(element => {
        ruCount += element.rackUnits;
        this.totalKW += element.powerkW;
        this.totalBTUhr += element.btuPerHour;
      });
    }

    this.freeSlots = this.rackUnits - ruCount;

  }

  getItemStyle(rackItem: RackElevationItem) {
    this.recalcStats();

    var slotHeight = 20;
    var itemHeight = (rackItem.rackUnits * slotHeight);
    var bottomOfSlot1 = (this.rackUnits * slotHeight) + (10+26);
    var topOffset = bottomOfSlot1 - itemHeight; //bottom aligned with bottom of slot 1
    topOffset -= ((rackItem.startSlot - 1) * slotHeight);

    var cursor = 'default';
    if (this.hasUrl(rackItem)) cursor = 'pointer';

    return {
      'top': topOffset + 'px',
      'height': (rackItem.rackUnits * slotHeight) + 'px',
      'line-height': (itemHeight - 5) + 'px',
      'cursor': cursor
    };
  }

  doOpenLink(rackItem: RackElevationItem) {
    if (!this.hasUrl(rackItem)) return;

    if (rackItem.urlTarget == '_blank')
      window.open(rackItem.url, rackItem.urlTarget);
    else
      this.router.navigate([rackItem.url]);
    //this.router.navigate(['../' + data.id], { relativeTo: this.route });
  }

  hasUrl(rackItem: RackElevationItem) {
    if (!rackItem.url || rackItem.url == '') return false;
    return true;
  }


  @Input() rackUnits: number;
  @Input() rackName: string;
  @Input() rackItems: RackElevationItem[];

}

class RackElevationItem {
  startSlot: number;
  rackUnits: number;
  label: string;
  toolTip: string;
  color: string;
  url: string;
  urlTarget: string;
  btuPerHour: number;
  powerkW: number;
}
