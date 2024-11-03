"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Picture = void 0;
var typeorm_1 = require("typeorm");
var post_entity_1 = require("../schema/post.entity");
var class_transformer_1 = require("class-transformer");
var Picture = /** @class */ (function () {
    function Picture() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Picture.prototype, "id");
    __decorate([
        typeorm_1.Column({ nullable: true, length: 300 })
    ], Picture.prototype, "pictureUrl");
    __decorate([
        class_transformer_1.Exclude(),
        typeorm_1.ManyToOne(function () { return post_entity_1.Post; }, function (post) { return post.pictures; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn({ name: 'postId' })
    ], Picture.prototype, "post");
    Picture = __decorate([
        typeorm_1.Entity('pictures')
    ], Picture);
    return Picture;
}());
exports.Picture = Picture;
