"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersModule = void 0;
var common_1 = require("@nestjs/common");
var users_controller_1 = require("./users.controller");
var users_service_1 = require("./users.service");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("./schema/user.entity");
var jwt_1 = require("@nestjs/jwt");
var auth_module_1 = require("../auth/auth.module");
var auth_service_1 = require("../auth/auth.service");
var UsersModule = /** @class */ (function () {
    function UsersModule() {
    }
    UsersModule = __decorate([
        common_1.Module({
            imports: [
                jwt_1.JwtModule,
                common_1.forwardRef(function () { return auth_module_1.AuthModule; }),
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            ],
            controllers: [users_controller_1.UsersController],
            providers: [users_service_1.UsersService, jwt_1.JwtService, auth_service_1.AuthService],
            exports: [users_service_1.UsersService, typeorm_1.TypeOrmModule]
        })
    ], UsersModule);
    return UsersModule;
}());
exports.UsersModule = UsersModule;
