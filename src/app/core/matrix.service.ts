import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import * as moment from 'moment';

@Injectable()
export class MatrixService {

    private dbPath = '/building';
    matrixData: AngularFireList<any> = null;

    constructor(
        public db: AngularFireDatabase,
        public afAuth: AngularFireAuth
    ) {
        this.matrixData = db.list(this.dbPath);
    }

    getAllData(): AngularFireList<any> {
        return this.matrixData;
    }

    reserve(building, floor, room, action, userModel) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(this.dbPath + '/' + building + '/' + floor + '/' + room + '/').update({
                status: action
            }).then(res => {
                resolve(res)
                this.logMatrix(action, userModel.permission, userModel.username, userModel.uid);
            }, err => {
                reject(err)
            });
        });
    }

    generateTime() {
        var keyTime = moment().format('YYMMDD-hhmmss');
        return "QN" + keyTime;
    }

    logMatrix(action, permission, username, uid) {
        console.log(action, permission, username, uid);
        return new Promise((resolve, reject) => {
            var ref = firebase.database().ref('matrix-log/' + this.generateTime())
            ref.set({
                action: action,
                created_date: moment().format('YYYY-MM-DD'),
                group: permission,
                name: username,
                uid: uid
            }).then(res => {
                resolve(res);
            }, err => {
                reject(err)
            });
        });
    }
}