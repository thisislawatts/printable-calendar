<script>
  import langNl from "dayjs/locale/nl";
  import { papersizes } from "./lib/paper-sizes";
  import InputQty from "./components/InputQty.svelte";
  import { generateCalendar } from "./lib/generate-calendar";
  import { renderPdfDocument } from "./lib/generate-pdf-document";

  let state = {
    ps: 1, // Paper size
    sm: 1, // Starting month
    ts: 1, // Title Size
    hs: 12, // Heading Size
    hl: 1, // Heading Length
    ns: 1, // Numeral Size
    ss: 1, // Stroke Size
  };

  const availableMonths = langNl.months;
  let selectedMonth = langNl.months[0];
  const sheetSizeOptions = Object.keys(papersizes);

  let doc;

  location.search
    .replace("?", "")
    .split(":")
    .map((propertyValue) => {
      const [prop, val] = propertyValue.match(/[a-z]+|\d+/g);

      if (prop && val) state[prop] = val;
    });

  let settingsVector;
  $: {
    const calenderData = generateCalendar(
      new Date().getFullYear(),
      state.sm,
      state.nm
    );

    settingsVector = [
      `ps${state.ps}`,
      `sm${state.sm}`,
      `nm${state.nm}`,
      `ts${state.ts}`,
      `hs${state.hs}`,
      `hl${state.hl}`,
      `ns${state.ns}`,
      `ss${state.ss}`,
    ].join(":");

    doc = renderPdfDocument(
      calenderData,
      {
        sheetSize: Object.keys(papersizes)[state.ps],
        headingSizing: state.hs,
        titleSizing: state.ts,
        numberOfMonths: state.nm,
        numeralSizing: state.ns,
        headingLength: state.hl,
        strokeSizing: state.ss,
      },
      settingsVector,
    );

    history.pushState(settingsVector, "Updated", `?${settingsVector}`);
  }

  // Create repeatable vector
  // Update PDF from vector
</script>

<div class="app">
  <div>
    <h1>Printable {new Date().getFullYear()} Calendar</h1>
    <div>
      Paper format:

      {state.ps}
      <select bind:value={state.ps}>
        {#each sheetSizeOptions as size, idx}
          <option value={idx + 1} selected={state.ps == idx + 1}>{size}</option>
        {/each}
      </select>
    </div>

    <div>
      Starting month:
      <select bind:value={state.sm}>
        {#each availableMonths as month, idx}
          <option value={idx + 1} selected={state.sm == idx + 1}>{month}</option
          >
        {/each}
      </select>
    </div>

    <InputQty bind:value={state.nm} label="Number of Months" />
    <InputQty bind:value={state.ts} label="Title size" unit="pt" />
    <InputQty bind:value={state.hs} label="Heading size" unit="pt" />
    <InputQty bind:value={state.hl} label="Heading length" />
    <InputQty bind:value={state.ns} label="Numerals Size" unit="pt" />

    <div>
      Numeral alignment Horizontal
      <div><label for="">Bottom<input type="radio" /></label></div>
    </div>
    <InputQty bind:value={state.ss} label="Stroke Size" unit="pt" />

    <button on:click={() => doc.save("CalendarDownload.pdf")}>Download</button>
    <footer>
      {settingsVector}
    </footer>
  </div>

  {#if doc}
    <embed
      src={doc.output("datauristring")}
      type="application/pdf"
      heigth="100%"
      width="100%"
    />
  {/if}
</div>

<style>
  /* css will go here */
  .app {
    display: flex;
    height: calc(100vh - 20px);
  }
</style>
