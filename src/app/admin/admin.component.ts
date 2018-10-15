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
    setPermissionSuccessMessage: string = '';
    setPermissionErrorMessage: string = '';
    currentJustify: string = '';
    userList = [];
    userUid: string = '';
    userRes: Array<any>;

    nameDropdown = "Name";
    groupDropdown = "Group";

    adminName = '';
    userName = '';

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
                this.userRes = res
            }, err => {
                console.log(err);
            })
    }

    onChangeNameDropdown(name) {
        this.nameDropdown = name;
        this.getUserUid(name);
        this.clearMessage();
    }

    onChangeGroupDropdown(group) {
        this.groupDropdown = group;
        this.clearMessage();
    }

    onClickSaveButton() {
        this.userService.updatePermission(this.userUid, this.groupDropdown)
            .then(() => {
                console.log("this.useruid1 : " + this.userUid)
                this.setPermissionSuccessMessage = "Update permission success!";
                this.tryLogSetPermission(this.userUid, this.groupDropdown);
                console.log("this.useruid2 : " + this.userUid)
                this.clearDropdown();  /* Must write here because uid will clear too fast */
            }, (error) => {
                this.setPermissionErrorMessage = error;
                this.clearDropdown(); /* Must write here because uid will clear too fast */
            })
    }

    getUserUid(name) {
        Object.keys(this.userRes).forEach(element => {
            if (name === this.userRes[element].name) {
                this.userUid = element;
            }
        })
    }

    clearDropdown() {
        this.userUid = '';
        this.nameDropdown = "Name";
        this.groupDropdown = "Group";
    }

    clearMessage() {
        this.setPermissionErrorMessage = '';
        this.setPermissionSuccessMessage = '';
    }

    prepareAdminName(adminUid) {
        this.userService.getUserName(adminUid)
            .then(res => {
                console.log(res)
                this.adminName = res;
                return res;
            }, err => {
                console.log(err)
            })
    }

    prepareUserName(userUid) {
        this.userService.getUserName(userUid)
            .then(res => {
                console.log(res)
                this.userName = res.val();
                return res.val();
            }, err => {
                console.log(err)
            })
    }

    tryLogSetPermission(uid, group) {
        let adminUid = this.userService.getUserUid();
        let adminName = this.prepareAdminName(adminUid);
        let userName = this.prepareUserName(uid);
        console.log("uid : " + uid);
        console.log("group : " + group);
        console.log("adminUid : " + adminUid);
        console.log("adminName : " + this.adminName);
        console.log("userName : " + this.userName);
        this.userService.logSetPermission(this.adminName, group, this.userName, uid)
            .then(res => {
                console.log("Log Set Permission Success");
            }, err => {
                console.log(err);
            })
    }
}
