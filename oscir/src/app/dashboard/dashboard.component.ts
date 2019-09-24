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


  ngOnInit() {    
//FIXME
      this.reportService.getConfigItemsByClass()
      .subscribe(ciStats => {
        this.configItemStats = ciStats;
      });

      this.reportService.getConfigItemsByOwner()
      .subscribe(ownerStats => {
        //this.ownerStats = ownerStats;
        this.ownerSummaryStats = [];
        ownerStats.forEach(ownerStat =>{
            var configItemCount = this.getConfigItemCount(ownerStat);
            if(configItemCount>0)
            {
                var owner: Owner = 
                {
                    id: ownerStat.ownerEntityId,
                    ownerName: ownerStat.ownerName,
                    configItemCount: configItemCount
                } as Owner;
                this.ownerSummaryStats.push(owner);
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


}
