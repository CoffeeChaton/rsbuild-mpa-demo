---
name: ark-data-wizard
description: Handle Arknights data compilation, validation, and calculation workflows in this project. Use when working on game data under `scripts/input/`, compiled JSON outputs, Valibot schemas, or level/material calculation logic in `src/pages/game2/core/`.
---

# Ark Data Wizard

- Read raw data from `scripts/input/` before changing any generated outputs.
- Run `pnpm scripts:compile-materials` after modifying material-related source data so frontend JSON stays in sync.
- Validate schema changes against the Valibot definitions under `shared/schemas/`.
- Preserve calculation accuracy for leveling and resource formulas in `src/pages/game2/core/`; do not simplify formulas without verifying behavior.
- Keep persisted data compatible with multiple `ConfigId` values when local storage is involved.
