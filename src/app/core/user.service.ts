import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { CoreService } from "./core.service";
import * as moment from 'moment';

@Injectable()
export class UserService {

  private dbPath = '/building';
  matrixData: AngularFireList<any> = null;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public coreService: CoreService
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
      var groupDefault = "anonymous"
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
        resolve({ name, permission, group });
      }, err => {
        reject(err);
      });
    });
  }

  getUserUid() {
    return firebase.auth().currentUser.uid;
  }

  getAllUsers() {
    return new Promise<any>((resolve, reject) => {
      let user = firebase.database().ref('users')
      user.once('value').then(res => {
        resolve(res.val());
      }, err => {
        reject(err);
      });
    });
  }

  updatePermission(uid, group) {
    return new Promise<any>((resolve, reject) => {
      if (this.isUidEmpty(uid)) {
        reject("Not found user.")
        return;
      }

      if (this.isGroupEmpty(group)) {
        reject("Please select group.")
        return;
      }

      let groupMap = this.mapGroup(group)
      let user = firebase.database().ref('users/' + uid)
      user.update({
        group: groupMap,
        permission: this.getPermissionFromGroup(groupMap)
      }).then(() => {
        resolve(console.log("update permission success"));
      }).catch((error) => {
        reject(error)
      })
    });
  }

  isUidEmpty(uid) {
    return (uid === null || uid === "" || uid === undefined);
  }

  isGroupEmpty(group) {
    return (group === null || group === "" || group === undefined || group === "Group");
  }

  getPermissionFromGroup(group) {
    switch (group) {
      case "admin": { return 4; break; }
      case "sale-lead": { return 3; break; }
      case "sale": { return 2; break; }
      case "viewer": { return 1; break; }
      default: { return 0; }
    }
  }

  mapGroup(group) {
    switch (group) {
      case "Admin": { return "admin"; break; }
      case "Sale Lead": { return "sale-lead"; break; }
      case "Sale": { return "sale"; break; }
      case "Viewer": { return "viewer"; break; }
      default: { return "annonymous"; }
    }
  }

  logSetPermission(adminName, group, userName, uid) {
    let groupMap = this.mapGroup(group)
    return new Promise((resolve, reject) => {
      var ref = firebase.database().ref("permission-log/" + this.coreService.generateTime())
      ref.set({
        created_by: adminName,
        group: groupMap,
        name: userName,
        permission: this.getPermissionFromGroup(groupMap),
        uid: uid
      }).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }
}