export class MonthlyExpense {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public amount: number,
    public dayOfMonth: number,
    public cancellationLink: string | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}





