"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AdminController = void 0;
var common_1 = require("@nestjs/common");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_entity_1 = require("../users/schema/user.entity");
var role_auth_guard_1 = require("../auth/role-auth.guard");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var date_fns_1 = require("date-fns");
var AdminController = /** @class */ (function () {
    function AdminController(usersService, recordService) {
        this.usersService = usersService;
        this.recordService = recordService;
    }
    AdminController.prototype.getAllUsersForAdmin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, userId, role, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.getAllUsers()];
                    case 1:
                        users = _a.sent();
                        userId = req.user.userId;
                        role = req.user.role;
                        if (!userId || role !== user_entity_1.Role.admin) {
                            return [2 /*return*/, res.status(402).send('Forbidden: You do not have an access to this page')];
                        }
                        res.render('dashboard', { userId: userId, role: role, users: users });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to render all user for admin page:', error_1.message);
                        res.status(500).send('Internal Server Error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminController.prototype.getAllUsersJson = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var users, userId, role, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.getAllUsers()];
                    case 1:
                        users = _a.sent();
                        userId = req.user.userId;
                        role = req.user.role;
                        // Send user data as JSON
                        return [2 /*return*/, res.status(200).json({ userId: userId, role: role, users: users })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Failed to fetch all users:', error_2.message);
                        res.status(500).json({ message: 'Internal Server Error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminController.prototype.updateUser = function (userId, updatedUserDto, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.usersService.updateUser(userId, updatedUserDto)];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser) {
                            return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                        }
                        console.log('Updated user detail', updatedUser);
                        return [2 /*return*/, res.status(200).json({ message: 'User update successfully' })];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Failed to update user in controller', error_3.message);
                        return [2 /*return*/, res.status(500).json({ message: 'Failed to update user' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminController.prototype.deleteUser = function (userId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedUser, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.usersService.findByUserId(userId)];
                    case 1:
                        deletedUser = _a.sent();
                        if (!deletedUser) {
                            return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                        }
                        return [4 /*yield*/, this.usersService.deleteUser(userId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ message: 'Delete user ID ' + userId + ' successfully' })];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Failed to delete user in controller', error_4.message);
                        throw new common_1.InternalServerErrorException('Failed to delete user');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AdminController.prototype.renderAllRecords = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, userId, role, records, formattedRecords, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = req.user;
                        userId = req.user.userId;
                        role = req.user.role;
                        return [4 /*yield*/, this.recordService.getAllRecords()];
                    case 1:
                        records = _a.sent();
                        formattedRecords = records.map(function (record) { return (__assign(__assign({}, record), { formattedDate: date_fns_1.format(record.date, 'HH:mm - dd/MM/yy') })); });
                        console.log('Record on page:', records);
                        res.render('record', { user: user, records: formattedRecords, userId: userId, role: role });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Failed to render activity logs', error_5.message);
                        res.status(500).send('Internal Server Error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_auth_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.Role.admin),
        common_1.Get('dashboard'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], AdminController.prototype, "getAllUsersForAdmin");
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_auth_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.Role.admin),
        common_1.Get('/dashboard/users') // Different endpoint for fetching JSON data
        ,
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], AdminController.prototype, "getAllUsersJson");
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_auth_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.Role.admin),
        common_1.Patch('update/:userId'),
        __param(0, common_1.Param('userId', common_1.ParseIntPipe)), __param(1, common_1.Body()), __param(2, common_1.Req()), __param(3, common_1.Res())
    ], AdminController.prototype, "updateUser");
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_auth_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.Role.admin),
        common_1.Delete('delete/:userId'),
        __param(0, common_1.Param('userId')), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], AdminController.prototype, "deleteUser");
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_auth_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.Role.admin),
        common_1.Get('/activity-log'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], AdminController.prototype, "renderAllRecords");
    AdminController = __decorate([
        common_1.Controller('admin')
    ], AdminController);
    return AdminController;
}());
exports.AdminController = AdminController;
