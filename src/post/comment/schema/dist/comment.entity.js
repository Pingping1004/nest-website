"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Comment = void 0;
var typeorm_1 = require("typeorm");
var post_entity_1 = require("../../schema/post.entity");
var user_entity_1 = require("../../../users/schema/user.entity");
var commentLike_entity_1 = require("./commentLike.entity");
var Comment = /** @class */ (function () {
    function Comment() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Comment.prototype, "commentId");
    __decorate([
        typeorm_1.Column()
    ], Comment.prototype, "content");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', "default": function () { return 'CURRENT_TIMESTAMP'; } })
    ], Comment.prototype, "date");
    __decorate([
        typeorm_1.Column({ "default": 0, nullable: false })
    ], Comment.prototype, "likeCount");
    __decorate([
        typeorm_1.ManyToOne(function () { return post_entity_1.Post; }, function (post) { return post.comments; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'postId' })
    ], Comment.prototype, "post");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.postComments; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'commenterId' })
    ], Comment.prototype, "commenter");
    __decorate([
        typeorm_1.OneToMany(function () { return commentLike_entity_1.CommentLike; }, function (commentLikes) { return commentLikes.commentId; }, {
            onDelete: 'CASCADE'
        })
    ], Comment.prototype, "commentLikes");
    Comment = __decorate([
        typeorm_1.Entity('Comment')
    ], Comment);
    return Comment;
}());
exports.Comment = Comment;
