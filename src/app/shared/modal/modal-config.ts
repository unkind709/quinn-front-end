import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-config',
    templateUrl: './modal-config.html',
    styleUrls: ['./modal-config.css'],
    providers: [NgbModalConfig, NgbModal]
})
export class NgbdModalConfig {
    @ViewChild('error') error;
    @ViewChild('prompt') prompt;
    action: string;
    message: string;
    permission: number;
    @Output() doAction = new EventEmitter<string>();

    constructor(config: NgbModalConfig, private modalService: NgbModal) {
        // customize default values of modals used by this component tree
        config.backdrop = 'static';
        config.keyboard = false;
    }

    open(message, type, action, permission) {
        this.message = message;
        this.action = action;
        this.permission = permission;
        if (type == 'prompt') {
            this.modalService.open(this.prompt, { centered: true });
        }
        else if (type === 'error') {
            this.modalService.open(this.error, { centered: true });
        }
    }

    available() {
        if (this.action === 'available') {
            this.doAction.emit('not-available');
        } else if (this.action === 'not-available') {
            this.doAction.emit('available');
        }
        this.modalService.dismissAll();
    }

    confirm(todo) {
        if (todo === 'isold') {
            this.doAction.emit('international-sold');
        } else if (todo === 'sold') {
            this.doAction.emit('sold');
        }
        this.modalService.dismissAll();
    }

    cancel() {
        if (this.action === 'international-sold') {
            this.doAction.emit('available');
        } else if (this.action === 'sold') {
            this.doAction.emit('available');
        }
        this.modalService.dismissAll();
    }

    close() {
        this.doAction.emit('reset');
        this.modalService.dismissAll();
    }
}