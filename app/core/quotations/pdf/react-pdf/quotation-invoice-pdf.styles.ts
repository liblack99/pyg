import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    color: "#0F172A",
    fontFamily: "Helvetica",
  },

  container: {
    width: "100%",
    maxWidth: 720, // parecido a max-w-4xl en A4
    marginLeft: "auto",
    marginRight: "auto",
  },

  paper: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  // header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  brandRow: {flexDirection: "row", alignItems: "center", gap: 10},
  logoBox: {width: 140, height: 40},
  logoName: {width: 128, height: 24},
  brandName: {fontSize: 16, fontWeight: 700, color: "#0F172A"},
  brandLegal: {fontSize: 10, color: "#64748B"},
  brandMeta: {marginTop: 10, fontSize: 10, color: "#64748B", lineHeight: 1.4},

  rightHeader: {alignItems: "flex-end"},
  capLabel: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#94A3B8",
  },
  bigNumber: {
    marginTop: 2,
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: -0.3,
    color: "#0F172A",
  },
  headerMeta: {marginTop: 10, gap: 3},
  metaLine: {fontSize: 11, color: "#334155"},
  metaMuted: {color: "#94A3B8"},
  focusCard: {
    marginTop: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    backgroundColor: "#EFF6FF",
    padding: 10,
  },
  focusLabel: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#1D4ED8",
  },
  focusTitle: {marginTop: 4, fontSize: 14, fontWeight: 700, color: "#0F172A"},
  focusSubtitle: {marginTop: 2, fontSize: 11, color: "#334155"},

  divider: {
    marginTop: 18,
    marginBottom: 18,
    height: 1,
    backgroundColor: "#F1F5F9", // slate-100
  },

  // section titles
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#94A3B8",
  },

  // client/project layout
  twoColRow: {flexDirection: "row", gap: 16},
  leftCol: {flex: 2},
  rightCol: {flex: 1},

  clientName: {marginTop: 6, fontSize: 12, fontWeight: 700, color: "#0F172A"},
  clientDoc: {marginTop: 2, fontSize: 11, color: "#475569"},

  metaGrid: {marginTop: 10, flexDirection: "row", flexWrap: "wrap"},
  metaCell: {width: "50%", paddingRight: 10, marginTop: 8},

  metaLabel: {
    fontSize: 9,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#94A3B8",
  },
  metaValue: {marginTop: 3, fontSize: 11, color: "#334155", lineHeight: 1.3},

  // project/review
  projectValue: {marginTop: 6, fontSize: 11, fontWeight: 600, color: "#0F172A"},
  projectText: {marginTop: 6, fontSize: 11, color: "#475569", lineHeight: 1.3},
  reviewText: {marginTop: 6, fontSize: 11, color: "#475569", lineHeight: 1.35},

  // table wrapper like rounded-2xl ring-1
  tableWrap: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },

  tableHead: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC", // slate-50
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  th: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#64748B",
  },

  tableBody: {},
  tr: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  // column widths matching your 12-col grid:
  // # (1), detalle (6), und (1), cant (1), p/u (1), total (2)
  cNum: {width: "8%"},
  cDetail: {width: "50%"},
  cUnit: {width: "8%"},
  cQty: {width: "8%"},
  cPU: {width: "10%"},
  cTotal: {width: "16%"},

  cellRight: {textAlign: "right"},
  numText: {fontSize: 11, fontWeight: 700, color: "#0F172A"},
  detailTitle: {fontSize: 11, fontWeight: 700, color: "#0F172A"},
  detailDesc: {marginTop: 3, fontSize: 9.5, color: "#64748B", lineHeight: 1.25},
  detailCode: {marginTop: 2, fontSize: 9.5, color: "#64748B"},

  cellText: {fontSize: 11, color: "#334155"},
  totalText: {fontSize: 11, fontWeight: 700, color: "#0F172A"},

  // AIU breakdown (replaces <details>)
  breakdown: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    padding: 10,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
  },
  breakdownLine: {fontSize: 9.5, color: "#475569"},
  breakdownStrongRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownStrong: {fontSize: 9.5, fontWeight: 700, color: "#0F172A"},

  // totals box
  totalsWrap: {marginTop: 18, flexDirection: "row", justifyContent: "flex-end"},
  totalsBox: {width: 280},
  totalsTopRow: {flexDirection: "row", justifyContent: "space-between"},
  totalsTopLabel: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#94A3B8",
  },
  totalsTopValue: {fontSize: 9, fontWeight: 700, color: "#94A3B8"},
  totalsValueRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  totalsValueLabel: {fontSize: 11, fontWeight: 600, color: "#475569"},
  totalsBig: {fontSize: 24, fontWeight: 700, color: "#0F172A"},
  totalsDivider: {marginTop: 10, height: 1, backgroundColor: "#F1F5F9"},
  totalsNote: {marginTop: 8, fontSize: 9.5, color: "#64748B"},

  // conditions
  conditionsGrid: {marginTop: 10, flexDirection: "row", flexWrap: "wrap"},
  conditionCell: {width: "50%", paddingRight: 10, marginTop: 10},
  conditionWide: {width: "100%", marginTop: 10},

  // terms list
  termsList: {marginTop: 10},
  termItem: {flexDirection: "row", gap: 8, marginTop: 6},
  termIndex: {width: 14, fontSize: 11, color: "#64748B"},
  termText: {flex: 1, fontSize: 11, color: "#334155", lineHeight: 1.35},

  // footer
  footer: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9.5,
    color: "#64748B",
  },
  footerStrong: {fontWeight: 600, color: "#334155"},
});
