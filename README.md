Adjustable card features for Home Assistant
===========================================

Allows style customizations for Home Assistant card features. Most notably, you
can change a feature's size or color.

This is a Home Assistant card feature that wraps another card feature as a
subfeature and sets style declarations for it.


Installing
----------

### Using [HACS][] ###

Install from [custom repository][hacs-customrepo]. In HACS dashboard, open
top-right menu, select *Custom repositories*, and enter the following:

- Repository: `https://github.com/pekman/lovelace-adjustable-card-feature.git`
- Type: Dashboard

### Manually ###

1. Run:
   ``` sh
   npm install
   npm build
   ```

3. See [Home Assistant's documentation about registering
   resources][hass-resources]. The file to copy and register is
   `dist/adjustable-card-feature.js`.


Configuration
-------------

Graphical configuration is not supported; only YAML configuration is possible.

(This is because Home Assistant doesn't expose information about its own card
features for custom dashboard items. This makes graphical subfeature
configuration pretty much impossible.)

Configuration schema:
``` yaml
type: "custom:adjustable-card-feature",
subfeature:
  type: "CARD FEATURE TYPE"
  # other settings for the subfeature
style: |-
  /* CSS declarations */

```

Suggested steps:

1. Add and configure a card feature in the graphical card configuration as
   usual.

2. Add a new adjustable feature.

3. Edit card configuration as YAML. Move the new feature's configuration under
   the adjustable feature's `subfeature` key. (Don't include the "-"; it's not a
   list.)

3. Add styles under `style` key. Its value should be a string containing CSS
   declarations (no selectors), including variable declarations, which Home
   Assistant uses for a lot of styling.

Notable variables to adjust:
   
- `--feature-height: 42px;`
- `--feature-button-spacing: 12px;`
- `--feature-color: #4a412a;`


[HACS]: https://www.hacs.xyz/
[hacs-customrepo]: https://hacs.xyz/docs/faq/custom_repositories/
[hass-resources]: https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources
