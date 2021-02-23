import fs from 'fs';
import path from 'path';
import toml from 'toml';

const SOURCE_ROOT = "zip/cheatsheets/";
const TARGET_ROOT = "public/zip/";
const TARGET_FILE = "cheatsheets.json";

const cates = fs.readdirSync(SOURCE_ROOT, { withFileTypes: true });

const resolveToml = (filepath) => {
    return toml.parse(fs.readFileSync(filepath).toString() || '');
};

const zipObject = {
    items: [],
    cates: resolveToml(path.join(SOURCE_ROOT, 'meta.toml'))
};

for (let cate of cates) {
    if (!cate.isDirectory()) {
        continue;
    }
    const cateName = cate.name;
    const cateRoot = path.join(SOURCE_ROOT, cateName);
    const sheets = fs.readdirSync(cateRoot, { withFileTypes: true });
    for (let sheet of sheets) {
        if (!sheet.isFile() || !(/\.toml$/.test(sheet.name))) {
            continue;
        }
        const cheatsheet = resolveToml(path.join(cateRoot, sheet.name));
        zipObject.items.push(Object.assign({ cate: cateName }, cheatsheet));
    }
}

if (!fs.existsSync(TARGET_ROOT)) {
    fs.mkdirSync(TARGET_ROOT);
}

const target = path.join(TARGET_ROOT, TARGET_FILE);

if (fs.existsSync(target)) {
    fs.truncateSync(target);
}

fs.writeFileSync(path.join(TARGET_ROOT, TARGET_FILE), JSON.stringify(zipObject));

console.log('- Cheat sheets 数据生成完毕！\n');