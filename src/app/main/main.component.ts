import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

import { AuthService } from '../core/auth.service';
import { MatrixService } from '../core/matrix.service';
import { UserService } from '../core/user.service';
import { FirebaseUserModel } from '../core/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('modal') modal;
  matrixData1: Array<any>;
  matrixData2: Array<any>
  buildA = [
    {
      name: 'floor-31',
      floor: 31
    },
    {
      name: 'floor-30',
      floor: 30
    },
    {
      name: 'floor-29',
      floor: 29
    },
    {
      name: 'floor-28',
      floor: 28
    },
    {
      name: 'floor-27',
      floor: 27
    },
    {
      name: 'floor-26',
      floor: 26
    },
    {
      name: 'floor-25',
      floor: 25
    },
    {
      name: 'floor-24',
      floor: 24
    },
    {
      name: 'floor-23',
      floor: 23
    },
    {
      name: 'floor-22',
      floor: 22
    },
    {
      name: 'floor-21',
      floor: 21
    },
    {
      name: 'floor-20',
      floor: 20
    },
    {
      name: 'floor-19',
      floor: 19
    },
    {
      name: 'floor-18',
      floor: 18
    },
    {
      name: 'floor-17',
      floor: 17
    },
    {
      name: 'floor-16',
      floor: 16
    },
    {
      name: 'floor-15',
      floor: 15
    },
    {
      name: 'floor-14',
      floor: 14
    },
    {
      name: 'floor-13',
      floor: 13
    },
    {
      name: 'floor-12',
      floor: 12
    },
    {
      name: 'floor-11',
      floor: 11
    },
    {
      name: 'floor-10',
      floor: 10
    },
    {
      name: 'floor-09',
      floor: 9
    },
    {
      name: 'floor-08',
      floor: 8
    },
    {
      name: 'floor-07',
      floor: 7
    },
  ];

  floorData = [
    { name: 'ROOF'},
    { name: 'MEZZANINE'},
    { name: '31th'},
    { name: '30th'},
    { name: '29th'},
    { name: '28th'},
    { name: '27th'},
    { name: '26th'},
    { name: '25th'},
    { name: '24th'},
    { name: '23rd'},
    { name: '22nd'},
    { name: '21st'},
    { name: '20th'},
    { name: '19th'},
    { name: '18th'},
    { name: '17th'},
    { name: '16th'},
    { name: '15th'},
    { name: '14th'},
    { name: '13th'},
    { name: '12th'},
    { name: '11th'},
    { name: '10th'},
    { name: '9th'},
    { name: '8th'},
    { name: '7th'},
    // { name: ''},
    // { name: '6th'},
    // { name: '5th'},
    // { name: '4th'},
    // { name: '3rd'},
    // { name: '2nd'},
    // { name: ''},
    // { name: '1st'}
  ];
  building: string;
  room: string;
  floor: number;
  userModel: FirebaseUserModel = {
    uid: '',
    username: '',
    permission: 0,
    group: ''
  };


  total = 0;
  availableTotal = 0;
  reservedTotal = 0;
  soldTotal = 0;
  notAvailableTotal = 0;

  constructor(public authService: AuthService,
    public matrixService: MatrixService,
    public userService: UserService,
    private location: Location) { }

  ngOnInit() {
    this.getUser();
    this.getData();
  }

  getUser() {
    this.userService.getCurrentUser().then(res1 => {
      this.userModel.uid = res1.uid;
      this.userService.getUserDetail(res1.uid)
        .then((res) => {
          this.userModel.permission = res.permission;
          this.userModel.username = res.name;
          this.userModel.group = res.group
          console.log(res);
        }, (err2) => {
          console.log(err2);
        });
    }, (err1) => {
      console.log(err1);
    });
  }

  getData() {
    this.matrixService.getAllData().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(res => {
      this.matrixData1 = res[0];
      this.matrixData2 = res[1];
      this.clearSummary()
      this.getTotalSummary()
    });
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.location.back();
      }, (error) => {
        console.log("Logout error", error);
      });
  }

  calColspan(value: string) {
    if (value === 'xy' || value === 'x') {
      return 2;
    }
  }

  calRowspan(value: string) {
    if (value === 'floor-31') {
      return 2;
    }
  }

  openModal(message, type, action) {
    this.modal.open(message, type, action);
  }

  toggleReserve(roomdata: any, room: string, floor: number) {
    console.log(roomdata, room, floor);

    if (roomdata.diagram === 'A') {
      this.building = 'diagram-a';
    } else if (roomdata.diagram === 'B') {
      this.building = 'diagram-b';
    }
    this.room = room;
    this.floor = floor;

    //checkPermission
    if (roomdata.status === 'available' && this.userModel.permission > 1) {
      this.openModal("Reserve?", 'prompt', roomdata.status);
    } else if (roomdata.status === 'available' && this.userModel.permission <= 1) {
      this.openModal("Can't reserve.", 'error', '');
    } else if (roomdata.status === 'reserved' && this.userModel.permission > 2) {
      this.openModal("Sold or cancel reserve?", 'prompt', roomdata.status);
    } else if (roomdata.status === 'reserved' && this.userModel.permission <= 2) {
      this.openModal("Can't sold or cancel reserve.", 'error', '');
    } else if (roomdata.status === 'sold' && this.userModel.permission > 3) {
      this.openModal("Cancel sold?", 'prompt', roomdata.status);
    } else if (roomdata.status === 'sold' && this.userModel.permission <= 3) {
      this.openModal("Can't cancel sold.", 'error', '');
    }
  }

  doReserve(action) {
    console.log(action);
    this.matrixService.reserve(this.building, this.room, this.floor, action, this.userModel)
      .then(res => {
        console.log('success');
      }, err => {
        console.log(err);
      });
  }

  getTotalSummary() {
    var summaryBuildingA = this.getSummary(this.matrixData1)
    var summaryBuildingB = this.getSummary(this.matrixData2)
  }

  getSummary(building) {
    this.buildA.forEach(floor => {
      Object.keys(building[floor.name]).forEach(element => {
        this.total++
        if (building[floor.name][element].status === 'available') {
          this.availableTotal++;
        } else if (building[floor.name][element].status === 'reserved') {
          this.reservedTotal++;
        } else if (building[floor.name][element].status === 'sold') {
          this.soldTotal++;
        } else if (building[floor.name][element].status === 'not-available') {
          this.notAvailableTotal++;
        }
      })
    });
  }

  clearSummary() {
    this.total = 0;
    this.reservedTotal = 0;
    this.soldTotal = 0;
    this.availableTotal = 0;
    this.notAvailableTotal = 0;
  }
}
