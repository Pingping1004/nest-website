"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Records = void 0;
var typeorm_1 = require("typeorm");
var Records = /** @class */ (function () {
    function Records() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Records.prototype, "recordId");
    __decorate([
        typeorm_1.Column()
    ], Records.prototype, "action");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', "default": function () { return 'CURRENT_TIMESTAMP'; } })
    ], Records.prototype, "date");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Records.prototype, "entityId");
    Records = __decorate([
        typeorm_1.Entity('Records')
    ], Records);
    return Records;
}());
exports.Records = Records;
