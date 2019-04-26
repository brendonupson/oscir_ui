/*
import { Edge } from '@swimlane/ngx-charts/lib/models/edge.model';
import { Node, ClusterNode } from '@swimlane/ngx-charts/lib/models/node.model';
*/
//FIXME This should use the same classes @swimlane use

export interface NgxMap {
    links: NgxMapLink[];
    nodes: NgxMapNode[];
}

export interface NgxMapLink {
    source: string;
    target: string;
    label: string;
}

export interface NgxNodePosition {
    x: number;
    y: number;
  }
  
  export interface NgxNodeDimension {
    width: number;
    height: number;
  }
  
  export interface NgxMapNode {
    id: string;
    position?: NgxNodePosition;
    dimension?: NgxNodeDimension;
    transform?: string;
    tooltipTitle?: string;
    label?: string;
    data?: any;
    meta?: any;
  }
