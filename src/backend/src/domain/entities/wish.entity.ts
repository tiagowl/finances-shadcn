export class Wish {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public purchaseLink: string | null,
    public categoryId: string | null,
    public amount: number | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}



