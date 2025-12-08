export class Revenue {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly date: Date,
    public readonly notes?: string,
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
    if (this.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (this.amount > 999999.99) {
      throw new Error('Amount exceeds maximum value');
    }
    if (this.date > new Date()) {
      throw new Error('Date cannot be in the future');
    }
    if (this.notes && this.notes.length > 500) {
      throw new Error('Notes must be at most 500 characters');
    }
  }
}





