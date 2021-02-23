import fs from 'fs';
import path from 'path';
import toml from 'toml';

import showdown from 'showdown';
import highlighter from 'showdown-highlight';

const SOURCE_ROOT = "zip/cheatsheets/";
const TARGET_ROOT = "public/zip/";
const TARGET_FILE = "cheatsheets.json";

const cates = fs.readdirSync(SOURCE_ROOT, { withFileTypes: true });

const resolveToml = (filepath) => {
    return toml.parse(fs.readFileSync(filepath).toString() || '');
};

const zipObject = {
    cates: resolveToml(path.join(SOURCE_ROOT, 'meta.toml')),
    extra: resolveToml(path.join(SOURCE_ROOT, 'meta.toml')),
};

const classMapping = {
    h4: 'mkr-title',
    h5: 'mkr-title',
    h6: 'mkr-title',
    h7: 'mkr-title',
    ol: 'mkr-list mkr-ol',
    ul: 'mkr-list mkr-ul',
    pre: 'mkr-prepare',
    table: 'mkr-table',
}

const classMixers = Object.keys(classMapping).map(key => ({
    type: 'output',
    regex: new RegExp(`<${key}(.*)>`, 'g'),
    replace: `<${key} class="${classMapping[key]}" $1>`
}));

const inlineCodeMixer = {
    type: 'output',
    regex: /<code(\s*)>/g,
    replace : '<code class="mkr-code">'
};

const showdownConverter = new showdown.Converter({
    tables: true,
    tasklists: true,
    noHeaderId: true,
    ghCodeBlocks: false,
    headerLevelStart: 4,
    omitExtraWLInCodeBlocks: true,
    requireSpaceBeforeHeadingText: true,
    extensions: [highlighter, ...classMixers, inlineCodeMixer],
});

showdownConverter.setFlavor('github');

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
        for (let card of (cheatsheet.cards || [])) {
            card.html = showdownConverter.makeHtml(card.content);
        }
        zipObject[cheatsheet.unique] = cheatsheet;
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