import { CustomError } from "@/common/errors";

export class TokenError extends CustomError {
  constructor(message?: string) {
    super(message);
    this.name = "TokenError";
  }
}
