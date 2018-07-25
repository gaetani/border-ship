/**
 * Businness exception to be thrown if any errors without aggrement is collected
 */
export class BusinessError extends Error {

  private readonly _status: number;
  constructor(message: string, errorCode: number) {
    super(message);
    this._status = errorCode;
  }

  public get status(): number {
    return this._status;
  }

}
