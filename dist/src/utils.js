"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateValue = exports.serializeNumbers = exports.getFields = exports.convertToJson = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var xml2json_1 = __importDefault(require("xml2json"));
var convertToJson = function (path, filename) {
    var value = fs_1.default.readFileSync(path).toString();
    var json = xml2json_1.default.toJson(value);
    fs_1.default.writeFileSync(path_1.resolve(__dirname, '..', 'tmp', 'json', filename + ".json"), json);
};
exports.convertToJson = convertToJson;
var getFields = function (filename) {
    var _a, _b, _c, _d;
    var json = require("../tmp/json/" + filename + ".json");
    var number = Number(json.nfeProc.NFe.infNFe.ide.nNF);
    var seller = {
        cnpj: json.nfeProc.NFe.infNFe.emit.CNPJ,
        name: json.nfeProc.NFe.infNFe.emit.xNome
    };
    var customer = {
        cnpj: json.nfeProc.NFe.infNFe.dest.CNPJ,
        name: json.nfeProc.NFe.infNFe.dest.xNome
    };
    var products = [];
    var isNotProductArray = json.nfeProc.NFe.infNFe.det.prod;
    if (isNotProductArray) {
        products.push({
            id: Number(json.nfeProc.NFe.infNFe.det.prod.cProd),
            name: String(json.nfeProc.NFe.infNFe.det.prod.xProd),
            quantity: exports.serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.qCom),
            unit_price: exports.serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vUnCom),
            total_price: exports.serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vProd),
            taxes: {
                icms_st: exports.serializeNumbers((_a = json.nfeProc.NFe.infNFe.det.imposto) === null || _a === void 0 ? void 0 : _a.ICMS[Object.keys(json.nfeProc.NFe.infNFe.det.imposto.ICMS)[0]].vICMSST),
                ipi: exports.serializeNumbers((_d = (_c = (_b = json.nfeProc.NFe.infNFe.det.imposto) === null || _b === void 0 ? void 0 : _b.IPI) === null || _c === void 0 ? void 0 : _c.IPITrib) === null || _d === void 0 ? void 0 : _d.vIPI)
            },
            other: exports.serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vOutro),
            discount: exports.serializeNumbers(json.nfeProc.NFe.infNFe.det.prod.vDesc),
        });
    }
    if (!isNotProductArray) {
        json.nfeProc.NFe.infNFe.det.forEach(function (product) {
            var _a, _b, _c, _d;
            products.push({
                id: Number(product.prod.cProd),
                name: product.prod.xProd,
                quantity: exports.serializeNumbers(product.prod.qCom),
                unit_price: exports.serializeNumbers(product.prod.vUnCom),
                total_price: exports.serializeNumbers(product.prod.vProd),
                taxes: {
                    icms_st: exports.serializeNumbers((_a = product.imposto) === null || _a === void 0 ? void 0 : _a.ICMS[Object.keys(product.imposto.ICMS)[0]].vICMSST),
                    ipi: exports.serializeNumbers((_d = (_c = (_b = product.imposto) === null || _b === void 0 ? void 0 : _b.IPI) === null || _c === void 0 ? void 0 : _c.IPITrib) === null || _d === void 0 ? void 0 : _d.vIPI)
                },
                other: exports.serializeNumbers(product.prod.vOutro),
                discount: exports.serializeNumbers(product.prod.vDesc),
            });
        });
    }
    var total = {
        products: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vProd),
        others: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vOutro),
        icms_st: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vST),
        shipping: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vFrete),
        ipi: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vIPI),
        discount: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vDesc),
        safe: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vSeg),
        nf: exports.serializeNumbers(json.nfeProc.NFe.infNFe.total.ICMSTot.vNF)
    };
    fs_1.default.unlinkSync(path_1.resolve(__dirname, '..', 'tmp', 'json', filename + ".json"));
    fs_1.default.unlinkSync(path_1.resolve(__dirname, '..', 'tmp', 'xml', filename + ".xml"));
    return {
        number: number,
        seller: seller,
        customer: customer,
        products: exports.calculateValue(products),
        total: total
    };
};
exports.getFields = getFields;
var serializeNumbers = function (value) {
    if (typeof value !== 'string')
        return 0;
    return Number(Number(value).toFixed(2));
};
exports.serializeNumbers = serializeNumbers;
var calculateValue = function (products) {
    return products.map(function (product) {
        var id = product.id, name = product.name, quantity = product.quantity;
        var total_price = product.total_price + product.taxes.ipi + product.taxes.icms_st - product.discount;
        var unit_price = exports.serializeNumbers(String(total_price / quantity));
        return {
            id: id,
            name: name,
            quantity: quantity,
            total_price: total_price,
            unit_price: unit_price,
        };
    });
};
exports.calculateValue = calculateValue;
