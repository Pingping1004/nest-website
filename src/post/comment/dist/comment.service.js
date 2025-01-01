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
exports.CommentService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var comment_entity_1 = require("./schema/comment.entity");
var post_entity_1 = require("../schema/post.entity");
var user_entity_1 = require("../../users/schema/user.entity");
var commentLike_entity_1 = require("./schema/commentLike.entity");
var CommentService = /** @class */ (function () {
    function CommentService(commentRepository, postRepository, userRepository, commentLikeRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentLikeRepository = commentLikeRepository;
    }
    CommentService.prototype.getCommentById = function (postId, commentId) {
        return __awaiter(this, void 0, Promise, function () {
            var comment, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Post ID in get comment by ID funciton', postId);
                        console.log('Comment ID in get comment by ID funciton', commentId);
                        return [4 /*yield*/, this.commentRepository.findOne({
                                where: { post: { postId: postId }, commentId: commentId },
                                relations: ['commenter', 'post']
                            })];
                    case 1:
                        comment = _a.sent();
                        if (!comment) {
                            throw new common_1.NotFoundException('Comment not found');
                        }
                        console.log('Comment that get by ID:', comment);
                        return [2 /*return*/, comment];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to get comment by ID', error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CommentService.prototype.createComment = function (createCommentDto, userId, postId) {
        return __awaiter(this, void 0, Promise, function () {
            var comment, newComment, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('Post ID in create comment service', postId);
                        comment = this.commentRepository.create(__assign(__assign({}, createCommentDto), { post: { postId: postId }, commenter: { userId: userId }, likeCount: 0 }));
                        console.log('Comment before creating in controller', comment);
                        return [4 /*yield*/, this.commentRepository.save(comment)];
                    case 1:
                        newComment = _a.sent();
                        return [4 /*yield*/, this.commentRepository.findOne({
                                where: { commentId: newComment.commentId },
                                relations: ['commenter']
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Failed to create comment', error_2.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CommentService.prototype.getAllCommentsInPost = function (postId) {
        return __awaiter(this, void 0, Promise, function () {
            var comments, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.commentRepository.find({
                                where: { post: { postId: postId } },
                                relations: ['commenter'],
                                order: { date: 'ASC' }
                            })];
                    case 1:
                        comments = _a.sent();
                        return [2 /*return*/, comments];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Failed to render all comments in post', error_3.message);
                        throw new common_1.InternalServerErrorException('Failed to retrieve comments');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CommentService.prototype.deleteComment = function (postId, commentId) {
        return __awaiter(this, void 0, Promise, function () {
            var comment, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('commentId to delete:', commentId), ' from post ID', postId;
                        return [4 /*yield*/, this.getCommentById(postId, commentId)];
                    case 1:
                        comment = _a.sent();
                        console.log('Deleted comment detail:', comment);
                        if (!comment) {
                            throw new common_1.NotFoundException('Comment not found');
                        }
                        console.log('Commenter id of deleted comment:', comment.commenter.userId);
                        return [4 /*yield*/, this.commentRepository.remove(comment)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Failed to delete comment', error_4.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CommentService.prototype.likeComment = function (postId, commentId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var comment, user, post, existingCommentLike, newCommentLike, isLiked, commentWithLikeState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commentRepository.findOne({ where: { commentId: commentId } })];
                    case 1:
                        comment = _a.sent();
                        if (!comment)
                            throw new common_1.NotFoundException('Post not found');
                        return [4 /*yield*/, this.userRepository.findOne({ where: { userId: userId } })];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.NotFoundException('User not found');
                        return [4 /*yield*/, this.postRepository.findOne({ where: { postId: postId } })];
                    case 3:
                        post = _a.sent();
                        if (!post)
                            throw new common_1.NotFoundException('Post not found');
                        return [4 /*yield*/, this.commentLikeRepository.findOne({
                                where: { commentId: commentId, userId: userId }
                            })];
                    case 4:
                        existingCommentLike = _a.sent();
                        console.log('Existing comment like', existingCommentLike);
                        if (!existingCommentLike) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.commentLikeRepository.remove(existingCommentLike)];
                    case 5:
                        _a.sent();
                        comment.likeCount--;
                        return [3 /*break*/, 8];
                    case 6:
                        newCommentLike = this.commentLikeRepository.create({ postId: postId, commentId: commentId, userId: userId });
                        return [4 /*yield*/, this.commentLikeRepository.save(newCommentLike)];
                    case 7:
                        _a.sent();
                        comment.likeCount++;
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.commentRepository.save(comment)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.checkIfUserLikedComment(postId, commentId, userId)];
                    case 10:
                        isLiked = _a.sent();
                        commentWithLikeState = __assign(__assign({ postId: postId }, comment), { isLiked: isLiked });
                        console.log("Comment like state for user " + userId + ": " + isLiked + " from post " + postId);
                        return [2 /*return*/, commentWithLikeState];
                }
            });
        });
    };
    CommentService.prototype.getCommentLikeCount = function (postId, commentId) {
        return __awaiter(this, void 0, Promise, function () {
            var comment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Comment ID from get comment like count serivce', postId);
                        return [4 /*yield*/, this.getCommentById(postId, commentId)];
                    case 1:
                        comment = _a.sent();
                        if (!comment) {
                            throw new common_1.NotFoundException('Post not found');
                        }
                        console.log("Comment ID " + commentId + " like count is " + comment.likeCount);
                        return [2 /*return*/, comment.likeCount];
                }
            });
        });
    };
    CommentService.prototype.checkIfUserLikedComment = function (postId, commentId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var like;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commentLikeRepository.findOne({
                            where: { postId: postId, commentId: commentId, userId: userId }
                        })];
                    case 1:
                        like = _a.sent();
                        return [2 /*return*/, !!like];
                }
            });
        });
    };
    CommentService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(comment_entity_1.Comment)),
        __param(1, typeorm_1.InjectRepository(post_entity_1.Post)),
        __param(2, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(3, typeorm_1.InjectRepository(commentLike_entity_1.CommentLike))
    ], CommentService);
    return CommentService;
}());
exports.CommentService = CommentService;
