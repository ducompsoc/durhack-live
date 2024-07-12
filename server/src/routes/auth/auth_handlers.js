"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("config");
var zod_1 = require("zod");
var http_errors_1 = require("http-errors");
var decorators_1 = require("@/auth/decorators");
var hashed_secrets_1 = require("@/auth/hashed_secrets");
var errors_1 = require("@/common/errors");
var mailgun_1 = require("@/common/mailgun");
var response_1 = require("@/common/response");
var tables_1 = require("@/database/tables");
var config_2 = require("@/common/schema/config");
var oauth_client_1 = require("@/socket/oauth_client");
var model_1 = require("./oauth/model");
var AuthHandlers = function () {
    var _a;
    var _staticExtraInitializers = [];
    var _static_handleGetSocketToken_decorators;
    return _a = /** @class */ (function () {
            function AuthHandlers() {
            }
            AuthHandlers.handleCheckEmail = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var email, result, payload;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                email = _a.check_email_schema.parse(request.body).email;
                                return [4 /*yield*/, tables_1.User.findOneByEmail(email, new errors_1.NullError("Email isn't associated with any user."))];
                            case 1:
                                result = _b.sent();
                                payload = { exists: true, password_set: result.hashed_password !== null };
                                response.status(200);
                                response.json({ status: response.statusCode, message: "OK", data: payload });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AuthHandlers.handleCheckVerifyCode = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var _b, email, verify_code, found_user;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = _a.check_verify_code_schema.parse(request.body), email = _b.email, verify_code = _b.verify_code;
                                return [4 /*yield*/, tables_1.User.findOneByEmail(email, new errors_1.NullError())];
                            case 1:
                                found_user = _c.sent();
                                _a.ensureCorrectVerifyCode(found_user, verify_code);
                                (0, response_1.sendStandardResponse)(response, 200);
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AuthHandlers.verifyCodeExpired = function (user) {
                return new Date().valueOf() - user.verify_sent_at.valueOf() > 900000;
            };
            AuthHandlers.ensureCorrectVerifyCode = function (user, verify_code_attempt) {
                if (config_1.default.get("flags.skipEmailVerification") === true) {
                    return;
                }
                if (!user.verify_code || !user.verify_sent_at) {
                    throw new http_errors_1.default.Conflict("Verify code not set.");
                }
                // verification codes are valid for 15 minutes (in milliseconds)
                if (_a.verifyCodeExpired(user)) {
                    throw new http_errors_1.default.BadRequest("Verify code expired.");
                }
                if (user.verify_code !== verify_code_attempt) {
                    throw new http_errors_1.default.BadRequest("Verify code incorrect.");
                }
            };
            AuthHandlers.handleLoginSuccess = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var redirect_to;
                    return __generator(this, function (_b) {
                        if (!request.user) {
                            return [2 /*return*/, response.redirect("/login")];
                        }
                        redirect_to = request.session.redirect_to || "/";
                        return [2 /*return*/, response.redirect(redirect_to)];
                    });
                });
            };
            AuthHandlers.sendVerifyCode = function (user) {
                return __awaiter(this, void 0, void 0, function () {
                    var token, _b, domain, sendAsDomain;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, hashed_secrets_1.randomBytesAsync)(3)];
                            case 1:
                                token = (_c.sent()).toString("hex").toUpperCase();
                                return [4 /*yield*/, user.update({
                                        verify_code: token,
                                        verify_sent_at: new Date(),
                                    })];
                            case 2:
                                _c.sent();
                                _b = config_2.mailgun_options_schema.parse(config_1.default.get("mailgun")), domain = _b.domain, sendAsDomain = _b.sendAsDomain;
                                return [4 /*yield*/, mailgun_1.default.messages.create(domain, {
                                        from: "DurHack <noreply@".concat(sendAsDomain, ">"),
                                        "h:Reply-To": "hello@durhack.com",
                                        to: user.email,
                                        subject: "Your DurHack verification code is ".concat(user.verify_code),
                                        text: [
                                            "Hi ".concat(user.preferred_name, ","),
                                            "Welcome to DurHack! Your verification code is ".concat(user.verify_code),
                                            "If you have any questions, please chat to one of us.",
                                            "Thanks,",
                                            "The DurHack Team",
                                            "(If you didn't request this code, you can safely ignore this email.)",
                                        ].join("\n\n"),
                                    })];
                            case 3:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            AuthHandlers.handleVerifyEmail = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var _b, email, send_again, user, error_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = _a.sign_up_payload_schema.parse(request.body), email = _b.email, send_again = _b.send_again;
                                return [4 /*yield*/, tables_1.User.findOneByEmail(email, new errors_1.NullError("Email address not recognised."))];
                            case 1:
                                user = _c.sent();
                                if (!send_again && user.verify_code && !_a.verifyCodeExpired(user)) {
                                    return [2 /*return*/, (0, response_1.sendStandardResponse)(response, 304, "Verification email already sent")];
                                }
                                _c.label = 2;
                            case 2:
                                _c.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, _a.sendVerifyCode(user)];
                            case 3:
                                _c.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                error_1 = _c.sent();
                                throw http_errors_1.default.BadGateway("Failed to send verification email.");
                            case 5: return [2 /*return*/, (0, response_1.sendStandardResponse)(response, 200, "Verification email sent.")];
                        }
                    });
                });
            };
            AuthHandlers.handleSetPassword = function (request, response, next) {
                return __awaiter(this, void 0, void 0, function () {
                    var _b, email, password, verify_code, found_user, password_salt, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _b = _a.set_password_schema.parse(request.body), email = _b.email, password = _b.password, verify_code = _b.verify_code;
                                return [4 /*yield*/, tables_1.User.findOneByEmail(email, new errors_1.NullError("It looks like you didn't fill in the sign-up form - try another email       address, or speak to a DurHack volunteer if you believe this is an error!"))];
                            case 1:
                                found_user = _d.sent();
                                _a.ensureCorrectVerifyCode(found_user, verify_code);
                                return [4 /*yield*/, (0, hashed_secrets_1.randomBytesAsync)(16)];
                            case 2:
                                password_salt = _d.sent();
                                _c = found_user;
                                return [4 /*yield*/, (0, hashed_secrets_1.hashText)(password, password_salt)];
                            case 3:
                                _c.hashed_password = _d.sent();
                                found_user.password_salt = password_salt;
                                return [4 /*yield*/, found_user.save()];
                            case 4:
                                _d.sent();
                                return [2 /*return*/, next()];
                        }
                    });
                });
            };
            AuthHandlers.handleGetSocketToken = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var auth_token, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _c = (_b = model_1.default).generateAccessToken;
                                return [4 /*yield*/, (0, oauth_client_1.default)()];
                            case 1: return [4 /*yield*/, _c.apply(_b, [_d.sent(), request.user, "socket:state"])];
                            case 2:
                                auth_token = _d.sent();
                                response.status(200);
                                response.json({ status: 200, message: "Token generation OK", token: auth_token });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return AuthHandlers;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _static_handleGetSocketToken_decorators = [decorators_1.requireLoggedIn];
            __esDecorate(_a, null, _static_handleGetSocketToken_decorators, { kind: "method", name: "handleGetSocketToken", static: true, private: false, access: { has: function (obj) { return "handleGetSocketToken" in obj; }, get: function (obj) { return obj.handleGetSocketToken; } }, metadata: _metadata }, null, _staticExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.check_email_schema = (__runInitializers(_a, _staticExtraInitializers), zod_1.z.object({
            email: zod_1.z.string().email(),
        })),
        _a.check_verify_code_schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            verify_code: zod_1.z.string().length(6),
        }),
        _a.sign_up_payload_schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            send_again: zod_1.z.boolean().default(false),
        }),
        _a.set_password_schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            verify_code: zod_1.z.string().length(6),
        }),
        _a;
}();
exports.default = AuthHandlers;
