import { Injectable } from '@angular/core';

declare let toastr: any;

@Injectable()
export class ToastrService {

    error(message: string, title?: string) {

        toastr.error(message, title);
    }

}
