import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from './services/toastr.services';
import { CsvService } from './services/csv.service';
import { XmlService } from './services/xml.service';
import { CsvElement } from './models/csv.model';
import { XmlFileElement } from './models/xmlFile.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('fileImportInput') fileImportInput: any;

  public title = 'Rabo Bank!';
  private _columnsForValidFile: string[] = ['Reference', 'AccountNumber', 'Description', 'Start Balance', 'Mutation', 'End Balance'];
  private _columnsForInvalidFile: string[] = ['Reference', 'Description', 'Reason'];
  private _validCsvFile: CsvElement[];
  private _failedCsvRecords: CsvElement[];
  private _validXmlFile: XmlFileElement[];
  private _failedXmlRecords: XmlFileElement[];
  private _validDataSource;
  private _invalidDataSource;
  private _spinnerFlag: Boolean;

  constructor(private _toastrService: ToastrService,
              private _csvService: CsvService,
              private _xmlService: XmlService) {

  }

  ngOnInit() {
    this._validCsvFile = [];
    this._failedCsvRecords = [];
    this._validXmlFile = [];
    this._failedXmlRecords = [];
    this._spinnerFlag = false;
  }

  /**
   * TO CHECK THE FILE TYPE OF UPLOADED FILE
   */
  isCsvOrXmlFile(file: any): string {
    if (this.isCsvFile(file)) {
      return 'CSV';
    } else if (this.isXmlFile(file)) {
      return 'XML';
    } else {
      return null;
    }
  }

  /**
   * TO CHECK IF THE UPLOADED FILE IS CSV OR NOT
   */
  isCsvFile(file: any): boolean {
    return file.name.endsWith('.csv');
  }

  /**
   * TO CHECK IF THE UPLOADED FILE IS CSV OR NOT
   */
  isXmlFile(file: any): boolean {
    return file.name.endsWith('.xml');
  }

 /**
  * RESETTING THE STATE OF CSVRECORD ARRAY
  */
  fileReset() {
    this.fileImportInput.nativeElement.value = '';
  }


/**
 *
 * @param $event -> CAPTURED EVENT WHILE LISTENING TO THE FILE CHANGE ON THE TEMPLATE
 */
  fileChangeListener($event: any): void {
    this._spinnerFlag = true;
    console.log('File change', $event);
    const text = [];
    const files = $event.srcElement.files;
    const fileType: string = this.isCsvOrXmlFile(files[0]);

    if (fileType) {
      switch (fileType) {
        case 'CSV':
                this._csvService.uploadCsvFile(files[0])
                .subscribe(result => {
                              setTimeout(() => {
                                this._validCsvFile = result.validCsvFile;
                                this._failedCsvRecords = result.listOfFailedCsvRecords;
                                console.log('valid Csv file', this._validCsvFile);
                                console.log('invalid csv file', this._failedCsvRecords);
                                this._validDataSource = new MatTableDataSource(this._validCsvFile);
                                this._invalidDataSource = new MatTableDataSource(this._failedCsvRecords);
                                this.fileReset();
                                this._spinnerFlag = false;
                              }, 1000);
                        },
                          err => console.log('Error occurred while uploading CSV file', err)
                );
                break;
        case 'XML':
                this._xmlService.xmlFileUpload(files[0])
                .subscribe(result => {
                          setTimeout(() => {
                            this._validXmlFile = result.validXmlFile;
                            this._failedXmlRecords = result.listOfFailedXmlRecords;
                            console.log('valid Xml File', this._validXmlFile);
                            console.log('Invalid Xml file', this._failedXmlRecords);
                            this._validDataSource = new MatTableDataSource(this._validXmlFile);
                            this._invalidDataSource = new MatTableDataSource(this._failedXmlRecords);
                            this.fileReset();
                            this._spinnerFlag = false;
                          }, 1000);
                        },
                        err => console.log('Error occurred while uploading XML file', err)
                );
                break;
        default:
                const errMsg = 'Something went wrong, please try agian!';
                this._toastrService.error(errMsg);
                this._spinnerFlag = false;
                this.fileReset();
      }
    } else {
      const errMsg = 'Please import a valid .csv file!';
      this._toastrService.error(errMsg);
      this._spinnerFlag = false;
      this.fileReset();
    }

  }
}
