import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';
import { element } from 'protractor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

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

  constructor(public authService: AuthService,
    public userService: UserService,
    private location: Location) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.userService.getAllData().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(res => {
      this.matrixData1 = res[0];
      this.matrixData2 = res[1];
      console.log(res[1]);
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

  toggleReserveA(room: string, floor: string) {
    this.matrixData1[floor].map((element) => {
      if (element['room-detail'].room === room) {
        if (element.status === 'available') {
          element.status = 'reserved';
        } else {
          element.status = 'available';
        }
      }
    });
  }

  toggleReserveB(room: string, floor: string) {
    console.log(room, floor);
    this.matrixData2[floor].map((element) => {
      if (element['room-detail'].room === room) {
        if (element.status === 'available') {
          element.status = 'reserved';
        } else {
          element.status = 'available';
        }
      }
    });
    console.log(this.matrixData2[floor]);
  }
}
