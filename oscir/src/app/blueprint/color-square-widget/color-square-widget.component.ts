import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-color-square-widget',
  templateUrl: './color-square-widget.component.html',
  styleUrls: ['./color-square-widget.component.scss']
})


export class ColorSquareComponent implements OnInit {


  constructor( ) { } 


  ngOnInit() {

  }

  getStyle() {
    
    if(!this.backgroundColor) return '';

    if(!this.backgroundColor.startsWith('#')) this.backgroundColor = '#'+this.backgroundColor;

    var style = {
      'background-color': this.backgroundColor
    };

    if(this.size && this.size>0)
    {
      style['width'] = this.size + 'px';
      style['height'] = this.size + 'px';
    }

    return style;
  }

  @Input() backgroundColor: string;

  @Input() size: number;


}
