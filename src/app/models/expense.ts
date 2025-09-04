export class Expense {

  public id?: number;

  constructor(
    public itemName: string,
    public amount: number,
    public category: { id:number, name: string },
    public date: string
  ) {}


  // Optional: format date for display
  getFormattedDate(): string {
    return new Date(this.date).toLocaleDateString();
  }

  // Optional: formatted string for logging or debugging
  toString(): string {
    return `${this.itemName} - ₹${this.amount} (${this.category}) on ${this.getFormattedDate()}`;
  }
}
