# SKILL: UI Styling (Radix + Tailwind)

## Rules

### 1. Prefer Radix UI Themes

- Use `@radix-ui/themes` components first
- Avoid raw HTML when Radix component exists

```tsx
// ✅
<Button>Save</Button>

// ❌
<button className="px-4 py-2">Save</button>
```

---

### 2. Use Tailwind for layout / utility only

- spacing / flex / grid / sizing
- avoid redefining component styles

```tsx
// ✅
<Button className="mt-4 w-full" />

// ❌
<Button className="bg-blue-500 text-white" />
```

---

### 3. Do NOT override Radix design tokens

- no hardcoded colors
- use theme props instead

```tsx
// ✅
<Button color="indigo" />

// ❌
<Button className="bg-indigo-500" />
```

---

## Summary

```
UI → Radix
Layout → Tailwind
Style → Radix tokens
```
