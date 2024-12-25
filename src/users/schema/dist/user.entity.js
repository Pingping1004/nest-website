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
var post_entity_1 = require("../../post/schema/post.entity");
var postLike_entity_1 = require("../../post/like/postLike.entity");
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.setDefaultEmail = function () {
        if (!this.email) {
            this.email = "placeholder" + Math.floor(Math.random() * 100000) + "@example.com";
        }
    };
    User.prototype.setDefaultDisplayName = function () {
        if (!this.displayName) {
            this.displayName = this.username;
        }
    };
    User.prototype.setDefaultGoogleId = function () {
        if (!this.googleId) {
            this.googleId = "placeholder_google_id_" + Math.floor(Math.random() * 100000);
        }
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], User.prototype, "userId");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], User.prototype, "username");
    __decorate([
        typeorm_1.Column({ unique: true, nullable: true, "default": null })
    ], User.prototype, "email");
    __decorate([
        typeorm_1.BeforeInsert()
    ], User.prototype, "setDefaultEmail");
    __decorate([
        typeorm_1.Column({ length: 70, nullable: true })
    ], User.prototype, "displayName");
    __decorate([
        typeorm_1.BeforeInsert()
    ], User.prototype, "setDefaultDisplayName");
    __decorate([
        typeorm_1.Column({ length: 70, nullable: true })
    ], User.prototype, "password");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], User.prototype, "profilePicture");
    __decorate([
        typeorm_1.Column({ type: 'enum', "enum": Role, "default": Role.user })
    ], User.prototype, "role");
    __decorate([
        typeorm_1.Column({ unique: true, nullable: true, "default": null })
    ], User.prototype, "googleId");
    __decorate([
        typeorm_1.BeforeInsert()
    ], User.prototype, "setDefaultGoogleId");
    __decorate([
        typeorm_1.OneToMany(function () { return post_entity_1.Post; }, function (post) { return post.author; })
    ], User.prototype, "posts");
    __decorate([
        typeorm_1.OneToMany(function () { return postLike_entity_1.PostLike; }, function (postLike) { return postLike.userId; })
    ], User.prototype, "postLikes");
    User = __decorate([
        typeorm_1.Entity('user')
    ], User);
    return User;
}());
exports.User = User;
