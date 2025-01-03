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
exports.PostController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path = require("path");
var fs_1 = require("fs");
var typeorm_1 = require("@nestjs/typeorm");
var postLike_entity_1 = require("./like/postLike.entity");
var PostController = /** @class */ (function () {
    function PostController(postService, userService, postLikeRepository) {
        this.postService = postService;
        this.userService = userService;
        this.postLikeRepository = postLikeRepository;
    }
    PostController.prototype.createPost = function (req, res, createPostDto, files) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, post, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userId = req.user.userId;
                        console.log('UserID', userId);
                        return [4 /*yield*/, this.userService.findByUserId(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        // createPostDto.pictureContent = files;
                        createPostDto.pictureContent = files.map(function (file) { return "/uploads/pictures/" + file.filename; });
                        return [4 /*yield*/, this.postService.createPost(createPostDto, userId)];
                    case 2:
                        post = _a.sent();
                        console.log('Created post in controller', post);
                        return [2 /*return*/, res.status(201).json({ message: 'Post created successfully', post: post })];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to create post in controller', error_1.message);
                        throw new common_1.InternalServerErrorException('Failed to create post');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.getAllPost = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, role, posts, userId_1, postsWithLikeState, _i, posts_1, post, likeCount, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        user = req.user;
                        role = req.user.role;
                        posts = void 0;
                        if (!(role === 'admin')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.postService.getAllPosts()];
                    case 1:
                        posts = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.postService.getPostForUser(user)];
                    case 3:
                        posts = _a.sent();
                        _a.label = 4;
                    case 4:
                        userId_1 = req.user.userId;
                        return [4 /*yield*/, Promise.all(posts.map(function (post) { return __awaiter(_this, void 0, void 0, function () {
                                var isLiked;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.postService.checkIfUserLikedPost(post.postId, userId_1)];
                                        case 1:
                                            isLiked = _a.sent();
                                            return [2 /*return*/, __assign(__assign({}, post), { isLiked: isLiked })];
                                    }
                                });
                            }); }))];
                    case 5:
                        postsWithLikeState = _a.sent();
                        _i = 0, posts_1 = posts;
                        _a.label = 6;
                    case 6:
                        if (!(_i < posts_1.length)) return [3 /*break*/, 9];
                        post = posts_1[_i];
                        return [4 /*yield*/, this.postLikeRepository.count({ where: { postId: post.postId } })];
                    case 7:
                        likeCount = _a.sent();
                        post.likeCount = likeCount; // Update the post's like count
                        console.log('Post like count', post.likeCount);
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9:
                        console.log('User ID before get all post and search post owner:', userId_1);
                        return [2 /*return*/, res.status(200).json({ posts: postsWithLikeState, userId: userId_1, role: role })];
                    case 10:
                        error_2 = _a.sent();
                        console.error('Failed to get post in controller', error_2.message);
                        throw new common_1.InternalServerErrorException('Failed to retrieve posts');
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.updatePost = function (postId, updatePostDto, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, post, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('User from request:', req.user);
                        userId = req.user.userId;
                        console.log('User ID in update controller:', userId);
                        return [4 /*yield*/, this.postService.updatePost(postId, updatePostDto, userId)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            return [2 /*return*/, res.status(404).json({ message: 'Post not found or you do not have permission to edit' })];
                        }
                        return [2 /*return*/, res.status(200).json(post)];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Failed to update post in controller', error_3.message);
                        return [2 /*return*/, res.status(500).json({ message: 'Failed to update post' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.deletePost = function (postId, req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, post, role, authorId, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        return [4 /*yield*/, this.postService.getPostById(postId)];
                    case 1:
                        post = _b.sent();
                        role = req.user.role;
                        authorId = post.author.userId;
                        console.log('Author ID of the post:', authorId);
                        if (!post) {
                            return [2 /*return*/, res.status(404).json({ message: 'Post not found' })];
                        }
                        if (authorId !== req.user.userId && role !== 'admin') {
                            return [2 /*return*/, res.status(403).json({ message: 'You are not allowed to delete this post.' })];
                        }
                        return [4 /*yield*/, this.postService.deletePost(postId, userId)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ message: 'Post deleted successfully', postId: postId })];
                    case 3:
                        error_4 = _b.sent();
                        console.error('Failed to delete post in controller', error_4.message);
                        throw new common_1.InternalServerErrorException('Failed to delete post');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.likePost = function (body, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postId, userId, updatedPost, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        postId = body.postId, userId = body.userId;
                        if (!userId) {
                            throw new common_1.BadRequestException('User ID is required');
                        }
                        console.log('User who likes post in controller', userId);
                        return [4 /*yield*/, this.postService.likePost(postId, userId)];
                    case 1:
                        updatedPost = _a.sent();
                        console.log('Update post like object in controller', updatedPost);
                        return [2 /*return*/, res.status(200).json(updatedPost)];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error updating post like count:', error_5.message);
                        return [2 /*return*/, res.status(500).json({ message: 'Failed to update post like count' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostController.prototype.getLikeCount = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postService.getPostById(postId)];
                    case 1:
                        post = _a.sent();
                        console.log("Post ID in controller " + postId + " like count is " + post.likeCount);
                        return [2 /*return*/, this.postService.getPostLikeCount(postId)];
                }
            });
        });
    };
    __decorate([
        common_1.Post('create'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard)
        // @UseInterceptors(FilesInterceptor('files'))
        ,
        common_1.UseInterceptors(platform_express_1.FilesInterceptor('files', 10, {
            storage: multer_1.diskStorage({
                destination: function (req, file, cb) {
                    var uploadPath = path.join(process.cwd(), 'public', 'uploads', 'pictures');
                    // Create directory if it does not exist
                    if (!fs_1.existsSync(uploadPath)) {
                        fs_1.mkdirSync(uploadPath, { recursive: true });
                    }
                    cb(null, uploadPath); // Use the correct upload path
                },
                filename: function (req, file, callback) {
                    var ext = path.extname(file.originalname);
                    var fileName = "" + Date.now() + ext;
                    callback(null, fileName);
                }
            }),
            limits: { fileSize: 1024 * 1024 * 10 }
        })),
        __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.Body()), __param(3, common_1.UploadedFiles())
    ], PostController.prototype, "createPost");
    __decorate([
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        common_1.Get('feed'),
        __param(0, common_1.Req()), __param(1, common_1.Res())
    ], PostController.prototype, "getAllPost");
    __decorate([
        common_1.Patch('update/:postId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Param('postId')), __param(1, common_1.Body()), __param(2, common_1.Req()), __param(3, common_1.Res())
    ], PostController.prototype, "updatePost");
    __decorate([
        common_1.Delete('delete/:postId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Param('postId')), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], PostController.prototype, "deletePost");
    __decorate([
        common_1.Patch('update/like/:postId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Body()), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], PostController.prototype, "likePost");
    __decorate([
        common_1.Get('get/likeCount/:postId'),
        __param(0, common_1.Param('postId'))
    ], PostController.prototype, "getLikeCount");
    PostController = __decorate([
        common_1.Controller('post'),
        __param(2, typeorm_1.InjectRepository(postLike_entity_1.PostLike))
    ], PostController);
    return PostController;
}());
exports.PostController = PostController;
