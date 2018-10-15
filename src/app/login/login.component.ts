import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../core/auth.service'
import { UserService } from '../core/user.service'
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    public coreService: CoreService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.coreService.generateTime()
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value)
      .then(res => {
        this.prepareLogUser()
        this.router.navigate(['/main']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      })
  }

  prepareLogUser() {
    var uid = this.userService.getUserUid()
    this.userService.getUserName(uid)
      .then(res => {
        this.tryLogUser(uid, res)
      }, err => {
        console.log(err)
      })
  }

  tryLogUser(uid, name) {
    this.authService.logUser(uid, name)
      .then(res => {
        console.log("Log User Success");
      }, err => {
        console.log(err);
      })
  }
}
