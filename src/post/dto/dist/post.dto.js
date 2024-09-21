"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdatePostDto = exports.CreatePostDto = void 0;
var class_validator_1 = require("class-validator");
var CreatePostDto = /** @class */ (function () {
    function CreatePostDto() {
    }
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], CreatePostDto.prototype, "title");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], CreatePostDto.prototype, "content");
    __decorate([
        class_validator_1.IsString()
    ], CreatePostDto.prototype, "pictureContent");
    return CreatePostDto;
}());
exports.CreatePostDto = CreatePostDto;
var UpdatePostDto = /** @class */ (function () {
    function UpdatePostDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdatePostDto.prototype, "title");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdatePostDto.prototype, "content");
    __decorate([
        class_validator_1.IsString()
    ], UpdatePostDto.prototype, "pictureContent");
    return UpdatePostDto;
}());
exports.UpdatePostDto = UpdatePostDto;
