export class Category {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly budgetMax: number,
    public readonly color?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (this.name.length > 100) {
      throw new Error('Name must be at most 100 characters');
    }
    if (this.budgetMax < 0) {
      throw new Error('Budget max must be positive or zero');
    }
    if (this.color && !this.isValidColor(this.color)) {
      throw new Error('Invalid color format');
    }
  }

  private isValidColor(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
  }
}





