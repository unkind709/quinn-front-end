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
    @Output() doAction = new EventEmitter<string>();

    constructor(config: NgbModalConfig, private modalService: NgbModal) {
        // customize default values of modals used by this component tree
        config.backdrop = 'static';
        config.keyboard = false;
    }

    open(message, type, action) {
        this.message = message;
        this.action = action;
        if (type == 'prompt') {
            this.modalService.open(this.prompt, { centered: true });
        }
        else if (type === 'error') {
            this.modalService.open(this.error, { centered: true });
        }
    }

    confirm() {
        this.doAction.emit(this.action);
        this.modalService.dismissAll();
    }
}