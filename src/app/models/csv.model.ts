export class CsvElement {
    Reference: number;
    AccountNumber: string;
    Description: string;
    'Start Balance': number;
    Mutation: number;
    'End Balance': number;

    constructor() {
      this.Reference = null;
      this.AccountNumber = '';
      this.Description = '';
      this['Start Balance'] = null;
      this.Mutation = null;
      this['End Balance'] = null;
    }
}
