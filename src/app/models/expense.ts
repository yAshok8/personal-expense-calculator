export class Expense {

  public id?: number;

  constructor(
    public itemName: string,
    public amount: number,
    public category: { id:number, name: string },
    public date: string,
    public spent: boolean,
    public beneficiary:  { id:number, name: string }
  ) {}

  getFormattedDate(): string {
    const dateObj = new Date(this.date);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });

    // Add ordinal suffix
    const suffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${suffix(day)} ${month}`;
  }

}
