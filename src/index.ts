import { version } from "../package.json";
import "./adjustable-feature";
import "./ha-types";

(window.customCardFeatures ??= []).push({
  type: "adjustable-card-feature",
  name: "Adjustable feature",
  configurable: true,
});

console.info("Home Assistant adjustable card feature v%s", version);
