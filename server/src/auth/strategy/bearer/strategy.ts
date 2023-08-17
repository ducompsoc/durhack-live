import Bearer, { IStrategyOptions, VerifyFunction } from "passport-http-bearer";

export default class SometimesBearer<T extends VerifyFunction> extends Bearer<T> {
  constructor(strategy_options: IStrategyOptions, bearerVerifyFunction: VerifyFunction) {
    super(strategy_options, bearerVerifyFunction);
  }

  private parseAuthHeader(headerValue: unknown) {
    if (typeof headerValue !== "string") {
      return null;
    }
    const matches = headerValue.match(/(\S+)\s+(\S+)/);
    return matches && { scheme: matches[1], credentials: matches[2] };
  }

  public override authenticate(req) {

    if (!req.headers || !req.headers.authorization) { return this.pass(); }

    const { scheme, credentials } = this.parseAuthHeader(req.headers.authorization);

    if (!/^Bearer$/i.test(scheme)) { return this.pass(); }

    const token = credentials;

    if (!token) { return this.fail(this._challenge()); }

    const verified = (err, user, info) => {
      if (err) { return this.error(err); }
      if (!user) {
        if (typeof info == "string") {
          info = { message: info };
        }
        info = info || {};
        return this.fail(this._challenge("invalid_token", info.message));
      }
      this.success(user, info);
    };

    if (this._passReqToCallback) {
      this._verify(req, token, verified);
    } else {
      this._verify(token, verified);
    }
  }
}