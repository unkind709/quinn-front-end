import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {

  private dbPath = '/building';
  matrixData: AngularFireList<any> = null;
  userDataRef: AngularFireObject<any>

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {
    this.matrixData = db.list(this.dbPath);
    this.userDataRef = db.object('users');
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  getAllData(): AngularFireList<any> {
    return this.matrixData;
  }

  saveUser(name) {
    return new Promise<any>((resolve, reject) => {
      var permissionDefault = 0
      var groupDefault = "viewer"
      var uid = firebase.auth().currentUser.uid;
      var user = firebase.database().ref('users/' + uid).set({
        group: groupDefault,
        name: name,
        permission: permissionDefault
      });
    })
  }

  logUser() {
    var ref = firebase.database().ref("login-log")

    ref.set({ name: "Ada", age: 36 })
      .then(function () {
        return ref.once("value");
      })
  }
}