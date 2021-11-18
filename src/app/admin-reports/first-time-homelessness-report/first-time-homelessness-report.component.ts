import { Component, OnInit, ViewChild } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { MainService } from 'app/services/main.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';

@Component({
  selector: 'app-first-time-homelessness-report',
  templateUrl: './first-time-homelessness-report.component.html',
  styleUrls: ['./first-time-homelessness-report.component.css']
})
export class FirstTimeHomelessnessReportComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'birth_date', 'first_time_homeless', 'date_became_homeless', 'homeless_reason']
  clients: any[] = [];
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private service: MainService) { };

  ngOnInit() {
    this.service.getFirstTimeHomelessnessReport().subscribe(data => {
      this.clients = data;
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'updated_at': return new Date(item.last_interaction_date);
          default: return item[property];
        }
      };
      this.dataSource.paginator = this.paginator;
    }, error => {console.log(error)});
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
