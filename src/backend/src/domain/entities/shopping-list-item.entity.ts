export class ShoppingListItem {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public price: number,
    public isPurchased: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}





