import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService, OwnerService, ReportService, Class, ClassService } from '../core';

import { OwnerStatistic, ConfigItemStatistic } from '../core/models/report.model';
import { Owner } from '../core/models/owner.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  constructor(
    private router: Router,    
    private userService: UserService,
    private ownerService: OwnerService,
    private classService: ClassService,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  searchForm: FormGroup;
  classes: Class[];
  configItemStats: ConfigItemStatistic[];
  ownerSummaryStats: Owner[];
  ownerStatsPie: any[];
  configItemStatsPie: any[];
  ciFilterName: string = 'all';
  filterClassEntityId: string;

  activeOwnerCount: number;
  usedClassCount: number;
  configItemCount: number;



  ngOnInit() {    
    this.classService.getAll(true)    
      .subscribe(classes => {
        this.classes = classes.filter(function (filterClass: Class) {
          return filterClass.isInstantiable;
        });          
      });

    this.searchForm = new FormGroup({
      classEntityId: new FormControl(), //'fa86614d-0ff8-4bb2-8656-24873990ddd2'),      
    });

      this.doSearch();
  }

  doSearch()
  {
    this.filterClassEntityId = this.searchForm.value['classEntityId'];
    this.ciFilterName = this.getClassName(this.filterClassEntityId);
    if(this.ciFilterName=='') this.ciFilterName = 'all';
    this.usedClassCount = 0;
    this.reportService.getConfigItemsByClass()
    .subscribe(ciStats => {
      this.configItemStats = ciStats;
      this.usedClassCount = this.configItemStats.length;

      this.configItemStatsPie = [];
      ciStats.forEach(ci =>{          
        this.configItemStatsPie.push({name: ci.className, value: ci.count});
      });

    });

    this.activeOwnerCount = 0;      
    this.configItemCount = 0;

    this.reportService.getConfigItemsByOwner()
    .subscribe(ownerStats => {
      //this.ownerStats = ownerStats;
      this.ownerSummaryStats = [];
      this.ownerStatsPie = [];
      ownerStats.forEach(ownerStat =>{
          var configItemCount = this.getConfigItemCount(ownerStat, this.filterClassEntityId);
          if(configItemCount>0)
          {
              this.activeOwnerCount++;
              this.configItemCount += configItemCount;
              var owner: Owner = 
              {
                  id: ownerStat.ownerEntityId,
                  ownerName: ownerStat.ownerName,
                  configItemCount: configItemCount
              } as Owner;
              this.ownerSummaryStats.push(owner);
              this.ownerStatsPie.push({name: owner.ownerName, value: owner.configItemCount});
          }
      });        
    });
  }

  getClassName(classEntityId: string)
  {
    if(!this.classes || classEntityId=='') return '';
    for(var i=0; i<this.classes.length; i++)
    {
      var c = this.classes[i];
      if(c.id==classEntityId) return c.className;
    }
    return '';
  }

  getConfigItemCount(ownerStat: OwnerStatistic, filterClassEntityId: string)
  {
              
        if(ownerStat.configItemStatistics)
        {          
          var total = 0;
          for(var s=0; s<ownerStat.configItemStatistics.length; s++)
          {
              var stat = ownerStat.configItemStatistics[s];
              //if not set or filtered
              if(!filterClassEntityId || stat.classEntityId==filterClassEntityId) total += stat.count;
          }
          return total;
        }
         
    return 0;
  }

  onSelectOwnerChart(event) {
    console.log(event);
  }

  onSelectConfigItem(event)
  {
    console.log(event);
  }

}
