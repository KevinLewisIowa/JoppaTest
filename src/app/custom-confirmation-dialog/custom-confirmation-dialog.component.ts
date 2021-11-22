import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-confirmation-dialog',
  templateUrl: './custom-confirmation-dialog.component.html',
  styleUrls: ['./custom-confirmation-dialog.component.css']
})
export class CustomConfirmationDialogComponent implements OnInit {
  title: string;
  message: string;
  confirmText: string;
  dismissText: string;

  constructor(public dialogRef: MatDialogRef<CustomConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    this.title = data.title;
    this.message = data.message;
    this.confirmText = data.confirmText;
    this.dismissText = data.dismissText;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
  }

}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string, public confirmText: string, public dismissText: string) {}
}