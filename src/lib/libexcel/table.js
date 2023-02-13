const ExcelJS = require('exceljs');
const _ = require('lodash');

const REQUIRED_COLUMN_COLOR = 'fc814c'; // orange
const HEADERS_ROW_IDX = 1;
const HEADER_PADDING = 2;

/**
 * @typedef ColumnProperties
 * @type {object}
 * @property {string} header - column header.
 * @property {string} is_required - is column required flag.
 * @property {object[]} options - column value options
 */

/**
 * @param {ExcelJS.Worksheet} sheet
 * @param {number} colIdx column index
 * @param {ColumnProperties} col column properties
 */
function initCol(sheet, colIdx, col) {
    const sheetCol = sheet.getColumn(colIdx);
    sheetCol.header = col.header;
    sheetCol.width = col.header.length + HEADER_PADDING;
    if (col.is_required) {
        sheet.getRow(HEADERS_ROW_IDX).getCell(colIdx).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: REQUIRED_COLUMN_COLOR },
        };
    }
};

/**
 * @param {ExcelJS.Workbook} wk - workbook to which add an worksheet
 * @param {string} name - name of new worksheet
 * @param {ColumnProperties[]} cols - worksheet columns properties
 */
export default function addWorksheet(wk, name, cols) {
    const sheet = wk.addWorksheet(name);
    initCol(sheet, 1, { header: 'Номер карточки', is_required: true });
    cols.forEach((c, idx) => initCol(sheet, idx + 2, c));
}
