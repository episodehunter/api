export class UnauthorizedError extends Error {
  constructor() {
    super('Not Authorized')
    this.name = this.constructor.name
  }
}
