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
exports.PostController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var PostController = /** @class */ (function () {
    function PostController(postService, userService) {
        this.postService = postService;
        this.userService = userService;
    }
    PostController.prototype.createPost = function (createPostDto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, post, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('User ID from request:', req.user);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        userId = req.user.userId;
                        console.log('userId before search the post owner:', userId);
                        return [4 /*yield*/, this.userService.findByUserId(userId)];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        return [4 /*yield*/, this.postService.createPost(createPostDto, userId)];
                    case 3:
                        post = _a.sent();
                        console.log('Post to create:', post);
                        console.log('Author ID from request:', post.author);
                        return [2 /*return*/, post];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Failed to get post in controller', error_1.message);
                        throw new common_1.InternalServerErrorException('Failed to create post');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.getAllPost = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var posts, userId, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.postService.getAllPosts()];
                    case 1:
                        posts = _a.sent();
                        userId = req.user.userId;
                        console.log('userId before get all post and search post owner:', userId);
                        console.log('Post to render(backend controller', posts);
                        // res.render('index', { posts, userId });
                        res.status(200).json({ posts: posts, userId: userId });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Failed to get post in controller', error_2.message);
                        throw new common_1.InternalServerErrorException('Failed to retrieve posts');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.getPostById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.postService.getPostById(id)];
                }
                catch (error) {
                    console.error('Failed to get post in controller', error.message);
                    throw new common_1.NotFoundException('Post not found');
                }
                return [2 /*return*/];
            });
        });
    };
    PostController.prototype.updatePost = function (id, updatePostDto, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, post, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        return [4 /*yield*/, this.postService.updatePost(id, updatePostDto, userId)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            return [2 /*return*/, res.status(404).json({ message: 'Post not found or you do not have permission to edit' })];
                        }
                        return [2 /*return*/, res.status(200).json(post)];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Failed to update post in controller', error_3.message);
                        throw new common_1.InternalServerErrorException('Failed to update post');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.deletePost = function (id, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, post, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId = req.user.userId;
                        return [4 /*yield*/, this.postService.getPostById(id)];
                    case 1:
                        post = _a.sent();
                        if (post.author !== req.user.userId) {
                            return [2 /*return*/, res.status(403).json({ message: 'You are not allowed to delete this post.' })];
                        }
                        return [4 /*yield*/, this.postService.deletePost(id, userId)];
                    case 2:
                        _a.sent();
                        res.redirect('/feed');
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Failed to get post in controller', error_4.message);
                        throw new common_1.InternalServerErrorException('Failed to delete post');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Post('create'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Body()), __param(1, common_1.Req())
    ], PostController.prototype, "createPost");
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        common_1.Get('feed'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], PostController.prototype, "getAllPost");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id'))
    ], PostController.prototype, "getPostById");
    __decorate([
        common_1.Patch('update/:id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Param('id')), __param(1, common_1.Body()), __param(2, common_1.Req()), __param(3, common_1.Res())
    ], PostController.prototype, "updatePost");
    __decorate([
        common_1.Delete('delete/:id'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Param('id')), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], PostController.prototype, "deletePost");
    PostController = __decorate([
        common_1.Controller('post')
    ], PostController);
    return PostController;
}());
exports.PostController = PostController;
