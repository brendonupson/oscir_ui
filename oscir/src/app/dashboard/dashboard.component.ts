import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService, OwnerService, ReportService } from '../core';

import { OwnerStatistic, ConfigItemStatistic } from '../core/models/report.model';
import { Owner } from '../core/models/owner.model';

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
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  configItemStats: ConfigItemStatistic[];
  ownerSummaryStats: Owner[];
  ownerStatsPie: any[];
  configItemStatsPie: any[];

  activeOwnerCount: number;
  usedClassCount: number;
  configItemCount: number;


  ngOnInit() {    

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
            var configItemCount = this.getConfigItemCount(ownerStat);
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

  getConfigItemCount(ownerStat: OwnerStatistic)
  {
              
        if(ownerStat.configItemStatistics)
        {          
          var total = 0;
          for(var s=0; s<ownerStat.configItemStatistics.length; s++)
          {
              var stat = ownerStat.configItemStatistics[s];
              total += stat.count;
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
