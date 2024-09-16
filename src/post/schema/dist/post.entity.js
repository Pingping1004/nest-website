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
        typeorm_1.Column()
    ], Post.prototype, "pictureContent");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.posts; }),
        typeorm_1.JoinColumn({ name: 'authorId' }) // Foreign key column in the database
    ], Post.prototype, "author");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', "default": function () { return 'CURRENT_TIMESTAMP '; } })
    ], Post.prototype, "date");
    Post = __decorate([
        typeorm_1.Entity('post'),
        typeorm_1.Index('IDX_AUTHOR_ID', ["authorId"])
    ], Post);
    return Post;
}());
exports.Post = Post;
