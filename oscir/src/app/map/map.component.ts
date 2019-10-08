import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService, ConfigItemService, Class, ClassService } from '../core';


import { FormGroup, FormControl } from '@angular/forms';

import { NgxMap } from '../core/models/ngxMap.model';
import { ConfigItemMap } from '../configitem/configitem-map';
import { ConfigItemSharedFunctions } from '../configitem/configitem-shared-functions';


@Component({
  selector: 'map-component',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  
  constructor(
    private router: Router,    
    private userService: UserService,
    private configItemService: ConfigItemService,
    private classService: ClassService,
    private route: ActivatedRoute
  ) {}

  configitemMap: ConfigItemMap;
  displayMap: NgxMap = { nodes: [], links: [] };
  route$: Subscription;
  classes: Class[];
  configItemIds: string[];
  nodeSub$: Subscription;
  linkSub$: Subscription;

  ngOnInit() {   
    //subscribe url
    
    this.route$ = this.route.params.subscribe(
      (params) => {
        var id = params['id'];//this.route.snapshot.params.id;
 
        var queryParams = this.route.snapshot.queryParams;
        var ids = queryParams['configitemid'];
        if(!ids || ids=='') return;
        this.configItemIds = ids.split(',');

        
        this.classService.getAll()
          .subscribe(classes => {            
            this.classes = classes.filter(function (filterClass: Class) {
              return filterClass.isInstantiable;
            });

            this.configitemMap = new ConfigItemMap(null, this.configItemService, this.classes);
    
            this.nodeSub$ = this.configitemMap.nodes.subscribe(nodes => {
              this.displayMap.nodes = nodes;
            });
        
            this.linkSub$ = this.configitemMap.links.subscribe(links => {
              this.displayMap.links = links;
            });

            this.configitemMap.appendObjects(this.configItemIds);
            
          });
    
    });     
  }

  closeSubscriptions()
  {
    if(this.nodeSub$) this.nodeSub$.unsubscribe();
    if(this.linkSub$) this.linkSub$.unsubscribe();
  }

  doExpandMap() {
    this.configitemMap.expand(false);
  }


  doResetMap() {
    this.configitemMap = new ConfigItemMap(null, this.configItemService, this.classes);  
    
    this.closeSubscriptions();

    this.nodeSub$ = this.configitemMap.nodes.subscribe(nodes => {
      this.displayMap.nodes = nodes;
    });

    this.linkSub$ = this.configitemMap.links.subscribe(links => {
      this.displayMap.links = links;
    });

    this.configitemMap.appendObjects(this.configItemIds);  
  }

  onMapNodeRightClick(id)
  {            
    if(confirm('Click OK to expand, Cancel to Remove from map'))
    {      
      this.configitemMap.expandNode(id);
    }
    else
    {      
      this.configitemMap.removeNode(id);
    }
  }

  onMapNodeClick(evtMapNode) {
    this.router.navigate(['../configitem/edit/' + evtMapNode.id], { relativeTo: this.route });
  }

  
}
