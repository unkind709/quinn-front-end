import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class UserService {

  private dbPath = '/building';
  matrixData: AngularFireList<any> = null;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth
  ) {
    this.matrixData = db.list(this.dbPath);
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

  saveUser(name) {
    return new Promise<any>((resolve, reject) => {
      var permissionDefault = 0
      var groupDefault = "viewer"
      var uid = this.getUserUid();
      var user = firebase.database().ref('users/' + uid).set({
        group: groupDefault,
        name: name,
        permission: permissionDefault
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  getUserName(uid) {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.database().ref('users/' + uid)
      user.once('value').then(function (snapshot) {
        var name = snapshot.child('name').val();
        resolve(name)
      });
    })
  }

  getUserDetail(uid) {
    return new Promise<any>((resolve, reject) => {
      let user = firebase.database().ref('users/' + uid)
      user.once('value').then(res => {
        let name = res.child('name').val();
        let permission = res.child('permission').val();
        let group = res.child('group').val();
        resolve({name, permission, group});
      }, err => {
        reject(err);
      });
    });
  }

  getUserUid() {
    return firebase.auth().currentUser.uid;
  }
}