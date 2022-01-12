export default class DataBaseError extends Error {
  constructor(public message: string, public error?: any) {
    super(message);
  }
}
