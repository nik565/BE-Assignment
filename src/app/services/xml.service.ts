import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { XmlFileElement } from '../models/xmlFile.model';

@Injectable({
  providedIn: 'root'
})
export class XmlService {

  private _xmlUrl: string;
  constructor(private _http: HttpClient) {
    this._xmlUrl = '/api/v1/xml/xmlUpload';
  }

  xmlFileUpload(file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileItem', file, file.name);
    return this._http.post(this._xmlUrl, formData);
  }
}
