"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var multer_1 = __importDefault(require("multer"));
var path_1 = require("path");
var crypto_1 = require("crypto");
var utils_1 = require("./utils");
var app = express_1.default();
var tmpPath = path_1.resolve(__dirname, '..', 'tmp');
var storage = multer_1.default.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path_1.join(tmpPath, 'xml'));
    },
    filename: function (request, file, callback) {
        var hash = crypto_1.randomBytes(12).toString('hex');
        var filename = hash + "-" + file.originalname;
        callback(null, filename);
    }
});
var upload = multer_1.default({ storage: storage });
app.use(cors_1.default());
app.post('/xml/import', upload.single('file'), function (request, response) {
    try {
        var file = request.file;
        var filename = file.filename.replace('.xml', '');
        utils_1.convertToJson(path_1.join(tmpPath, 'xml', file.filename), filename);
        var data = utils_1.getFields(filename);
        return response.json(data);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({
            statusCode: 500,
            message: 'Internal server error'
        });
    }
});
app.listen(3333, function () { return console.log('Server is running'); });
