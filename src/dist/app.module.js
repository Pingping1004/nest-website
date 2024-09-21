"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var auth_module_1 = require("./auth/auth.module");
var users_module_1 = require("./users/users.module");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("./users/schema/user.entity");
var google_strategy_1 = require("./auth/strategy/google.strategy");
var post_module_1 = require("./post/post.module");
var post_entity_1 = require("./post/schema/post.entity");
var admin_module_1 = require("./admin/admin.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    var _a;
    AppModule = __decorate([
        common_1.Module({
            imports: [
                // Config .env file
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env'
                }),
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                post_module_1.PostModule,
                // Connect to typeorm database
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: process.env.DB_HOST,
                    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '3306', 10),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: [user_entity_1.User, post_entity_1.Post],
                    synchronize: true
                }),
                post_module_1.PostModule,
                admin_module_1.AdminModule
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService, google_strategy_1.GoogleStrategy]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
