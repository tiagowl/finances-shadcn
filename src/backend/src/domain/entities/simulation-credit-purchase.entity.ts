export class SimulationCreditPurchase {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public amount: number,
    public installments: number,
    public purchaseDate: Date,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}





