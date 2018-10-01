export class XmlFileElement {
    reference: number;
    accountNumber: string;
    description: string;
    startBalance: number;
    mutation: number;
    endBalance: number;

    constructor() {
      this.reference = null;
      this.accountNumber = '';
      this.description = '';
      this.startBalance = null;
      this.mutation = null;
      this.endBalance = null;
    }
}
