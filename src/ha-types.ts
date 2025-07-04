// Stub types for Home Assistant data.
//
// Types borrowed and adapted from Home Assistant frontend. Types
// whose internals we don't care about replaced with opaque types.

type BrandedHassType<name> = { _hassType: name };

export interface LovelaceCardFeature extends HTMLElement {
  hass?: BrandedHassType<"HomeAssistant">;
  /** @deprecated Use `context` instead */
  stateObj?: BrandedHassType<"HassEntity">;
  context?: BrandedHassType<"LovelaceCardFeatureContext">;
  setConfig(config: LovelaceCardFeatureConfig): void;
  color?: string;
  position?: BrandedHassType<"LovelaceCardFeaturePosition">;
}

export interface LovelaceCardFeatureConfig {
  type: string;
}

interface CustomCardFeatureEntry {
  type: string;
  name?: string;
  /** @deprecated Use `isSupported` */
  supported?: (stateObj: BrandedHassType<"HassEntity">) => boolean;
  isSupported?: (
    hass: BrandedHassType<"HomeAssistant">,
    context: BrandedHassType<"LovelaceCardFeatureContext">,
  ) => boolean;
  configurable?: boolean;
}

declare global {
  interface Window {
    customCardFeatures?: CustomCardFeatureEntry[],
  }
}
