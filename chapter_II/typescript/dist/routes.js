"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = void 0;
const CreateCourseServices_1 = __importDefault(require("./CreateCourseServices"));
const createCourse = (request, response) => {
    CreateCourseServices_1.default.execute({ duration: 10, educator: "Felipe", name: "NodeJS" });
    return response.send();
};
exports.createCourse = createCourse;
