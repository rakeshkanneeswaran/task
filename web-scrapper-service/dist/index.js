"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.goto('https://support.giva.co/support/home', { waitUntil: 'domcontentloaded' });
    const PageContent = [];
    const links = yield page.$$eval('a', (elements) => elements.map((el) => {
        var _a;
        return ({
            text: ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '',
            href: el.href,
        });
    }));
    links.forEach((eachlink) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.goto(eachlink.href, { waitUntil: 'domcontentloaded' });
        const content = yield page.evaluate(() => {
            return document.body.innerText;
        });
        console.log(content);
        PageContent.push(content);
    }));
    console.log(PageContent);
    yield browser.close();
}))();
