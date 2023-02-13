import * as fs from 'node:fs/promises';

const ExcelJS = require('exceljs');

import MarketsManager from './lib/libmarket/MarketsManager.js';
import addWorksheet from './lib/libexcel/table.js';
import WbApiAdapter from './lib/libmarket/wb/adapter.js';
import OzonApiAdapter from './lib/libmarket/ozon/adapter.js';


const CATEGORIES = [
    { title: 'Футболки', marketplace: 'Wildberries' },
    { title: 'Футболка мужская', marketplace: 'Ozon' },
];

const GENERIC_CHARS = [
    { header: 'Название', },
    { header: 'Артикул', },
    { header: 'Габариты упаковки', },
    { header: 'Бренд', },
    { header: 'Производитель', },
    { header: 'Страна Производства', },
].map(c => ({ header: c.header, is_required: true }));

const CHARS_SUBSTITUDE = {
    [WbApiAdapter.name]: {
        'Габариты упаковки': [
            'Высота упаковки',
            'Ширина упаковки',
            'Длина упаковки',
        ],
        'Бренд': 'Бренд',
        'Производитель': 'Производитель',
        'Страна Производства': 'Страна Производства',
    },
    [OzonApiAdapter.name]: {
        'Бренд': 'Бренд в одежде и обуви',
        'Страна Производства': 'Страна-изготовитель',
    },
};

/**
 * @param {object.<string, (string|string[])>} scheme
 */
function hideChars(chars, scheme) {
    const toHideChars = Object.values(scheme).flat();
    return chars.filter(c => toHideChars.indexOf(c.title) == -1);
}

(async function main() {
    const mm = new MarketsManager();
    const rawChars = await mm.fetchCharacteristics(CATEGORIES);
    const chars = rawChars.map(ans => ({
        marketplace: ans.marketplace,
        data: hideChars(ans.data, CHARS_SUBSTITUDE[ans.marketplace])
    }));
    const wk = new ExcelJS.Workbook();
    addWorksheet(wk, 'Общие характеристики', GENERIC_CHARS);
    chars.forEach(ans => addWorksheet(wk, ans.marketplace,
            ans.data.map(charc => ({
                header: charc.title,
                is_required: charc.required,
            }))
        )
    );

    //const chars = JSON.parse(await fs.readFile('chars_sample.json'));
    //const workbook = buildTable(chars);
    await wk.xlsx.writeFile('жопа.xlsx');
})();
