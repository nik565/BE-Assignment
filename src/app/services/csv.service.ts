import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CsvService {

  private _csvUrl: string;

  constructor(private _http: HttpClient) {
    this._csvUrl = '/api/v1/csv/csvUpload';
  }

  uploadCsvFile(file: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileItem', file, file.name);
    return this._http.post(this._csvUrl, formData);
  }
}
