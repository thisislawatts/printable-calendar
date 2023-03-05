<script lang="ts">
	import { page } from '$app/stores';
	import langNl from 'dayjs/locale/nl';
	import { papersizes } from '../lib/paper-sizes';
	import InputQty from '../components/InputQty.svelte';
	import InputSelect from '../components/InputSelect.svelte';
	import { generateCalendar } from '../lib/generate-calendar';
	import { renderPdfDocument } from '../lib/generate-pdf-document';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let state = {
		ps: 1, // Paper size
		sy: new Date().getFullYear(), // Starting year
		sm: 1, // Starting month
		ts: 1, // Title Size
		hs: 12, // Heading Size
		hl: 1, // Heading Length
		ns: 1, // Numeral Size
		ss: 1, // Stroke Size
		nm: 1 // Number of Months
	};

	const availableMonths = langNl.months;
	let selectedMonth = langNl.months[0];
	const sheetSizeOptions = Object.keys(papersizes);

	let doc;

	const { search } = $page.url;

	if (search) {
		search
			.replace('?', '')
			.split(':')
			.map((propertyValue) => {
				console.log({ propertyValue });
				const [prop, val] = propertyValue.match(/[a-z]+|\d+/g);

				if (prop && val) state[prop] = val;
			});
	}

	let settingsVector;
	$: {
		const calenderData = generateCalendar(state.sy, state.sm, state.nm);

		settingsVector = [
			`ps${state.ps}`,
			`sm${state.sm}`,
			`nm${state.nm}`,
			`ts${state.ts}`,
			`hs${state.hs}`,
			`hl${state.hl}`,
			`ns${state.ns}`,
			`ss${state.ss}`
		].join(':');

		doc = renderPdfDocument(
			calenderData,
			{
				sheetSize: Object.keys(papersizes)[state.ps],
				headingSizing: state.hs,
				titleSizing: state.ts,
				numberOfMonths: state.nm,
				numeralSizing: state.ns,
				headingLength: state.hl,
				strokeSizing: state.ss
			},
			settingsVector
		);

		if (browser) {
			goto(`/?${settingsVector}`);
		}
	}

	// Create repeatable vector
	// Update PDF from vector
</script>

<div class="app">
	<div class="controls">
		<header>
			<h1>Printable {state.sy} Calendar</h1>
			<h2>One month per page</h2>
		</header>

		<div class="controls__group">
			<InputSelect label="Paper format" options={sheetSizeOptions} bind:value={state.ps} />
		</div>

		<div class="controls__group">
			<InputSelect label="Starting month" options={availableMonths} bind:value={state.sm} />

			<InputQty bind:value={state.sy} label="Starting Year" />
		</div>

		<div class="controls__group">
			<InputQty bind:value={state.nm} label="Number of Months" />
			<InputQty bind:value={state.ts} label="Month type size" unit="pt" />
			<InputQty bind:value={state.ml} label="Month length" />
		</div>

		<div class="controls_group">
			<InputQty bind:value={state.hs} label="Weekday type size" unit="pt" />
			<InputQty bind:value={state.hl} label="Weekday length" />
			<InputQty bind:value={state.ns} label="Numerals Size" unit="pt" />
		</div>

		<div class="controls__group">
			Numeral alignment Horizontal
			<div><label for="">Bottom<input type="radio" /></label></div>
		</div>
		<InputQty bind:value={state.ss} label="Stroke Size" unit="pt" />

		<button
			class="bigolbutton"
			on:click={() => {
				return doc.save('CalendarDownload.pdf');
			}}>Download</button
		>
	</div>

	{#if doc}
		<div class="wall">
			<div class="sheet-wrapper">
				<div class="sheet">
					<embed
						src={doc.output('datauristring')}
						type="application/pdf"
						heigth="100%"
						width="100%"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* css will go here */
	.app {
		display: flex;
		height: calc(100vh);
		justify-content: space-between;
	}

	.controls {
		width: 34%;
	}

	.wall {
		border-left: 1px solid hsla(28, 100%, 88%, 1);
		background: peachpuff;
		width: 66%;
		display: flex;
		justify-content: center;
	}
</style>
