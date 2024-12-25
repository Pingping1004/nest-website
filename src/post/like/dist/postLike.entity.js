"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PostLike = void 0;
var typeorm_1 = require("typeorm");
var post_entity_1 = require("../schema/post.entity");
var user_entity_1 = require("../../users/schema/user.entity");
var PostLike = /** @class */ (function () {
    function PostLike() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], PostLike.prototype, "postLikeId");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.postLikes; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'userId' })
    ], PostLike.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function () { return post_entity_1.Post; }, function (post) { return post.postLikes; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'postId' })
    ], PostLike.prototype, "postId");
    PostLike = __decorate([
        typeorm_1.Entity('postLike')
    ], PostLike);
    return PostLike;
}());
exports.PostLike = PostLike;
