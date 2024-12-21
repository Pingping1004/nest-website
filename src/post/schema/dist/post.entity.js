"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Post = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../../users/schema/user.entity");
var picture_entity_1 = require("../schema/picture.entity");
var comment_entity_1 = require("../comment/comment.entity");
var Post = /** @class */ (function () {
    function Post() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Post.prototype, "postId");
    __decorate([
        typeorm_1.Column()
    ], Post.prototype, "title");
    __decorate([
        typeorm_1.Column()
    ], Post.prototype, "content");
    __decorate([
        typeorm_1.OneToMany(function () { return picture_entity_1.Picture; }, function (picture) { return picture.post; }, {
            cascade: true,
            eager: true
        })
    ], Post.prototype, "pictures");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.posts; }, {
            onDelete: 'CASCADE',
            eager: true
        }),
        typeorm_1.JoinColumn({ name: 'authorId' }) // Foreign key column in the database
    ], Post.prototype, "author");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', "default": function () { return 'CURRENT_TIMESTAMP'; } })
    ], Post.prototype, "date");
    __decorate([
        typeorm_1.Column({ "default": 'user' })
    ], Post.prototype, "audience");
    __decorate([
        typeorm_1.Column({ "default": 0 })
    ], Post.prototype, "postLikeCount");
    __decorate([
        typeorm_1.OneToMany(function () { return comment_entity_1.Comment; }, function (comment) { return comment.post; }, {
            onDelete: 'CASCADE',
            eager: true
        })
    ], Post.prototype, "comments");
    Post = __decorate([
        typeorm_1.Entity('post'),
        typeorm_1.Index('IDX_AUTHOR_ID', ["author"])
    ], Post);
    return Post;
}());
exports.Post = Post;
