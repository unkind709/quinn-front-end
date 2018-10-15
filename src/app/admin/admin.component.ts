import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../core/auth.service'
import { UserService } from '../core/user.service'

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    adminForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    currentJustify: string = '';
    userList = [];

    nameDropdown = "Name";
    groupDropdown = "Group";

    constructor(
        public authService: AuthService,
        public userService: UserService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.createForm();
    }

    ngOnInit() {
        this.tryGetAllUsers()
    }

    createForm() {
        this.adminForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }

    tryRegister(value) {
        if (value.password === value.confirmPassword) {
            this.authService.doRegister(value)
                .then(res => {
                    console.log(res);
                    this.trySaveUser(value.name)
                    this.errorMessage = "";
                    this.successMessage = "Your account has been created";
                }, err => {
                    console.log(err);
                    this.errorMessage = err.message;
                    this.successMessage = "";
                })
        } else {
            this.errorMessage = "Password field doesn't match";
            this.successMessage = "";
        }
    }

    trySaveUser(name) {
        this.userService.saveUser(name)
            .then(res => {
                console.log(res);
                this.router.navigate(['/main']);
                this.errorMessage = "";
            }, err => {
                console.log(err);
                this.errorMessage = err.message;
                this.successMessage = "";
            })
    }

    tryGetAllUsers() {
        this.userService.getAllUsers()
            .then(res => {
                for (var x in res) {
                    res.hasOwnProperty(x) && this.userList.push(res[x])
                }
                console.log(this.userList);
            }, err => {
                console.log(err);
            })
    }

    onChangeNameDropdown(name) {
        this.nameDropdown = name;
    }
    
    onChangeGroupDropdown(group) {
        this.groupDropdown = group;
    }

    onClickSaveButton() {
        
    }
}
