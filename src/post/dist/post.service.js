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
exports.PostService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var post_entity_1 = require("./schema/post.entity");
var picture_entity_1 = require("../post/schema/picture.entity");
var postLike_entity_1 = require("../post/like/postLike.entity");
var user_entity_1 = require("../users/schema/user.entity");
var PostService = /** @class */ (function () {
    function PostService(postRepository, postLikeRepository, userRepository) {
        this.postRepository = postRepository;
        this.postLikeRepository = postLikeRepository;
        this.userRepository = userRepository;
    }
    PostService.prototype.createPost = function (createPostDto, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var post_1, pictures, newPost, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        post_1 = this.postRepository.create(__assign(__assign({}, createPostDto), { author: { userId: userId }, 
                            // postLikeCount: 0,
                            pictures: [], comments: [] }));
                        if (createPostDto.pictureContent &&
                            createPostDto.pictureContent.length > 0) {
                            pictures = createPostDto.pictureContent.map(function (filePath) {
                                var picture = new picture_entity_1.Picture();
                                picture.pictureUrl = filePath; // Ensure file.path is correct
                                picture.post = post_1; // Associate with the post
                                return picture;
                            });
                            // Assign the pictures to the post
                            post_1.pictures = pictures;
                        }
                        console.log('Create Post DTO:', createPostDto);
                        return [4 /*yield*/, this.postRepository.save(post_1)];
                    case 1:
                        newPost = _a.sent();
                        return [4 /*yield*/, this.postRepository.findOne({
                                where: { postId: newPost.postId },
                                relations: ['pictures']
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to create post', error_1.message);
                        throw new common_1.InternalServerErrorException('Failed to create post');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostService.prototype.getAllPosts = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.postRepository.find({
                                relations: ['author', 'pictures']
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Failed to render all posts', error_2.message);
                        throw new common_1.InternalServerErrorException('Failed to retrieve posts');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostService.prototype.getPostForUser = function (user) {
        return __awaiter(this, void 0, Promise, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.postRepository.find({
                                where: [
                                    { audience: 'user' },
                                    { author: user },
                                ],
                                relations: ['author', 'pictures']
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Failed to render posts for admin', error_3.message);
                        throw new common_1.InternalServerErrorException('Failed to retrieve posts for admin');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostService.prototype.getPostById = function (postId) {
        return __awaiter(this, void 0, Promise, function () {
            var post, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.postRepository.findOne({
                                where: { postId: postId },
                                relations: ['author', 'pictures']
                            })];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            throw new common_1.NotFoundException('Post not found');
                        }
                        console.log('Post that get by ID:', post);
                        return [2 /*return*/, post];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Failed to render post', error_4.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostService.prototype.updatePost = function (postId, updatePostDto, userId) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var post, error_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getPostById(postId)];
                    case 1:
                        post = _c.sent();
                        console.log('Updated post detail:', post);
                        console.log('Update DTO:', updatePostDto);
                        if (!post) {
                            throw new common_1.NotFoundException('Post not found');
                        }
                        console.log('Author id of updating post:', (_a = post.author) === null || _a === void 0 ? void 0 : _a.userId);
                        console.log('User who update the post:', userId);
                        if (((_b = post.author) === null || _b === void 0 ? void 0 : _b.userId) !== userId) {
                            throw new common_1.ForbiddenException('You do not have permission to edit this post');
                        }
                        Object.assign(post, updatePostDto);
                        return [4 /*yield*/, this.postRepository.save(post)];
                    case 2: return [2 /*return*/, _c.sent()];
                    case 3:
                        error_5 = _c.sent();
                        console.error('Failed to update post', error_5.message);
                        throw new common_1.InternalServerErrorException('Failed to update post');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostService.prototype.deletePost = function (postId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var post, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('postId to delete:', postId);
                        return [4 /*yield*/, this.getPostById(postId)];
                    case 1:
                        post = _a.sent();
                        console.log('Deleted post detail:', post);
                        if (!post) {
                            throw new common_1.NotFoundException('Post not found');
                        }
                        console.log('Author id of updating post:', post.author.userId);
                        console.log('User who delete the post:', userId);
                        return [4 /*yield*/, this.postRepository.remove(post)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Failed to delete post', error_6.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PostService.prototype.likePost = function (postId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var post, user, existingLike, newLike;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postRepository.findOne({ where: { postId: postId } })];
                    case 1:
                        post = _a.sent();
                        if (!post)
                            throw new common_1.NotFoundException('Post not found');
                        return [4 /*yield*/, this.userRepository.findOne({ where: { userId: userId } })];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.NotFoundException('User not found');
                        return [4 /*yield*/, this.postLikeRepository.findOne({
                                where: { postId: postId, userId: userId }
                            })];
                    case 3:
                        existingLike = _a.sent();
                        console.log('Existing like', existingLike);
                        if (!existingLike) return [3 /*break*/, 5];
                        // Remove the like if user has already like the post
                        return [4 /*yield*/, this.postLikeRepository.remove(existingLike)];
                    case 4:
                        // Remove the like if user has already like the post
                        _a.sent();
                        post.likeCount--;
                        return [3 /*break*/, 7];
                    case 5:
                        newLike = this.postLikeRepository.create({ postId: postId, userId: userId });
                        return [4 /*yield*/, this.postLikeRepository.save(newLike)];
                    case 6:
                        _a.sent();
                        post.likeCount++;
                        _a.label = 7;
                    case 7: return [4 /*yield*/, this.postRepository.save(post)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, post];
                }
            });
        });
    };
    PostService.prototype.getPostLikeCount = function (postId) {
        return __awaiter(this, void 0, Promise, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPostById(postId)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            throw new common_1.NotFoundException('Post not found');
                        }
                        console.log("Post ID " + postId + " like count is " + post.likeCount);
                        return [2 /*return*/, post.likeCount];
                }
            });
        });
    };
    PostService.prototype.checkIfUserLikedPost = function (postId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var like;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.postLikeRepository.findOne({
                            where: { postId: postId, userId: userId }
                        })];
                    case 1:
                        like = _a.sent();
                        return [2 /*return*/, !!like];
                }
            });
        });
    };
    PostService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(post_entity_1.Post)),
        __param(1, typeorm_1.InjectRepository(postLike_entity_1.PostLike)),
        __param(2, typeorm_1.InjectRepository(user_entity_1.User))
    ], PostService);
    return PostService;
}());
exports.PostService = PostService;
