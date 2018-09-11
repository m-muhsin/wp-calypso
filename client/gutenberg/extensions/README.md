# Gutenberg extensions

This folder holds extensions for Gutenberg editor. You can either import them directly from here or build them using Calypso SDK. See [SDK documentation](../../../docs/sdk.md).

Your extension should follow this structure:

```
.
└── blockname/
    ├── blockname-editor.js    ← script loaded only in the editor
    ├── blockname-editor.scss  ← styles loaded only in the editor
    ├── blockname.js           ← script loaded in the editor and theme
    └── blockname.scss         ← styles loaded in the editor and theme
```

If your block depends on another block, place them all in extensions folder:

```
.
├── blockname/
└── sub-blockname/
```

## Presets

You can combine multiple extensions to one build by adding them to a preset.

Presets follow the same structure as blocks, just under `presets` folder:

```
.
└── presets/
    └── presetname/
        ├── presetname-editor.js
        ├── presetname-editor.scss
        ├── presetname.js
        └── presetname.scss
```
