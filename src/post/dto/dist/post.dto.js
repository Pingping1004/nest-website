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
var class_transformer_1 = require("class-transformer");
var picture_dto_1 = require("./picture.dto");
var CreatePostDto = /** @class */ (function () {
    function CreatePostDto() {
    }
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], CreatePostDto.prototype, "title");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreatePostDto.prototype, "content");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], CreatePostDto.prototype, "audience");
    __decorate([
        class_validator_1.IsArray(),
        class_validator_1.IsOptional(),
        class_validator_1.ValidateNested({ each: true })
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
        class_validator_1.IsNotEmpty(),
        class_validator_1.IsString()
    ], UpdatePostDto.prototype, "audience");
    __decorate([
        class_validator_1.IsArray(),
        class_validator_1.IsOptional(),
        class_transformer_1.Type(function () { return picture_dto_1.PictureDto; })
    ], UpdatePostDto.prototype, "pictureContent");
    return UpdatePostDto;
}());
exports.UpdatePostDto = UpdatePostDto;
