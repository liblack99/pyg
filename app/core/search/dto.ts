export type UniversalSearchItemType = "CLIENT" | "QUOTATION" | "PROJECT";

export type UniversalSearchItem = {
  id: string;
  type: UniversalSearchItemType;
  title: string;
  subtitle: string;
  description: string | null;
  meta: string | null;
  href: string;
};

export type UniversalSearchResult = {
  items: UniversalSearchItem[];
  nextCursor: null;
};
