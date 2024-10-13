"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdatedUserDto = exports.LoginUserDto = exports.SignupUserDto = void 0;
var class_validator_1 = require("class-validator");
var SignupUserDto = /** @class */ (function () {
    function SignupUserDto() {
    }
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], SignupUserDto.prototype, "username");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], SignupUserDto.prototype, "password");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], SignupUserDto.prototype, "role");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], SignupUserDto.prototype, "profilePicture");
    return SignupUserDto;
}());
exports.SignupUserDto = SignupUserDto;
var LoginUserDto = /** @class */ (function () {
    function LoginUserDto() {
    }
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], LoginUserDto.prototype, "username");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], LoginUserDto.prototype, "password");
    return LoginUserDto;
}());
exports.LoginUserDto = LoginUserDto;
var UpdatedUserDto = /** @class */ (function () {
    function UpdatedUserDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdatedUserDto.prototype, "username");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], UpdatedUserDto.prototype, "role");
    return UpdatedUserDto;
}());
exports.UpdatedUserDto = UpdatedUserDto;
