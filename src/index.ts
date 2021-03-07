import App from "./App.svelte";

const target = document.querySelector("#App");

if (target) {
  new App({
    target,
  });
}
