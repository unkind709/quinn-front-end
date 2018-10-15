import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { resolve } from "url";

@Injectable()
export class CoreService {

  constructor(
    public afAuth: AngularFireAuth
  ) { }

  generateTime() {
    var keyTime = moment().format('YYMMDD-hhmmss');
    return "QN" + keyTime;
  }
}