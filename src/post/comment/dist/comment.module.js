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
var post_service_1 = require("../post.service");
var CommentModule = /** @class */ (function () {
    function CommentModule() {
    }
    CommentModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment, post_entity_1.Post]),
            ],
            providers: [comment_service_1.CommentService, post_service_1.PostService],
            controllers: [comment_controller_1.CommentController]
        })
    ], CommentModule);
    return CommentModule;
}());
exports.CommentModule = CommentModule;
