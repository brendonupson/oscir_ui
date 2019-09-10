import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Edge, Node } from '@swimlane/ngx-graph';


@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  constructor(  ) { }


  ngOnInit(): void {    
  }

  selectMapNode(mapNodeEvent)
  {    
    this.onClick.emit(mapNodeEvent);
  }

  doMapRightClick($event, id)
  {
    $event.stopPropagation();
    $event.preventDefault();
    this.onRightClick.emit(id);    
  }

  @Input() width: number;
  @Input() height: number;

  @Input() nodeData: Node[];
  @Input() linkData: Edge[];

  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() onRightClick: EventEmitter<any> = new EventEmitter();
  

}
