export class MonthlyRevenue {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public amount: number,
    public dayOfMonth: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}





