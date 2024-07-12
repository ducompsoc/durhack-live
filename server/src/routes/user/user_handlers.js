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
var pick_1 = require("lodash/pick");
var zod_1 = require("zod");
var decorators_1 = require("@/auth/decorators");
var model_enums_1 = require("@/common/model_enums");
var UserHandlers = function () {
    var _a;
    var _staticExtraInitializers = [];
    var _static_getUserWithDetails_decorators;
    var _static_patchUserDetails_decorators;
    var _static_checkUserIn_decorators;
    return _a = /** @class */ (function () {
            function UserHandlers() {
            }
            UserHandlers.pickUserWithDetailsFields = function (user) {
                return (0, pick_1.default)(user, "email", "preferred_name", "role", "age", "phone_number", "university", "graduation_year", "ethnicity", "gender", "h_UK_consent", "h_UK_marketing", "checked_in");
            };
            UserHandlers.pickIdentifyingFields = function (user) {
                return (0, pick_1.default)(user, "email", "preferred_name", "role");
            };
            UserHandlers.getUserWithDetails = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var payload;
                    return __generator(this, function (_b) {
                        payload = _a.pickUserWithDetailsFields(request.user);
                        response.status(200);
                        response.json({ status: response.statusCode, message: "OK", data: payload });
                        return [2 /*return*/];
                    });
                });
            };
            UserHandlers.getUser = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var payload;
                    return __generator(this, function (_b) {
                        payload = _a.pickIdentifyingFields(request.user);
                        response.status(200);
                        response.json({ status: response.statusCode, message: "OK", data: payload });
                        return [2 /*return*/];
                    });
                });
            };
            UserHandlers.patchUserDetails = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var fields_to_update, payload;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                fields_to_update = _a.update_details_payload.parse(request.body);
                                return [4 /*yield*/, request.user.update(fields_to_update)];
                            case 1:
                                _b.sent();
                                payload = _a.pickUserWithDetailsFields(request.user);
                                response.status(200);
                                response.json({ status: response.statusCode, message: "OK", data: payload });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            UserHandlers.checkUserIn = function (request, response) {
                return __awaiter(this, void 0, void 0, function () {
                    var fields_to_update, payload;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                fields_to_update = _a.check_in_payload.parse(request.body);
                                return [4 /*yield*/, request.user.update(fields_to_update)];
                            case 1:
                                _b.sent();
                                payload = _a.pickUserWithDetailsFields(request.user);
                                response.status(200);
                                response.json({ status: response.statusCode, message: "OK", data: payload });
                                return [2 /*return*/];
                        }
                    });
                });
            };
            return UserHandlers;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _static_getUserWithDetails_decorators = [(0, decorators_1.requireScope)("api:user.details")];
            _static_patchUserDetails_decorators = [(0, decorators_1.requireScope)("api:user.details.write")];
            _static_checkUserIn_decorators = [(0, decorators_1.requireScope)("api:user.details.write")];
            __esDecorate(_a, null, _static_getUserWithDetails_decorators, { kind: "method", name: "getUserWithDetails", static: true, private: false, access: { has: function (obj) { return "getUserWithDetails" in obj; }, get: function (obj) { return obj.getUserWithDetails; } }, metadata: _metadata }, null, _staticExtraInitializers);
            __esDecorate(_a, null, _static_patchUserDetails_decorators, { kind: "method", name: "patchUserDetails", static: true, private: false, access: { has: function (obj) { return "patchUserDetails" in obj; }, get: function (obj) { return obj.patchUserDetails; } }, metadata: _metadata }, null, _staticExtraInitializers);
            __esDecorate(_a, null, _static_checkUserIn_decorators, { kind: "method", name: "checkUserIn", static: true, private: false, access: { has: function (obj) { return "checkUserIn" in obj; }, get: function (obj) { return obj.checkUserIn; } }, metadata: _metadata }, null, _staticExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a.abstract_patch_payload = (__runInitializers(_a, _staticExtraInitializers), zod_1.z.object({
            age: zod_1.z.number().min(18),
            phone_number: zod_1.z.string().regex(/^\+?(\d|\s)+$/),
            university: zod_1.z.string(),
            graduation_year: zod_1.z.number().min(2020).max(2030),
            ethnicity: zod_1.z.nativeEnum(model_enums_1.Ethnicity).default(model_enums_1.Ethnicity.pnts),
            gender: zod_1.z.nativeEnum(model_enums_1.Gender).default(model_enums_1.Gender.pnts),
            h_UK_consent: zod_1.z.boolean(),
            h_UK_marketing: zod_1.z.boolean(),
        })),
        _a.check_in_payload = _a.abstract_patch_payload.extend({
            checked_in: zod_1.z.literal(true),
        }),
        _a.update_details_payload = _a.abstract_patch_payload.partial(),
        _a;
}();
exports.default = UserHandlers;
