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
var zod_1 = require("zod");
var config_1 = require("config");
var http_errors_1 = require("http-errors");
var decorators_1 = require("@/auth/decorators");
var DiscordHandlers = function () {
    var _a;
    var _staticExtraInitializers = [];
    var _static_handleBeginDiscordOAuthFlow_decorators;
    var _static_handleDiscordOAuthCallback_decorators;
    return _a = /** @class */ (function () {
            function DiscordHandlers() {
            }
            DiscordHandlers.handleBeginDiscordOAuthFlow = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        response.redirect("https://discord.com/oauth2/authorize?client_id=".concat(config_1.default.get("discord.clientId"), "&redirect_uri=").concat(encodeURIComponent(config_1.default.get("discord.redirectUri")), "&response_type=code&scope=identify&state=dh"));
                        return [2 /*return*/];
                    });
                });
            };
            DiscordHandlers.handleDiscordOAuthCallback = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var _b, code, state, discordApiBase, access_code_exchange_payload, encoded_access_code_exchange_payload, discord_access_token_response, access_token, _c, _d, discord_profile_response, discord_profile;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _b = _a.discord_access_code_schema.parse(request.query), code = _b.code, state = _b.state;
                                discordApiBase = config_1.default.get("discord.apiEndpoint");
                                access_code_exchange_payload = {
                                    client_id: config_1.default.get("discord.clientId"),
                                    client_secret: config_1.default.get("discord.clientSecret"),
                                    grant_type: "authorization_code",
                                    code: code,
                                    redirect_uri: config_1.default.get("discord.redirectUri"),
                                };
                                encoded_access_code_exchange_payload = new URLSearchParams(access_code_exchange_payload);
                                return [4 /*yield*/, fetch("".concat(discordApiBase, "/oauth2/token"), {
                                        method: "POST",
                                        body: encoded_access_code_exchange_payload,
                                    })];
                            case 1:
                                discord_access_token_response = _e.sent();
                                if (!discord_access_token_response.ok) {
                                    throw new http_errors_1.default.BadGateway("Couldn't exchange access code for access token.");
                                }
                                _d = (_c = _a.discord_access_token_schema).parse;
                                return [4 /*yield*/, discord_access_token_response.json()];
                            case 2:
                                access_token = _d.apply(_c, [_e.sent()]).access_token;
                                return [4 /*yield*/, fetch("".concat(discordApiBase, "/oauth2/@me"), {
                                        headers: {
                                            Authorization: "Bearer ".concat(access_token),
                                        },
                                    })];
                            case 3:
                                discord_profile_response = _e.sent();
                                if (!discord_profile_response.ok) {
                                    throw new http_errors_1.default.BadGateway("Failed to read your Discord profile.");
                                }
                                return [4 /*yield*/, discord_profile_response.json()];
                            case 4:
                                discord_profile = (_e.sent());
                                if (!request.user)
                                    throw new Error(); // should never occur due to decorator
                                return [4 /*yield*/, request.user.update({
                                        discord_id: discord_profile.user.id,
                                        discord_name: discord_profile.user.username,
                                    })];
                            case 5:
                                _e.sent();
                                response.redirect(config_1.default.get("discord.inviteLink"));
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return DiscordHandlers;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _static_handleBeginDiscordOAuthFlow_decorators = [decorators_1.requireLoggedIn];
            _static_handleDiscordOAuthCallback_decorators = [decorators_1.requireLoggedIn];
            __esDecorate(_a, null, _static_handleBeginDiscordOAuthFlow_decorators, { kind: "method", name: "handleBeginDiscordOAuthFlow", static: true, private: false, access: { has: function (obj) { return "handleBeginDiscordOAuthFlow" in obj; }, get: function (obj) { return obj.handleBeginDiscordOAuthFlow; } }, metadata: _metadata }, null, _staticExtraInitializers);
            __esDecorate(_a, null, _static_handleDiscordOAuthCallback_decorators, { kind: "method", name: "handleDiscordOAuthCallback", static: true, private: false, access: { has: function (obj) { return "handleDiscordOAuthCallback" in obj; }, get: function (obj) { return obj.handleDiscordOAuthCallback; } }, metadata: _metadata }, null, _staticExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        // a discord access code provided via redirect query parameter is exchanged for an access token
        _a.discord_access_code_schema = (__runInitializers(_a, _staticExtraInitializers), zod_1.z.object({
            code: zod_1.z.string(),
            state: zod_1.z.string(),
        })),
        // a discord access token represents some privileged claims to access a discord user's info
        _a.discord_access_token_schema = zod_1.z.object({
            access_token: zod_1.z.string(),
            token_type: zod_1.z.literal("Bearer"),
            expires_in: zod_1.z.number(),
            refresh_token: zod_1.z.string(),
            scope: zod_1.z.string(),
        }),
        _a;
}();
exports.default = DiscordHandlers;
