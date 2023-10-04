"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    artist: {
        name: {
            type: String
        },
        description: {
            type: String
        }
    },
    description: {
        type: String
    },
    frame: {
        type: String
    },
    image: {
        type: String
    },
    material: {
        type: String
    },
    medium: {
        type: String
    },
    name: {
        type: String
    },
    rarity: {
        type: String
    }
});
const Certificate = mongoose_1.default.model('certificate', schema);
