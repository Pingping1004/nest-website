"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CommentModule = void 0;
var common_1 = require("@nestjs/common");
var comment_service_1 = require("./comment.service");
var comment_controller_1 = require("./comment.controller");
var typeorm_1 = require("@nestjs/typeorm");
var comment_entity_1 = require("./schema/comment.entity");
var post_entity_1 = require("../schema/post.entity");
var user_entity_1 = require("../../users/schema/user.entity");
var post_service_1 = require("../post.service");
var users_service_1 = require("../../users/users.service");
var users_module_1 = require("../../users/users.module");
var post_module_1 = require("../post.module");
var postLike_entity_1 = require("../like/postLike.entity");
var commentLike_entity_1 = require("./schema/commentLike.entity");
var CommentModule = /** @class */ (function () {
    function CommentModule() {
    }
    CommentModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment, post_entity_1.Post, user_entity_1.User, postLike_entity_1.PostLike, commentLike_entity_1.CommentLike]),
                post_module_1.PostModule,
                users_module_1.UsersModule,
            ],
            providers: [comment_service_1.CommentService, post_service_1.PostService, users_service_1.UsersService],
            controllers: [comment_controller_1.CommentController],
            exports: [comment_service_1.CommentService]
        })
    ], CommentModule);
    return CommentModule;
}());
exports.CommentModule = CommentModule;
