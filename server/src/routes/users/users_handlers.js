"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = require("http-errors");
var UsersHandlers = /** @class */ (function () {
    function UsersHandlers() {
    }
    UsersHandlers.getUsersList = function (request, response) {
        throw new http_errors_1.default.NotImplemented();
    };
    UsersHandlers.createUser = function (request, response) {
        throw new http_errors_1.default.NotImplemented();
    };
    UsersHandlers.getUserDetails = function (request, response) {
        throw new http_errors_1.default.NotImplemented();
    };
    UsersHandlers.patchUserDetails = function (request, response) {
        throw new http_errors_1.default.NotImplemented();
    };
    UsersHandlers.deleteUser = function (request, response) {
        throw new http_errors_1.default.NotImplemented();
    };
    return UsersHandlers;
}());
exports.default = UsersHandlers;
