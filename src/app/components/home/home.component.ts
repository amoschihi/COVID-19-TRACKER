import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  totalActive = 0;
  globalData: GlobalDataSummary[];
  piechart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnchart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }

  constructor(private dataService: DataServiceService) { }
  
  initChart(caseType: string) {
    let datatable = [];
    datatable.push(['Country', 'Cases'])
    this.globalData.forEach(cs=>{
      let value: number;
      if(caseType=='c')
        value = cs.confirmed;
      if(caseType=='r')
        value = cs.recovered;
      if(caseType=='d')
        value  = cs.deaths;
      if(caseType == 'a')
        value =cs.active;
      
      datatable.push([cs.country, value])
    })

    console.log(datatable);
    this.piechart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };
    this.columnchart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData()
    .subscribe(
      {
        next: (result) => {
          this.globalData = result;
          result.forEach(cs=>{
            if(!Number.isNaN(cs.confirmed)){
              this.totalConfirmed+=cs.confirmed
              this.totalDeaths+=cs.deaths
              this.totalRecovered+=cs.recovered
              this.totalActive+=cs.active
            }
          })
          this.initChart('c');
        }
      })
  }

  updateChart(input: HTMLInputElement){
    this.initChart(input.value);
  }
  
}
