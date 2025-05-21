import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MainService } from 'app/services/main.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-route-unfulfilled-prayer-requests-needs',
  templateUrl: './admin-route-unfulfilled-prayer-requests-needs.component.html',
  styleUrls: ['./admin-route-unfulfilled-prayer-requests-needs.component.css']
})
export class AdminRouteUnfulfilledPrayerRequestsNeedsComponent implements OnInit {
  displayedColumns: string[] = ['first_name', 'preferred_name', 'last_name', 'request_or_note', 'created_at'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;

  unfulfilledPrayerRequestsNeeds = [];
  filterDate: string;

  constructor(private service: MainService) { };

  backIcon = faChevronLeft;

  ngOnInit() {
    // Set default filter date to two weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    this.filterDate = this.formatDate(twoWeeksAgo);

    // Fetch data with the default filter date
    this.fetchData(this.filterDate);
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  onDateChange() {
    // Fetch data whenever the date changes
    this.fetchData(this.filterDate);
  }

  fetchData(date: string) {
    this.service.getAdminRouteUnfulfilledPrayerRequestsNeeds(date).subscribe(data => {
      console.log(JSON.stringify(data));
      this.unfulfilledPrayerRequestsNeeds = data;
      this.dataSource = new MatTableDataSource(this.unfulfilledPrayerRequestsNeeds);
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }, error => console.log(error));
  }

  formatDate(date: Date): string {
    // Format date as YYYY-MM-DD for the input field
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  exportToCSV(): void {
    const csvData = this.convertToCSV(this.dataSource.data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'prayer-requests.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertToCSV(data: any[]): string {
    if (!data || !data.length) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = data.map(row =>
      headers.map(header => JSON.stringify(row[header], (_, value) => value ?? '')).join(',')
    );

    return [headers.join(','), ...csvRows].join('\r\n');
  }
}
