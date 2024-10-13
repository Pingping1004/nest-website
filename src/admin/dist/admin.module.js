"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminModule = void 0;
var common_1 = require("@nestjs/common");
var admin_service_1 = require("./admin.service");
var admin_controller_1 = require("./admin.controller");
var users_module_1 = require("../users/users.module");
var users_service_1 = require("../users/users.service");
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        common_1.Module({
            imports: [
                users_module_1.UsersModule,
            ],
            controllers: [admin_controller_1.AdminController],
            providers: [admin_service_1.AdminService, users_service_1.UsersService]
        })
    ], AdminModule);
    return AdminModule;
}());
exports.AdminModule = AdminModule;
