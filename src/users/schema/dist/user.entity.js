"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = exports.Role = void 0;
var Role;
(function (Role) {
    Role["user"] = "user";
    Role["admin"] = "admin";
})(Role = exports.Role || (exports.Role = {}));
var typeorm_1 = require("typeorm");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], User.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], User.prototype, "username");
    __decorate([
        typeorm_1.Column({ length: 70 })
    ], User.prototype, "password");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], User.prototype, "profilePicture");
    __decorate([
        typeorm_1.Column({ type: 'enum', "enum": Role, "default": Role.user })
    ], User.prototype, "role");
    __decorate([
        typeorm_1.Column()
    ], User.prototype, "googleId");
    User = __decorate([
        typeorm_1.Entity('user')
    ], User);
    return User;
}());
exports.User = User;
