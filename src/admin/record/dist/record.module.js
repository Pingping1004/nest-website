"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RecordModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var record_service_1 = require("./record.service");
var record_entity_1 = require("./entities/record.entity");
var users_module_1 = require("../../users/users.module");
var users_service_1 = require("../../users/users.service");
var user_entity_1 = require("../../users/schema/user.entity");
var post_entity_1 = require("../../post/schema/post.entity");
var RecordModule = /** @class */ (function () {
    function RecordModule() {
    }
    RecordModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, post_entity_1.Post, record_entity_1.Records]),
                users_module_1.UsersModule,
            ],
            // controllers: [RecordController],
            providers: [record_service_1.RecordService, users_service_1.UsersService],
            exports: [record_service_1.RecordService, typeorm_1.TypeOrmModule]
        })
    ], RecordModule);
    return RecordModule;
}());
exports.RecordModule = RecordModule;
