"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauth_config = void 0;
var config_1 = require("config");
var tokens_1 = require("@/auth/tokens");
var token_type_1 = require("@/auth/token_type");
var config_2 = require("@/common/schema/config");
var tables_1 = require("@/database/tables");
var hashed_secrets_1 = require("@/auth/hashed_secrets");
exports.oauth_config = config_2.oauth_options_schema.parse(config_1.default.get("oauth"));
var OAuthModel = /** @class */ (function () {
    function OAuthModel() {
    }
    OAuthModel.prototype.generateAccessToken = function (client, user, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var token_lifetime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token_lifetime = client.accessTokenLifetime || exports.oauth_config.accessTokenLifetime;
                        return [4 /*yield*/, tokens_1.default.createToken(token_type_1.default.accessToken, user, {
                                scope: scope === null ? [] : typeof scope === "string" ? [scope] : scope,
                                lifetime: token_lifetime,
                                claims: {
                                    client_id: client.id,
                                },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OAuthModel.prototype.getAccessToken = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded_payload, error_1, client, user, expiresAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tokens_1.default.decodeToken(token_type_1.default.accessToken, accessToken)];
                    case 1:
                        decoded_payload = (_a.sent()).payload;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/];
                    case 3:
                        if (typeof decoded_payload.client_id !== "string")
                            return [2 /*return*/];
                        if (typeof decoded_payload.user_id !== "number")
                            return [2 /*return*/];
                        if (typeof decoded_payload.exp !== "number")
                            return [2 /*return*/];
                        if (typeof decoded_payload.iat !== "number")
                            return [2 /*return*/];
                        if (!Array.isArray(decoded_payload.scope))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.getClient(decoded_payload.client_id, null)];
                    case 4:
                        client = _a.sent();
                        return [4 /*yield*/, tables_1.User.findByPk(decoded_payload.user_id)];
                    case 5:
                        user = _a.sent();
                        if (!client)
                            return [2 /*return*/];
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.checkTokenRevoked(client, user, decoded_payload.iat)];
                    case 6:
                        if (_a.sent())
                            return [2 /*return*/];
                        expiresAt = new Date(0);
                        expiresAt.setSeconds(decoded_payload.exp);
                        return [2 /*return*/, {
                                accessToken: accessToken,
                                accessTokenExpiresAt: expiresAt,
                                scope: decoded_payload.scope,
                                client: client,
                                user: user,
                            }];
                }
            });
        });
    };
    OAuthModel.prototype.generateRefreshToken = function (client, user, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var token_lifetime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token_lifetime = client.refreshTokenLifetime || exports.oauth_config.refreshTokenLifetime;
                        return [4 /*yield*/, tokens_1.default.createToken(token_type_1.default.refreshToken, user, {
                                scope: scope === null ? [] : typeof scope === "string" ? [scope] : scope,
                                lifetime: token_lifetime,
                                claims: {
                                    client_id: client.id,
                                },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OAuthModel.prototype.getRefreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded_payload, error_2, client, user, expiresAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tokens_1.default.decodeToken(token_type_1.default.accessToken, refreshToken)];
                    case 1:
                        decoded_payload = (_a.sent()).payload;
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/];
                    case 3:
                        if (typeof decoded_payload.client_id !== "string")
                            return [2 /*return*/];
                        if (typeof decoded_payload.user_id !== "number")
                            return [2 /*return*/];
                        if (typeof decoded_payload.exp !== "number")
                            return [2 /*return*/];
                        if (typeof decoded_payload.iat !== "number")
                            return [2 /*return*/];
                        if (!Array.isArray(decoded_payload.scope))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.getClient(decoded_payload.client_id, null)];
                    case 4:
                        client = _a.sent();
                        return [4 /*yield*/, tables_1.User.findByPk(decoded_payload.user_id)];
                    case 5:
                        user = _a.sent();
                        if (!client)
                            return [2 /*return*/];
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.checkTokenRevoked(client, user, decoded_payload.iat)];
                    case 6:
                        if (_a.sent())
                            return [2 /*return*/];
                        expiresAt = new Date(0);
                        expiresAt.setSeconds(decoded_payload.exp);
                        return [2 /*return*/, {
                                refreshToken: refreshToken,
                                refreshTokenExpiresAt: expiresAt,
                                scope: decoded_payload.scope,
                                client: client,
                                user: user,
                            }];
                }
            });
        });
    };
    OAuthModel.prototype.saveToken = function (token, client, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, __assign(__assign({}, token), { client: client, user: user })];
            });
        });
    };
    OAuthModel.prototype.checkTokenRevoked = function (client, user, token_issued_at) {
        return __awaiter(this, void 0, void 0, function () {
            var oauth_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tables_1.OAuthUser.findOne({
                            where: {
                                client_id: client.id,
                                user_id: user.id,
                            },
                        })];
                    case 1:
                        oauth_user = _a.sent();
                        return [2 /*return*/, (!!oauth_user &&
                                !!oauth_user.minimum_token_issue_time &&
                                oauth_user.minimum_token_issue_time.getSeconds() >= token_issued_at)];
                }
            });
        });
    };
    OAuthModel.prototype.revokeToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var oauth_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tables_1.OAuthUser.findOrCreate({
                            where: {
                                client_id: token.client.id,
                                user_id: token.user.id,
                            },
                            defaults: {
                                client_id: token.client.id,
                                user_id: token.user.id,
                            },
                        })];
                    case 1:
                        oauth_user = (_a.sent())[0];
                        return [4 /*yield*/, oauth_user.update({
                                minimum_token_issue_time: new Date(),
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    OAuthModel.prototype.generateAuthorizationCode = function (client, user, scope) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // return a dummy value - we cannot generate the code here as this method has no access to redirect_uri
                return [2 /*return*/, "abc123"];
            });
        });
    };
    OAuthModel.prototype.getAuthorizationCode = function (authorizationCode) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded_payload, error_3, client, user, expiresAt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, tokens_1.default.decodeToken(token_type_1.default.authorizationCode, authorizationCode)];
                    case 1:
                        decoded_payload = (_a.sent()).payload;
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, false];
                    case 3:
                        if (typeof decoded_payload.client_id !== "string")
                            return [2 /*return*/];
                        if (typeof decoded_payload.user_id !== "number")
                            return [2 /*return*/];
                        if (typeof decoded_payload.redirect_uri !== "string")
                            return [2 /*return*/];
                        if (typeof decoded_payload.code_challenge !== "string" &&
                            typeof decoded_payload.code_challenge_method !== "undefined")
                            return [2 /*return*/];
                        if (typeof decoded_payload.code_challenge_method !== "string" &&
                            typeof decoded_payload.code_challenge_method !== "undefined")
                            return [2 /*return*/];
                        if (typeof decoded_payload.exp !== "number")
                            return [2 /*return*/];
                        if (typeof decoded_payload.iat !== "number")
                            return [2 /*return*/];
                        if (!Array.isArray(decoded_payload.scope))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.getClient(decoded_payload.client_id, null)];
                    case 4:
                        client = _a.sent();
                        return [4 /*yield*/, tables_1.User.findByPk(decoded_payload.user_id)];
                    case 5:
                        user = _a.sent();
                        if (!client)
                            return [2 /*return*/];
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.checkAuthorizationCodeRevoked(client, user, decoded_payload.iat)];
                    case 6:
                        if (_a.sent())
                            return [2 /*return*/];
                        expiresAt = new Date(0);
                        expiresAt.setSeconds(decoded_payload.exp);
                        return [2 /*return*/, {
                                authorizationCode: authorizationCode,
                                expiresAt: expiresAt,
                                redirectUri: decoded_payload.redirect_uri,
                                scope: decoded_payload.scope,
                                client: client,
                                user: user,
                                codeChallenge: decoded_payload.code_challenge,
                                codeChallengeMethod: decoded_payload.code_challenge_method,
                            }];
                }
            });
        });
    };
    OAuthModel.prototype.saveAuthorizationCode = function (code, client, user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!user.id)
                            return [2 /*return*/, false];
                        _a = code;
                        return [4 /*yield*/, tokens_1.default.createToken(token_type_1.default.authorizationCode, user, {
                                scope: code.scope === undefined ? [] : typeof code.scope === "string" ? [code.scope] : code.scope,
                                lifetime: 60,
                                claims: {
                                    code_challenge: code.codeChallenge,
                                    code_challenge_method: code.codeChallengeMethod,
                                    redirect_uri: code.redirectUri,
                                    client_id: client.id,
                                },
                            })];
                    case 1:
                        _a.authorizationCode = _b.sent();
                        return [2 /*return*/, __assign(__assign({}, code), { client: client, user: user })];
                }
            });
        });
    };
    OAuthModel.prototype.checkAuthorizationCodeRevoked = function (client, user, code_issued_at) {
        return __awaiter(this, void 0, void 0, function () {
            var oauth_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tables_1.OAuthUser.findOne({
                            where: {
                                client_id: client.id,
                                user_id: user.id,
                            },
                        })];
                    case 1:
                        oauth_user = _a.sent();
                        return [2 /*return*/, (!!oauth_user &&
                                !!oauth_user.minimum_auth_code_issue_time &&
                                oauth_user.minimum_auth_code_issue_time.getSeconds() >= code_issued_at)];
                }
            });
        });
    };
    OAuthModel.prototype.revokeAuthorizationCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var oauth_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tables_1.OAuthUser.findOrCreate({
                            where: {
                                client_id: code.client.id,
                                user_id: code.user.id,
                            },
                            defaults: {
                                client_id: code.client.id,
                                user_id: code.user.id,
                            },
                        })];
                    case 1:
                        oauth_user = (_a.sent())[0];
                        return [4 /*yield*/, oauth_user.update({
                                minimum_auth_code_issue_time: new Date(),
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    OAuthModel.prototype.getClient = function (clientId, clientSecret) {
        return __awaiter(this, void 0, void 0, function () {
            var client, secretMatches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tables_1.OAuthClient.findByPk(clientId)];
                    case 1:
                        client = _a.sent();
                        if (!client)
                            return [2 /*return*/, false];
                        if (clientSecret === null)
                            return [2 /*return*/, client];
                        if (!client)
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, hashed_secrets_1.checkTextAgainstHash)({
                                hashed_secret: client.hashedSecret,
                                salt: client.secretSalt,
                            }, clientSecret)];
                    case 2:
                        secretMatches = _a.sent();
                        if (!secretMatches)
                            return [2 /*return*/];
                        return [2 /*return*/, client];
                }
            });
        });
    };
    OAuthModel.prototype.validateScope = function (user, client, scope) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (typeof scope === "undefined")
                    return [2 /*return*/];
                if (scope === "")
                    return [2 /*return*/];
                if (Array.isArray(scope) && scope.length === 0)
                    return [2 /*return*/];
                if (!Array.isArray(client.allowedScopes))
                    return [2 /*return*/];
                if (typeof scope === "string") {
                    scope = [scope];
                }
                if (!scope.every(function (element) { return client.allowedScopes.includes(element); }))
                    return [2 /*return*/, false];
                return [2 /*return*/, scope];
            });
        });
    };
    OAuthModel.prototype.validateRedirectUri = function (redirectUri, client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!client.redirectUris)
                    return [2 /*return*/, false];
                if (typeof client.redirectUris === "string")
                    return [2 /*return*/, redirectUri === client.redirectUris];
                return [2 /*return*/, client.redirectUris.includes(redirectUri)];
            });
        });
    };
    OAuthModel.prototype.verifyScope = function (token, scope) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenScope;
            return __generator(this, function (_a) {
                if ((Array.isArray(scope) && scope.length === 0) || scope === "" || typeof scope === "undefined")
                    return [2 /*return*/, true];
                if (typeof token.scope === "undefined")
                    return [2 /*return*/, false];
                if ((Array.isArray(token.scope) && token.scope.length === 0) ||
                    token.scope === "" ||
                    typeof token.scope === "undefined")
                    return [2 /*return*/, false];
                if (typeof scope === "string") {
                    if (typeof token.scope === "string") {
                        if (scope.length > 1)
                            return [2 /*return*/, false];
                        return [2 /*return*/, token.scope === scope];
                    }
                    scope = [scope];
                }
                tokenScope = typeof token.scope === "string" ? [token.scope] : token.scope;
                return [2 /*return*/, scope.every(function (element) { return tokenScope.includes(element); })];
            });
        });
    };
    return OAuthModel;
}());
exports.default = new OAuthModel();
