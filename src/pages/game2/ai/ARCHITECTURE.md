# Arsenal Calculator — Architecture Guide

This document exists to help **AI agents and developers** understand the structure of this feature.

The goal of this project is:

> Calculate cumulative LMD and EXP costs for Arknights operator upgrades.

The system reads TSV input and produces calculated rows with cumulative resource requirements.

---

# High Level Architecture

```
Page
 ↓
Layout
 ↓
Feature UI
 ↓
Components
 ↓
Hooks
 ↓
Core Logic
 ↓
Types
```

---

# Folder Responsibilities

## layout/

Page layout and visual composition.

Example:

```
ArsenalLayout.tsx
```

Responsibilities:

* Compose page UI
* Connect hooks to UI
* No business logic

---

## features/

Feature-level UI blocks.

Example:

```
Toolbar.tsx
```

Responsibilities:

* Import / Export actions
* Page controls

---

## components/

Reusable UI components.

Examples:

```
InventoryCard.tsx
TableArea.tsx
TableRowItem.tsx
```

Responsibilities:

* Render UI
* Forward events to hooks
* No global state logic

---

## hooks/

React state orchestration.

Examples:

```
useArsenalCalculator.ts
useTableItems.ts
```

Responsibilities:

* State management
* Persistence
* Event handlers

---

## core/

Pure calculation logic.

Example:

```
calcArsenalRows.ts
```

Rules:

* No React
* No UI
* Deterministic pure functions

---

## config/

System configuration.

Examples:

```
constants.ts
```

Contains:

* cost constants
* TSV format
* UI constants

---

## types/

Data models used across the system.

```
IItem
IInventory
IRowResult
```

---

# Data Flow

```
Clipboard TSV
      ↓
useArsenalCalculator
      ↓
items[] + inventory
      ↓
calcArsenalRows()
      ↓
rows[]
      ↓
TableArea
```

---

# Important Rules

### Components must NOT calculate business logic

All calculations must live in:

```
core/
```

---

### Hooks manage state

State such as:

* items
* inventory
* persistence

must live inside hooks.

---

### Types are the contract

Changing types may break:

* TSV import
* cost calculations
* UI bindings

---

# AI Handover Instructions

When modifying this project:

1. Do NOT move business logic into UI components
2. Keep calculations inside `core/`
3. Prefer extending hooks instead of expanding components
4. Preserve TSV compatibility

---

# Future Extensions

Possible features:

• Stage farming estimation
• Resource deficit analysis
• Multi-profile inventory
• CSV export
