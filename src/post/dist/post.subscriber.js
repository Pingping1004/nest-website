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
exports.PostSubscriber = void 0;
var typeorm_1 = require("typeorm");
var record_entity_1 = require("../admin/record/entities/record.entity"); // Adjust the path to the new Record entity
var typeorm_2 = require("@nestjs/typeorm");
var user_entity_1 = require("../users/schema/user.entity");
var PostSubscriber = /** @class */ (function () {
    function PostSubscriber(postRepository) {
        this.postRepository = postRepository;
        console.log('RecordSubscriber initialized');
    }
    PostSubscriber.prototype.listenTo = function () {
        console.log('Subscriber listening to User and Post entities');
        return user_entity_1.User;
    };
    // Record for INSERT operation
    PostSubscriber.prototype.afterInsert = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var record, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Insert event triggered for:', event.entity); // Debug message
                        record = new record_entity_1.Records();
                        record.action = "INSERT_" + event.metadata.tableName.toUpperCase();
                        record.date = new Date();
                        record.entityId = event.entity.userId || event.entity.postId;
                        return [4 /*yield*/, event.manager.save(record_entity_1.Records, record)];
                    case 1:
                        _a.sent();
                        console.log('Insert record saved:', record);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error during afterInsert:', error_1.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Record for UPDATE operation
    PostSubscriber.prototype.afterUpdate = function (event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var record, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        console.log('Update event triggered for:', event.entity); // Debug message
                        record = new record_entity_1.Records();
                        record.action = "UPDATE_" + event.metadata.tableName.toUpperCase();
                        record.date = new Date();
                        record.entityId = ((_a = event.entity) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = event.entity) === null || _b === void 0 ? void 0 : _b.postId);
                        if (!record.entityId) {
                            console.error('Entity ID is undefined. Skipping record creation.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, event.manager.save(record_entity_1.Records, record)];
                    case 1:
                        _c.sent();
                        console.log('Remove record saved:', record);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        console.error('Error during afterUpdate:', error_2.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Record for REMOVE operation
    PostSubscriber.prototype.afterRemove = function (event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var record, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        console.log('Remove event triggered for:', event.entity); // Debug message
                        record = new record_entity_1.Records();
                        record.action = "REMOVE_" + event.metadata.tableName.toUpperCase();
                        record.date = new Date();
                        record.entityId = ((_a = event.entity) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = event.entity) === null || _b === void 0 ? void 0 : _b.postId);
                        return [4 /*yield*/, event.manager.save(record_entity_1.Records, record)];
                    case 1:
                        _c.sent();
                        console.log('Removed record saved:', record);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _c.sent();
                        console.error('Error during afterRemove:', error_3.message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PostSubscriber = __decorate([
        typeorm_1.EventSubscriber(),
        __param(0, typeorm_2.InjectRepository(record_entity_1.Records))
    ], PostSubscriber);
    return PostSubscriber;
}());
exports.PostSubscriber = PostSubscriber;
