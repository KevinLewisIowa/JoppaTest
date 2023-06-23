import { Component, ViewChild, Output, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from 'app/services/client.service';
import { ClientCircleOfFriends } from 'app/models/client-circle-of-friends';

@Component({
  selector: 'app-client-circle-of-friends',
  templateUrl: './client-circle-of-friends.component.html',
  styleUrls: ['./client-circle-of-friends.component.css']
})
export class ClientCircleOfFriendsComponent implements OnInit {
  @ViewChild('clientCircleOfFriendsMdl', {static: false}) clientCircleOfFriendsMdl: ElementRef;
  @Output() friendAdded = new EventEmitter<ClientCircleOfFriends>();
  isAdmin: boolean = false;
  volunteer_name: string = '';
  email: string = '';
  phone_number: string = '';
  notes: string = '';

  constructor(private modalService: NgbModal, private clientService: ClientService) { }

  ngOnInit() {
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  }

  showModal() {
    this.modalService.open(this.clientCircleOfFriendsMdl, {size: 'lg', backdrop: 'static'});
  }


  submitFriend() {
    const clientFriend = new ClientCircleOfFriends();
    const routeInstanceId: number = this.isAdmin ? -1 : JSON.parse(localStorage.getItem('routeInstance'));
    
    if (this.volunteer_name != null && this.volunteer_name != null && this.phone_number != null && !isNaN(routeInstanceId)) {
      clientFriend.volunteer_name = this.volunteer_name;
      clientFriend.email = this.email;
      clientFriend.phone_number = this.phone_number;
      clientFriend.notes = this.notes;
      
      console.log(JSON.stringify(clientFriend));
      this.clientService.insertFriend(clientFriend).subscribe((data: ClientCircleOfFriends) => {
        if (data != null && data.id != null) {
          this.friendAdded.emit(data);
        }
      }, error => {console.log(error)});
    }

    this.volunteer_name = '';
    this.email = '';
    this.phone_number = '';
    this.notes = '';
  }

}
