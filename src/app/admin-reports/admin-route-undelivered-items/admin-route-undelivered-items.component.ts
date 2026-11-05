import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RequestedItem } from 'app/models/requested-item';

@Component({
  selector: 'app-admin-route-undelivered-items',
  templateUrl: './admin-route-undelivered-items.component.html',
  styleUrls: ['./admin-route-undelivered-items.component.css']
})
export class AdminRouteUndeliveredItemsComponent implements OnInit {
  adminColumns = ['select', 'preferred_name', 'name', 'item_description', 'date_requested', 'fulfilled'];
  volunteerColumns = ['preferred_name', 'name', 'item_description', 'date_requested'];
  displayedColumns = this.adminColumns;
  undeliveredItems: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  selectedItemIds: Set<number> = new Set<number>();
  selectAllChecked = false;
  backIcon = faChevronLeft;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private mainService: MainService, private clientService: ClientService, private router: Router) { 
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));

    this.mainService.getAdminRouteUndeliveredItems().subscribe(data => {
      if (!this.isAdmin) {
        this.displayedColumns = this.volunteerColumns;
        this.undeliveredItems = data.filter((w) => !w.fulfilled);
      } else {
        this.undeliveredItems = data;
      }
      this.setDataSource(this.undeliveredItems);
    }, error => console.log(error));
  }

  ngOnInit() {

  }

  setDataSource(items: any[]) {
    this.dataSource = new MatTableDataSource(items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  allSelected(): boolean {
    return (
      this.dataSource &&
      this.dataSource.filteredData.length > 0 &&
      this.dataSource.filteredData.every((item) => this.selectedItemIds.has(item.id))
    );
  }

  toggleSelectAll(checked: boolean) {
    this.selectedItemIds.clear();

    if (checked && this.dataSource) {
      this.dataSource.filteredData.forEach((item) => this.selectedItemIds.add(item.id));
    }
    this.selectAllChecked = checked;
  }

  isSelected(item: any): boolean {
    return this.selectedItemIds.has(item.id);
  }

  toggleItemSelection(item: any, checked: boolean) {
    if (checked) {
      this.selectedItemIds.add(item.id);
    } else {
      this.selectedItemIds.delete(item.id);
    }
    this.selectAllChecked = this.allSelected();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.selectAllChecked = this.allSelected();
  }

  back() {
    if (this.isAdmin) {
      this.router.navigate(["/admin/reports"]);
    } else {
      window.localStorage.clear();
      this.router.navigate(['/application-login']);
    }
  }

  submitItems() {
    let count: number = 0;
    this.undeliveredItems.forEach(item => {
      let itemToUpdate: RequestedItem = new RequestedItem();
      itemToUpdate.id = item.id;
      itemToUpdate.client_id = item.client_id;
      itemToUpdate.date_requested = item.date_requested;
      itemToUpdate.fulfilled = item.fulfilled;
      itemToUpdate.has_received = item.has_received;
      itemToUpdate.item_description = item.item_description;
      this.mainService.updateRequestedItem(itemToUpdate).subscribe((data: RequestedItem) => {
        count++;

        if (count >= this.undeliveredItems.length) {
          console.log('Everything done updating');
          window.location.reload();
        }
      },
      (error) => {
        console.log(error);
        count++;

        if (count >= this.undeliveredItems.length) {
          console.log('Everything done updating');
          window.location.reload();
        }
      }
      );
    });
  }

  deleteSelectedItems() {
    if (this.selectedItemIds.size === 0) {
      return;
    }

    if (!confirm('Delete the selected request(s)? This cannot be undone.')) {
      return;
    }

    const selectedIds = Array.from(this.selectedItemIds);
    let completed = 0;
    const deletedIds: number[] = [];

    selectedIds.forEach((id) => {
      this.clientService.deletedRequestedItem(id).subscribe(
        () => {
          deletedIds.push(id);
          completed++;
          if (completed >= selectedIds.length) {
            this.undeliveredItems = this.undeliveredItems.filter(
              (item) => !deletedIds.includes(item.id)
            );
            this.selectedItemIds.clear();
            this.selectAllChecked = false;
            this.setDataSource(this.undeliveredItems);
          }
        },
        (error) => {
          console.log(error);
          completed++;
          if (completed >= selectedIds.length) {
            this.undeliveredItems = this.undeliveredItems.filter(
              (item) => !deletedIds.includes(item.id)
            );
            this.selectedItemIds.clear();
            this.selectAllChecked = false;
            this.setDataSource(this.undeliveredItems);
          }
        }
      );
    });
  }

}
