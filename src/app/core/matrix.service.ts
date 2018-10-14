import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

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

    reserve() {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(this.dbPath + '/diagram-a/' + 'floor-31/' + '1/').update({
                status: 'reserved'
            }).then(res => {
                resolve(res)
            }, err => reject(err))
        })
    }
}