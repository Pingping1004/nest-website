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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var user_entity_1 = require("./schema/user.entity");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var user_entity_2 = require("./schema/user.entity");
var UsersService = /** @class */ (function () {
    function UsersService(userRepository) {
        this.userRepository = userRepository;
    }
    UsersService.prototype.createUser = function (signupUserDto) {
        return __awaiter(this, void 0, Promise, function () {
            var role, hashedPassword, newUser, savedUser, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        role = user_entity_2.Role.user;
                        console.log('Role of signup user:', role);
                        if (signupUserDto.username.startsWith('admin')) {
                            // signupUserDto.role = 'admin';
                            role = user_entity_2.Role.admin;
                        }
                        return [4 /*yield*/, bcrypt.hash(signupUserDto.password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        newUser = this.userRepository.create(__assign(__assign({}, signupUserDto), { password: hashedPassword, role: role }));
                        return [4 /*yield*/, this.userRepository.save(newUser)];
                    case 2:
                        savedUser = _a.sent();
                        console.log('New signup user:', savedUser);
                        return [2 /*return*/, savedUser];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error creating user:', error_1.message, error_1.stack);
                        throw new common_1.HttpException('Failed to create new user', common_1.HttpStatus.BAD_REQUEST);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.validateUser = function (username, password) {
        return __awaiter(this, void 0, Promise, function () {
            var user, isMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Validating user: " + username);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: ({ username: username })
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        console.log('User found:', username);
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        isMatch = _a.sent();
                        if (isMatch) {
                            return [2 /*return*/, user];
                        }
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.findByUserName = function (username) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Searching for user with username:', username);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: { username: username }
                            })];
                    case 1:
                        user = _a.sent();
                        console.log('User found:', user);
                        if (!user) {
                            throw new common_1.NotFoundException("User with username " + username + " is not found");
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.findByUserId = function (userId) {
        return __awaiter(this, void 0, Promise, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Searching for user with ID:', userId);
                        return [4 /*yield*/, this.userRepository.findOne({
                                where: ({ userId: userId })
                            })];
                    case 1:
                        user = _a.sent();
                        console.log('User found:', user);
                        if (!user) {
                            throw new common_1.NotFoundException("User with ID " + userId + " is not found");
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.userRepository.find()];
                }
                catch (error) {
                    console.error('Failed to get all users', error.message);
                }
                return [2 /*return*/];
            });
        });
    };
    UsersService.prototype.updateUser = function (userId, adminName, updatedUserDto) {
        return __awaiter(this, void 0, Promise, function () {
            var adminUser, user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.findByUserName(adminName)];
                    case 1:
                        adminUser = _a.sent();
                        if (!adminUser) {
                            throw new common_1.UnauthorizedException('Admin user not found');
                        }
                        console.log('Admin who update', adminName);
                        return [4 /*yield*/, this.findByUserId(userId)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        // console.log('Updated user detail', user);
                        Object.assign(user, updatedUserDto);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Failed to update user', error_2.message);
                        throw new common_1.InternalServerErrorException('Failed to update user');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.deleteUser = function (adminName, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var adminUser, user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.findByUserName(adminName)];
                    case 1:
                        adminUser = _a.sent();
                        console.log('Admin who delete', adminName);
                        return [4 /*yield*/, this.findByUserId(userId)];
                    case 2:
                        user = _a.sent();
                        console.log('Deleted user detail:', user);
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        if (user.role === user_entity_2.Role.admin) {
                            throw new common_1.ForbiddenException('Cannot delete other admins');
                        }
                        return [4 /*yield*/, this.userRepository.remove(user)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Failed to delete user,', error_3.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersService.prototype.updateProfile = function (userId, updatedUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOne({
                            where: { userId: userId }
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        user.displayName = updatedUserDto.displayName;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.uploadProfilePicture = function (userId, profilePictureUrl) {
        return __awaiter(this, void 0, Promise, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.findByUserId(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        user.profilePicture = profilePictureUrl;
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Failed to upload profile picture');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User))
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
