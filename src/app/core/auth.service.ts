import { Injectable } from "@angular/core";
import 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import { resolve } from "url";

@Injectable()
export class AuthService {

  constructor(
    public afAuth: AngularFireAuth
  ) { }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err))
    })
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut()
        resolve();
      }
      else {
        reject();
      }
    });
  }

  generateTime() {
    var keyTime = moment().format('YYMMDD-hhmmss');
    return "QN" + keyTime;
  }

  logUser(uid, userName) {
    return new Promise((resolve, reject) => {
      var ref = firebase.database().ref("login-log/" + this.generateTime())
      ref.set({
        created_date: moment().format('YYYY-MM-DD'),
        name: userName,
        uid: uid
      }).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      let auth = firebase.auth();
      auth.sendPasswordResetEmail(email)
        .then(() => resolve("email sent"))
        .catch((error) => reject(error))
    });
  }
}
