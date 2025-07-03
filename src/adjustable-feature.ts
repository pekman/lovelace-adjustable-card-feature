// Adapted from HA frontend's src/panels/lovelace/types.ts
interface LovelaceCardFeature extends HTMLElement {
  hass?: unknown;
  /** @deprecated Use `context` instead */
  stateObj?: unknown;
  context?: unknown;
  setConfig(config: object): void;
  color?: string;
  position?: unknown;
}

interface AdjustableCardFeatureConfig {
  type: "custom:adjustable-card-feature";
  subfeature: {
    type: string;
    [key: string]: unknown;
  };
}

/**
 * Property decorator that reflects value to subfeature element.
 *
 * Also keep local copy of the value so that it can be sent to a new
 * subfeature element when created. Reflection is one direction only;
 * we assume that the subfeature doesn't change the value itself and
 * that HA wouldn't care even it it did.
 */
function reflectToSubfeature(target: unknown, name: string) {
  let value: unknown;
  Object.defineProperty(target, name, {
    get() {
      return value;
    },
    set(val: unknown) {
      value = val;
      if (this.firstChild)
        this.firstChild[name] = val;
    },
  });
}

export class AdjustableCardFeature
extends HTMLElement implements LovelaceCardFeature {
  @reflectToSubfeature public hass?: unknown;
  @reflectToSubfeature public context?: unknown;
  @reflectToSubfeature public color?: string;
  @reflectToSubfeature public position?: unknown;
  @reflectToSubfeature public stateObj?: unknown;

  private _config?: AdjustableCardFeatureConfig;

  public static getStubConfig(): AdjustableCardFeatureConfig {
    return {
      type: "custom:adjustable-card-feature",
      subfeature: {
        type: "",
      },
    };
  }

  public setConfig(config: AdjustableCardFeatureConfig) {
    if (!config?.subfeature?.type) {
      throw new Error("Invalid configuration");
    }

    if (config.subfeature.type !== this._config?.subfeature?.type ) {
      // Subfeature type changed or initially set. Create new subfeature.
      this._changeSubfeature(config.subfeature);
    }
    else if (this.firstChild && "setConfig" in this.firstChild) {
      // Subfeature exists and not changed. Pass subfeature config to it.
      (this.firstChild as LovelaceCardFeature).setConfig(config.subfeature);
    }

    this._config = config;
  }

  private _changeSubfeature(
    config: AdjustableCardFeatureConfig["subfeature"],
  ) {
    this.replaceChildren();  // remove old subfeature element, if any

    const featType = config.type;
    let elementName: string;
    const match = /^custom:(.*)$/.exec(featType);
    if (match) {  // custom feature
      elementName = match[1];
      if (window.customCardFeatures?.every((feature) =>
            "type" in feature && feature.type !== elementName)
      ) {
        throw new Error(`Unknown custom feature: ${elementName}`);
      }
    }
    else {  // HA's own feature
      // HA frontend has its own element naming scheme that isn't
      // really part of any public API. This will break if the naming
      // scheme changes.
      elementName = `hui-${featType}-card-feature`;
    }

    const elementClass = window.customElements.get(elementName);
    if (!elementClass)
      throw new Error(`Element not found: ${elementName}`);

    const element = new elementClass() as LovelaceCardFeature;
    if (this.hass)
      element.hass = this.hass;
    if (this.context)
      element.context = this.context;
    if (this.color)
      element.color = this.color;
    if (this.position)
      element.position = this.position;
    if (this.stateObj)
      element.stateObj = this.stateObj;
    if ("setConfig" in element)
      element.setConfig(config);

    this.append(element);
  }
}

window.customElements.define(
  "adjustable-card-feature",
  AdjustableCardFeature);
