"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommentLike = void 0;
var typeorm_1 = require("typeorm");
var post_entity_1 = require("../../schema/post.entity");
var user_entity_1 = require("../../../users/schema/user.entity");
var comment_entity_1 = require("./comment.entity");
var CommentLike = /** @class */ (function () {
    function CommentLike() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], CommentLike.prototype, "commentLikeId");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.commentLikes; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'userId' })
    ], CommentLike.prototype, "userId");
    __decorate([
        typeorm_1.ManyToOne(function () { return post_entity_1.Post; }, function (post) { return post.commentLikes; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'postId' })
    ], CommentLike.prototype, "postId");
    __decorate([
        typeorm_1.ManyToOne(function () { return comment_entity_1.Comment; }, function (comment) { return comment.commentLikes; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'commentId' })
    ], CommentLike.prototype, "commentId");
    CommentLike = __decorate([
        typeorm_1.Entity('commentLike')
    ], CommentLike);
    return CommentLike;
}());
exports.CommentLike = CommentLike;
