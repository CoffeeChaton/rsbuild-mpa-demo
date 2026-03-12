export interface IItemBundle {
  items: Record<string, { name: { tw: string }, rare: number }>;
  nameToIdMap: Map<string, string>;
}

export function analyzeSource(
  content: string,
  bundle: unknown,
  isJson: boolean,
): Map<string, number> {
  const map = new Map<string, number>();
  if (!content || !bundle) return map;

  const typedBundle = bundle as IItemBundle;

  if (isJson) {
    try {
      const data = JSON.parse(content) as Record<string, number>;
      Object.entries(data).forEach(([k, v]) => map.set(k, v));
    } catch {
      console.error("analyzeSource has error");
    }
  } else {
    content.trim().split("\n").forEach(l => {
      const c = l.split("\t");
      if (c.length < 3) return;

      const id = typedBundle.nameToIdMap?.get(c[1]) || c[1];
      const val = parseInt(c[2]) || 0;

      map.set(id, (map.get(id) || 0) + val);
    });
  }

  return map;
}
