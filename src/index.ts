import "alpinejs";
import "./styles.css";
import { papersizes } from "./paper-sizes";
import { generateCalendar } from "./generate-calendar";
import {
  renderPdfDocument,
  PdfDocumentDefaultSettings
} from "./generate-pdf-document";

// Configuration Options
let numberOfMonths = 1;
let sheetSize = "a2";
let titleSizing = 42;
let headingSizing = 15;

let numeralSizing = 10;

const calenderData = generateCalendar(2021, 1, numberOfMonths);

const doc = renderPdfDocument(calenderData, {
  titleSizing,
  numberOfMonths,
  sheetSize,
  numeralSizing
});

const $embed = document.createElement("embed");

if (doc) {
  $embed.setAttribute("src", doc.output("datauristring"));
  $embed.setAttribute("type", "application/pdf");
  $embed.setAttribute("height", "100%");
  $embed.setAttribute("width", "100%");
}

document.getElementById("PDFPreview").appendChild($embed);

document.getElementById("PDFDownload").addEventListener(
  "click",
  (evt) => {
    doc.save("CalendarDownload.pdf");
  },
  false
);

declare global {
  interface Window {
    initUi: any;
  }
}

window.initUi = function () {
  const paperSizes = Object.keys(papersizes);
  return {
    ...PdfDocumentDefaultSettings,
    numberOfMonths,
    titleSizing,
    headingSizing,
    numeralSizing,
    paperSizes,
    selectedPaperSize: "a4",
    update() {
      const updatedPdf = renderPdfDocument(
        generateCalendar(2021, 1, this.numberOfMonths),
        {
          sheetSize: this.selectedPaperSize,
          titleSizing: this.titleSizing,
          headingSizing: this.headingSizing,
          headingLength: this.headingLength,
          numeralSizing: this.numeralSizing,
          strokeSizing: this.strokeSizing
        }
      );
      $embed.setAttribute("src", updatedPdf.output("datauristring"));
    },
    updateNumericValue(targetValue, adjustmentFactor) {
      if (this[targetValue]) {
        this[targetValue] += adjustmentFactor;
        this.update();
      }
    }
  };
};
