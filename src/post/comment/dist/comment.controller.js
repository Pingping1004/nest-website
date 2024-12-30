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
exports.CommentController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
var CommentController = /** @class */ (function () {
    function CommentController(commentService, userService, postService) {
        this.commentService = commentService;
        this.userService = userService;
        this.postService = postService;
    }
    CommentController.prototype.createComment = function (createCommentDto, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postId, userId, user, comment, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        postId = createCommentDto.postId;
                        userId = req.user.userId;
                        console.log('User ID in create comment controller', userId);
                        console.log('Post ID in create comment controller', postId);
                        console.log('createCommentDto in create comment controller', createCommentDto);
                        return [4 /*yield*/, this.userService.findByUserId(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('User not found');
                        }
                        if (!postId) {
                            throw new common_1.NotFoundException('postId not found');
                        }
                        return [4 /*yield*/, this.commentService.createComment(createCommentDto, userId, postId)];
                    case 2:
                        comment = _a.sent();
                        console.log('Created comment in controller', comment);
                        return [2 /*return*/, res.status(201).json({ message: 'Comment created successfully', comment: comment })];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Failed to create comment in controller', error_1.message);
                        throw new common_1.InternalServerErrorException('Failed to create post');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CommentController.prototype.getComments = function (req, res, postId) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, post, comments, isLiked, enrichedPost, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        console.log('Post ID of fetch comments:', postId);
                        userId = req.user.userId;
                        return [4 /*yield*/, this.userService.findByUserId(userId)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.postService.getPostById(postId)];
                    case 2:
                        post = _a.sent();
                        comments = post.comments;
                        console.log('User ID in get comments controller', userId);
                        console.log('Post in comment fetching', post);
                        return [4 /*yield*/, this.postService.checkIfUserLikedPost(postId, userId)];
                    case 3:
                        isLiked = _a.sent();
                        console.log('Post is liked in fetch comment api', isLiked);
                        enrichedPost = __assign(__assign({}, post), { isLiked: isLiked });
                        console.log('Post with isLiked state', enrichedPost);
                        console.log('Comment of fetching comment controller', comments);
                        return [2 /*return*/, res.status(200).json({ post: enrichedPost, comments: comments, user: user })];
                    case 4:
                        error_2 = _a.sent();
                        throw new common_1.InternalServerErrorException('Failed to fetch comments');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CommentController.prototype.renderCommentPage = function (req, res, postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var post, comments, fullUser, userIdFromToken, postIsLiked, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log("User ID " + userId + " and Post ID " + postId + " from comment render");
                        return [4 /*yield*/, this.postService.getPostById(postId)];
                    case 1:
                        post = _a.sent();
                        return [4 /*yield*/, this.commentService.getAllCommentsInPost(postId)];
                    case 2:
                        comments = _a.sent();
                        return [4 /*yield*/, this.userService.findByUserId(userId)];
                    case 3:
                        fullUser = _a.sent();
                        userIdFromToken = req.user.userId;
                        if (!userId || !postId) {
                            throw new common_1.NotFoundException('UserID or postId not found');
                        }
                        if (!post) {
                            throw new common_1.NotFoundException('Post not found');
                        }
                        if (userId !== userIdFromToken) {
                            return [2 /*return*/, res.status(403).send('Forbidden')];
                        }
                        return [4 /*yield*/, this.postService.checkIfUserLikedPost(postId, userId)];
                    case 4:
                        postIsLiked = _a.sent();
                        console.log('Post is liked in render comment api', postIsLiked);
                        return [2 /*return*/, res.render('comment', { post: post, comments: comments, userId: userId, user: fullUser, postIsLiked: postIsLiked })];
                    case 5:
                        error_3 = _a.sent();
                        if (error_3 instanceof common_1.NotFoundException) {
                            throw error_3; // Re-throw NotFoundException
                        }
                        throw new common_1.InternalServerErrorException('Failed to render comment page');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CommentController.prototype.deleteComment = function (commentId, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var deletedComment, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.commentService.deleteComment(commentId)];
                    case 1:
                        deletedComment = _a.sent();
                        console.log('Deleted comment in controller:', deletedComment);
                        return [2 /*return*/, res.status(200).json({ message: 'Delete comment successfully', deletedComment: deletedComment })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Failed to delete comment in controller', error_4.message);
                        throw new common_1.InternalServerErrorException('Failed to delete comment');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Post('create'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Body()), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], CommentController.prototype, "createComment");
    __decorate([
        common_1.Get('get-comments/:postId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.Param('postId', common_1.ParseIntPipe))
    ], CommentController.prototype, "getComments");
    __decorate([
        common_1.Get('render/:postId/:userId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.Param('postId', common_1.ParseIntPipe)), __param(3, common_1.Param('userId', common_1.ParseIntPipe))
    ], CommentController.prototype, "renderCommentPage");
    __decorate([
        common_1.Delete('delete/:commentId'),
        common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
        __param(0, common_1.Param('commentId')), __param(1, common_1.Req()), __param(2, common_1.Res())
    ], CommentController.prototype, "deleteComment");
    CommentController = __decorate([
        common_1.Controller('comments')
    ], CommentController);
    return CommentController;
}());
exports.CommentController = CommentController;
