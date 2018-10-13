import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  matrixData: Array<any>;
  buildA = [
    {
      name: 'floor-31',
    },
    {
      name: 'floor-30',
    },
    {
      name: 'floor-29',
    },
    {
      name: 'floor-28',
    },
    {
      name: 'floor-27',
    },
    {
      name: 'floor-26',
    },
    {
      name: 'floor-25',
    },
    {
      name: 'floor-24',
    },
    {
      name: 'floor-23',
    },
    {
      name: 'floor-22',
    },
    {
      name: 'floor-21',
    },
    {
      name: 'floor-20',
    },
    {
      name: 'floor-19',
    },
    {
      name: 'floor-18',
    },
    {
      name: 'floor-17',
    },
    {
      name: 'floor-16',
    },
    {
      name: 'floor-15',
    },
    {
      name: 'floor-14',
    },
    {
      name: 'floor-13',
    },
    {
      name: 'floor-12',
    },
    {
      name: 'floor-11',
    },
    {
      name: 'floor-10',
    },
    {
      name: 'floor-09',
    },
    {
      name: 'floor-08',
    },
    {
      name: 'floor-07',
    },
  ];

  constructor(public authService: AuthService,
    public userService: UserService,
    private location: Location) { }

  ngOnInit() {
    this.getData();
    console.log(this.buildA);
  }

  getData() {
    this.userService.getAllData().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(res => {
      this.matrixData = res[0];
      console.log(res[0]);
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
    if (value === 'xy') {
      return 2;
    } else if (value == 'x') {
      return 2;
    }
  }

  calRowspan(value: string) {
    if (value === 'floor-31') {
      return 2;
    }
  }
}
