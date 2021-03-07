import { jsPDF } from "jspdf";
import { papersizes } from "./paper-sizes";
import { generateCalendar } from "./generate-calendar";

interface PdfDocumentSettings {
  titleSizing: number;
  headingSizing: number;
  headingLength: number;
  numeralSizing: number;
  strokeSizing: number;
  sheetSize: string;
}

export const PdfDocumentDefaultSettings = {
  titleSizing: 10,
  headingSizing: 10,
  headingLength: 3,
  numeralSizing: 10,
  strokeSizing: 1,
  sheetSize: "A4",
};

export function renderPdfDocument(
  calender,
  options: PdfDocumentSettings,
  settingsVector: string
) {
  let doc: any;

  const {
    sheetSize,
    titleSizing,
    headingSizing,
    numeralSizing,
    headingLength,
    strokeSizing,
  } = {
    ...PdfDocumentDefaultSettings,
    ...options,
  };

  const TABLE_X = 10;
  const TABLE_Y = 60;
  const SHEET_DIMENSIONS = papersizes[sheetSize.toUpperCase()].mm;
  const TABLE_W = SHEET_DIMENSIONS[0] - TABLE_X * 2;
  const COLUMN_WIDTH = TABLE_W / 7;
  const ROW_HEIGHT = (SHEET_DIMENSIONS[1] - TABLE_Y - TABLE_X * 1.5) / 6;
  const HEADER_ROW_HEIGHT = 7;
  const CELL_PADDING = 2 + strokeSizing * 0.5;

  // Render Calendar PDF
  calender.months.forEach(({ days, title }) => {
    if (!doc) {
      doc = new jsPDF({
        format: sheetSize.toLowerCase(),
        unit: "mm",
      });
    } else {
      doc.addPage();
    }

    // Month title
    doc.setFontSize(titleSizing);
    doc.text(title, TABLE_X, 40);

    // Weekday Headings
    doc.setFontSize(headingSizing);
    calender.weekdayHeadings.forEach((day: string, idx: number) => {
      let x = TABLE_X + idx * COLUMN_WIDTH;
      doc.text(
        day.slice(0, headingLength),
        x + CELL_PADDING,
        TABLE_Y - CELL_PADDING * 1.2,
        {
          align: "left",
        }
      );
    });

    let x = TABLE_X;
    let y = TABLE_Y + ROW_HEIGHT;
    let rowCount = 1;
    let itemsOnLastRow = 0;

    // Numerals
    doc.setFontSize(numeralSizing);
    days.forEach((day: any, idx: number) => {
      if (!day.isCurrentMonth) {
        doc.setLineDashPattern([1, 2]);
        doc.line(x, y - ROW_HEIGHT, x + COLUMN_WIDTH, y);
        doc.setLineDashPattern();
      }
      doc.text(
        day.dayOfMonth + "",
        x + CELL_PADDING,
        y - (ROW_HEIGHT - CELL_PADDING * 3.5)
      );

      if (idx && (idx + 1) % 7 === 0) {
        x = TABLE_X;
        y += ROW_HEIGHT;
        rowCount++;
        itemsOnLastRow = 0;
      } else {
        x += COLUMN_WIDTH;
        itemsOnLastRow += 1;
      }
    });
    // Draw the horizontal lines
    // Header
    doc.setLineWidth(strokeSizing);
    // Horiontal lines
    for (let index = 0; index < rowCount - 1; index++) {
      let y = TABLE_Y + ROW_HEIGHT * index;
      doc.line(TABLE_X, y, TABLE_W + TABLE_X, y);
    }

    // Draw the vertical lines
    for (let index = 1; index < calender.weekdayHeadings.length; index++) {
      let x = TABLE_X + COLUMN_WIDTH * index;
      let numberOfRowsToLine =
        !itemsOnLastRow || index > itemsOnLastRow ? rowCount - 1 : rowCount;
      doc.line(
        x,
        TABLE_Y - HEADER_ROW_HEIGHT,
        x,
        TABLE_Y + ROW_HEIGHT * numberOfRowsToLine
      );
    }

    // Add attribution link
    doc.setFontSize(8);
    doc.text(settingsVector, TABLE_X, SHEET_DIMENSIONS[1] - 8);
  });

  return doc;
}
