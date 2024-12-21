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
var post_entity_1 = require("../schema/post.entity");
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
        typeorm_1.Column({ "default": 0 })
    ], Comment.prototype, "commentLikeCount");
    __decorate([
        typeorm_1.ManyToOne(function () { return post_entity_1.Post; }, function (post) { return post.comments; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'postId' })
    ], Comment.prototype, "post");
    Comment = __decorate([
        typeorm_1.Entity('Comment')
    ], Comment);
    return Comment;
}());
exports.Comment = Comment;
