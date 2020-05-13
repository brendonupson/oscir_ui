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
  maxKW: number = 0; //capacity of smallest PDU
  pduCount: number = 0;
  totalBTUhr: number = 0;

  ngOnInit(): void {
    //debugger;
    this.ruList = Array(this.rack.rackUnits).fill(1).map((x, i) => i + 1).reverse();
    this.recalcStats();
  }

  hasPdus()
  {
    debugger;
    return this.pduCount ? (this.pduCount > 0) : false;
  }


  recalcStats() //ngAfterViewInit()
  {    
    var ruCount = 0;
    this.totalKW = 0;
    this.totalBTUhr = 0;
    this.maxKW = 0;
    this.pduCount = 0;

    if(this.rack.rackItems)
    {
      this.rack.rackItems.forEach(element => {
        ruCount += isNaN(element.rackUnits) ? 0 : element.rackUnits;
        this.totalKW += isNaN(element.powerkW) ? 0 : element.powerkW;
        this.totalBTUhr += isNaN(element.btuPerHour) ? 0 : element.btuPerHour;
      });
    }

    if(this.rack.rackPdus)
    {
      this.pduCount = this.rack.rackPdus.length;
      
      var smallestPdu = this.getSmallestPdu();
      if(smallestPdu!=null)
      {        
        this.maxKW = isNaN(smallestPdu.getMaxWatts()) ? 0 : (smallestPdu.getMaxWatts()/1000);
      }
    }

    this.freeSlots = this.rack.rackUnits - ruCount;

  }

  getSmallestPdu()
  {
    var smallestPdu: RackPduItem = null;
    if(this.rack.rackPdus)
    {      
      this.rack.rackPdus.forEach(pdu => {        
        if(smallestPdu==null) 
          smallestPdu = pdu;
        else
        {
          var smallestKw = smallestPdu.getMaxWatts();
          var thisPduKw = pdu.getMaxWatts();
          if(thisPduKw<smallestKw) smallestPdu = pdu;
        }
      });
    }
    return smallestPdu;
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

  getDisplayMaxKW()
  {
    if(isNaN(this.maxKW)) return '-?-';
    return this.maxKW;
  }

  getDisplayAvailableKW()
  {
    if(isNaN(this.totalKW) || isNaN(this.maxKW) || this.maxKW<=0) return '-?-';
    var available = (this.maxKW - this.totalKW);
    if(available<0) return '-?-';
    return available;
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
  rackPdus: RackPduItem[];
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

export class RackPduItem {
  phase: number = 1; //3 or 1
  volts: number = 240;
  amps: number = 16; //eg 16 or 32
  powerFactor: number = 0.8;

  getMaxWatts()
  {
    return Math.sqrt(this.phase) * this.volts * this.amps * this.powerFactor;
  }
}
