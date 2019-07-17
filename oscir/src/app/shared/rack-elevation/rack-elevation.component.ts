import { Component, Input, OnInit } from '@angular/core';

//import { ClassProperty } from '../../core/models/class.model';


@Component({
  selector: 'rack-elevation',
  templateUrl: './rack-elevation.component.html',
  styleUrls: ['./rack-elevation.component.scss']
})
export class RackElevationComponent implements OnInit {

    ruList = [];
    freeSlots: number = 0;
    totalKW: number = 0;
    totalBTUhr: number = 0;

  ngOnInit(): void {    
    //debugger;
    this.ruList = Array(this.rackUnits).fill(1).map((x,i)=>i+1).reverse();    
  }

  recalcStats() //ngAfterViewInit()
  {    
    var ruCount = 0; 
    this.totalKW = 0;
    this.totalBTUhr = 0;
    this.rackItems.forEach(element => {        
        ruCount += element.rackUnits;
        this.totalKW += element.powerkW;
        this.totalBTUhr += element.btuPerHour;
    });
        
    this.freeSlots = this.rackUnits - ruCount; 
    
  }

  getItemStyle(rackItem: RackElevationItem)
  {
      this.recalcStats();

    var slotHeight = 20;
    var itemHeight = (rackItem.rackUnits*slotHeight);    
    var bottomOfSlot1 = (this.rackUnits * slotHeight) + 10;
    var topOffset = bottomOfSlot1 - itemHeight; //bottom aligned with bottom of slot 1


    topOffset -= ((rackItem.startSlot-1) * slotHeight);


    return {
        'top': topOffset + 'px',
        'height': (rackItem.rackUnits*slotHeight) + 'px',
        'line-height': (itemHeight-5) +'px'};
  }


  @Input() rackUnits: number;
  @Input() rackName: string;
  @Input() rackItems: RackElevationItem[];
  /*
  @Input()
  set rackItems(inRackItems: RackElevationItem[]) {
    //debugger;

    var ruCount = this.rackItems.reduce((x, item) => item.rackUnits, 0);

    this.freeSlots = this.rackUnits - ruCount; //FIXME count RUs in rackItems
    this.totalKW = this.rackItems.length; //FIXME sum KW in rackItems
    this.totalBTUhr = this.rackItems.length; //FIXME sum BTU/hr in rackItems
  }*/

}

class RackElevationItem {
    startSlot: number;
    rackUnits: number;
    label: string;
    color: string;
    btuPerHour: number;
    powerkW: number;
}
