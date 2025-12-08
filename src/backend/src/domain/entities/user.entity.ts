export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Invalid email format');
    }
    if (!this.name || this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (!this.passwordHash) {
      throw new Error('Password hash is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}





