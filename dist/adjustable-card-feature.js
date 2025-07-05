var version = "0.0.1";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Property decorator that reflects value to subfeature element.
 *
 * Also keep local copy of the value so that it can be sent to a new
 * subfeature element when created. Reflection is one direction only;
 * we assume that the subfeature doesn't change the value itself and
 * that HA wouldn't care even it it did.
 */
function reflectToSubfeature(target, name) {
    let value;
    Object.defineProperty(target, name, {
        get() {
            return value;
        },
        set(val) {
            value = val;
            if (this.firstChild)
                this.firstChild[name] = val;
        },
    });
}
class AdjustableCardFeature extends HTMLElement {
    static getStubConfig() {
        function dedent([s]) {
            const indent = /^[ \t]+/m.exec(s)?.[0];
            return s.replaceAll(`\n${indent}`, "\n").trim();
        }
        return {
            type: "custom:adjustable-card-feature",
            subfeature: {
                type: "",
                NOTE: dedent `
          Configuration for the wrapped feature
          goes here.

          Suggested steps:
          1. Add and configure a card feature in
             the graphical card configuration as
             usual.
          2. Edit card configuration as YAML, and
             move the new feature's configuration
             here. (Don't include the "-".)
          3. Add styles below.
        `,
            },
            style: dedent `
        /*
         * Put CSS declarations here.
         * No selectors, just property-value pairs,
         * including variable declarations.
         */

        /* Examples: */
        /* --feature-height: 84px; */
        /* --feature-button-spacing: 6px; */
        /* --feature-color: #4a412a; */
      `,
        };
    }
    setConfig(config) {
        if (!config?.subfeature?.type) {
            throw new Error("Invalid configuration");
        }
        if (config.subfeature.type !== this._config?.subfeature?.type) {
            // Subfeature type changed or initially set. Create new subfeature.
            this._changeSubfeature(config.subfeature);
        }
        else if (this.firstChild) {
            // Subfeature exists and not changed. Pass subfeature config to it.
            this.firstChild.setConfig(config.subfeature);
        }
        if (typeof config.style === "string") {
            this.style = config.style;
        }
        else if (config.style && typeof config.style === "object") {
            for (const [name, value] of Object.entries(config.style)) {
                this.style.setProperty(name, value);
            }
        }
        this._config = config;
    }
    _changeSubfeature(config) {
        this.replaceChildren(); // remove old subfeature element, if any
        const featType = config.type;
        let elementName;
        const match = /^custom:(.*)$/.exec(featType);
        if (match) { // custom feature
            elementName = match[1];
            if (window.customCardFeatures?.every((feature) => feature.type !== elementName)) {
                throw new Error(`Unknown custom feature: ${elementName}`);
            }
        }
        else { // HA's own feature
            // HA frontend has its own element naming scheme that isn't
            // really part of any public API. This will break if the naming
            // scheme changes.
            elementName = `hui-${featType}-card-feature`;
        }
        const elementClass = window.customElements.get(elementName);
        if (!elementClass)
            throw new Error(`Element not found: ${elementName}`);
        const element = new elementClass();
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
__decorate([
    reflectToSubfeature
], AdjustableCardFeature.prototype, "hass", void 0);
__decorate([
    reflectToSubfeature
], AdjustableCardFeature.prototype, "context", void 0);
__decorate([
    reflectToSubfeature
], AdjustableCardFeature.prototype, "color", void 0);
__decorate([
    reflectToSubfeature
], AdjustableCardFeature.prototype, "position", void 0);
__decorate([
    reflectToSubfeature
], AdjustableCardFeature.prototype, "stateObj", void 0);
window.customElements.define("adjustable-card-feature", AdjustableCardFeature);

(window.customCardFeatures ??= []).push({
    type: "adjustable-card-feature",
    name: "Adjustable feature",
    configurable: true,
});
console.info("Home Assistant adjustable card feature v%s", version);
//# sourceMappingURL=adjustable-card-feature.js.map
