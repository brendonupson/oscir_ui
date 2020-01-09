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
    this.ruList = Array(this.rack.rackUnits).fill(1).map((x, i) => i + 1).reverse();
    this.recalcStats();
  }

  recalcStats() //ngAfterViewInit()
  {    
    var ruCount = 0;
    this.totalKW = 0;
    this.totalBTUhr = 0;
    if(this.rack.rackItems)
    {
      this.rack.rackItems.forEach(element => {
        ruCount += isNaN(element.rackUnits) ? 0 : element.rackUnits;
        this.totalKW += isNaN(element.powerkW) ? 0 : element.powerkW;
        this.totalBTUhr += isNaN(element.btuPerHour) ? 0 : element.btuPerHour;
      });
    }

    this.freeSlots = this.rack.rackUnits - ruCount;

  }

  getItemStyle(rackItem: RackElevationItem) {
    this.recalcStats();
    
    var slotHeight = 20;
    var itemHeight = (rackItem.rackUnits * slotHeight);
    var bottomOfSlot1 = (this.rack.rackUnits * slotHeight);//(10+26);
    var topOffset = bottomOfSlot1 - itemHeight; //bottom aligned with bottom of slot 1
    topOffset -= ((rackItem.startSlot - 1) * slotHeight);

    var cursor = 'default';
    if (this.hasUrl(rackItem)) cursor = 'pointer';

    var style = {
      'top': topOffset + 'px',
      'height': (rackItem.rackUnits * slotHeight) + 'px',
      'line-height': (itemHeight - 5) + 'px',
      'cursor': cursor
    };

    if(rackItem.color && rackItem.color.length>2)
    {
      var color = rackItem.color;
      if(!color.startsWith('#')) color = '#'+color;
      style['background-color'] = color; 
    }

    //if there is missing power details
    if(isNaN(rackItem.powerkW) || isNaN(rackItem.btuPerHour))
    {
      style['border'] = '2px dashed #00c'; 
    }

    return style;
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

  getDisplayTotalKW()
  {
    if(isNaN(this.totalKW)) return '-?-';
    return this.totalKW;
  }

  getDisplayTotalBTUhr()
  {
    if(isNaN(this.totalBTUhr)) return '-?-';
    return this.totalBTUhr;
  }

  @Input() rack: RackElevation;
/*
  @Input() rackUnits: number;
  @Input() rackName: string;
  @Input() rackItems: RackElevationItem[];
*/
}

export class RackElevation{
  rackName: string;
  url: string;
  rackUnits: number;
  rackItems: RackElevationItem[];
}

export class RackElevationItem {
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
