import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Room} from "../../../model/room";
import {RoomService} from "../../../service/room.service";

export interface RoomSelectionDialogData {
  message: string
}

@Component({
  selector: 'app-room-selection-dialog',
  templateUrl: './room-selection-dialog.component.html',
  styleUrls: ['./room-selection-dialog.component.css']
})
export class RoomSelectionDialogComponent implements OnInit {

  rooms: Room[] = [];
  selectedRoom!: Room;
  compareFunction = (o1: any, o2: any) => o1.id === o2.id;

  constructor(
    public dialogRef: MatDialogRef<RoomSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoomSelectionDialogData,
    private roomService: RoomService,
  ) { }

  ngOnInit(): void {
    this.roomService.getAllUndeletedRooms().subscribe(
      rooms => {
        this.rooms = rooms;
      }
    )
  }

}