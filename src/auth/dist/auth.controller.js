"use strict";
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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var local_auth_guard_1 = require("./local-auth.guard");
var google_auth_guard_1 = require("./google-auth.guard");
var jwt_auth_guard_1 = require("./jwt-auth.guard");
var role_auth_guard_1 = require("./role-auth.guard");
var user_entity_1 = require("../users/schema/user.entity");
var roles_decorator_1 = require("./roles.decorator");
var AuthController = /** @class */ (function () {
    function AuthController(authService, postService, userService) {
        this.authService = authService;
        this.postService = postService;
        this.userService = userService;
    }
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, userId, role, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Req user object from login', req.user);
                        return [4 /*yield*/, this.authService.login(req.user)];
                    case 1:
                        accessToken = (_a.sent()).accessToken;
                        //save to cookie
                        res.cookie('access_token', accessToken, {
                            httpOnly: true
                        });
                        userId = req.user.userId;
                        role = req.user.role;
                        console.log('Role from login user:', role);
                        res.json({ userId: userId, role: role });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Login failed', error_1.message);
                        throw new common_1.HttpException('Login failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.renderAuthIndex = function (userId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userIdFromParam, userIdFromToken, role, fullUser, posts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('ID from URL param before parsing:', userId);
                        userIdFromParam = parseInt(userId, 10);
                        // Check if parsing was successful
                        if (isNaN(userIdFromParam)) {
                            console.error('Failed to parse user ID from URL parameter:', userId);
                            return [2 /*return*/, res.status(400).send('Invalid user ID')];
                        }
                        userIdFromToken = req.user.userId;
                        role = req.user.role;
                        return [4 /*yield*/, this.userService.findByUserId(userIdFromToken)];
                    case 1:
                        fullUser = _a.sent();
                        if (!fullUser) {
                            return [2 /*return*/, res.status(404).send('User not found')];
                        }
                        return [4 /*yield*/, this.postService.getPostForUser()];
                    case 2:
                        posts = _a.sent();
                        console.log('All render post for user:', posts);
                        if (userIdFromParam !== userIdFromToken) {
                            return [2 /*return*/, res.status(403).send('Forbidden')];
                        }
                        res.render('index', { userID: userIdFromToken, role: role, posts: posts, user: fullUser });
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.renderAdminAuthIndex = function (userId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userIdFromParam, user, userIdFromToken, role, fullUser, posts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userIdFromParam = parseInt(userId, 10);
                        // Check if parsing was successful
                        if (isNaN(userIdFromParam)) {
                            console.error('Failed to parse user ID for admin from URL parameter:', userId);
                            return [2 /*return*/, res.status(400).send('Invalid user ID')];
                        }
                        if (req.user.role !== 'admin') {
                            return [2 /*return*/, res.status(403).send('Forbidden: Admin access only')];
                        }
                        user = req.user;
                        userIdFromToken = req.user.userId;
                        role = req.user.role;
                        return [4 /*yield*/, this.userService.findByUserId(userIdFromToken)];
                    case 1:
                        fullUser = _a.sent();
                        console.log('Full user profile object in admin auth', fullUser);
                        if (!fullUser) {
                            return [2 /*return*/, res.status(404).send('User not found')];
                        }
                        return [4 /*yield*/, this.postService.getAllPosts()];
                    case 2:
                        posts = _a.sent();
                        if (userIdFromParam !== req.user.userId) {
                            return [2 /*return*/, res.status(403).send('Forbidden')];
                        }
                        res.render('admin', { userID: userIdFromToken, role: role, posts: posts, user: fullUser });
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.googleAuthRedirect = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, accessToken, userId, redirectUrl, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.authService.googleLogin(req)];
                    case 1:
                        _a = _b.sent(), user = _a.user, accessToken = _a.accessToken;
                        userId = user.userId;
                        console.log('user and userId for google login', user, userId);
                        redirectUrl = user.role === 'admin' ? "/auth/admin/index/" + userId : "/auth/index/" + userId;
                        //save to cookie
                        res.cookie('access_token', accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: 3600000
                        });
                        return [2 /*return*/, res.redirect(redirectUrl)];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error in Google auth redirect:', error_2);
                        return [2 /*return*/, res.status(500).send('Internal server error during Google authentication')];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    res.clearCookie('access_token', {
                        httpOnly: true
                    });
                    console.log('Logout function is activated');
                    return [2 /*return*/, res.status(common_1.HttpStatus.OK).json({ message: 'Logout successful' })];
                }
                catch (error) {
                    return [2 /*return*/, res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' })];
                }
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
        common_1.Post('/login'),
        __param(0, common_1.Req()), __param(1, common_1.Res({ passthrough: true }))
    ], AuthController.prototype, "login");
    __decorate([
        common_1.Get('index/:userId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        roles_decorator_1.Roles(user_entity_1.Role.user, user_entity_1.Role.admin),
        __param(0, common_1.Param('userId')), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], AuthController.prototype, "renderAuthIndex");
    __decorate([
        common_1.Get('admin/index/:userId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, role_auth_guard_1.RolesGuard),
        roles_decorator_1.Roles(user_entity_1.Role.admin),
        __param(0, common_1.Param('userId')), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], AuthController.prototype, "renderAdminAuthIndex");
    __decorate([
        common_1.Get('google/callback'),
        common_1.UseGuards(google_auth_guard_1.GoogleAuthGuard),
        __param(0, common_1.Req()), __param(1, common_1.Res({ passthrough: true }))
    ], AuthController.prototype, "googleAuthRedirect");
    __decorate([
        common_1.Get('/logout'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], AuthController.prototype, "logout");
    AuthController = __decorate([
        common_1.Controller('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
