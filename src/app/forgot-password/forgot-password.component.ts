import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../core/user.service'
import { AuthService } from '../core/auth.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  @ViewChild('modal') modal;
  resetForm: FormGroup;
  errorMessage: string;

  constructor(
    public authService: AuthService,
    public userService: UserService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  resetpassword(email: string) {
    this.authService.resetPassword(email)
      .then(res => {
        this.openModal("Please check your email for reset password.", 'error', '');
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }

  closeModal(value) {
    this.router.navigate(['/login']);
  }

  openModal(message, type, action) {
    this.modal.open(message, type, action, 0);
  }
}
