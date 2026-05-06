import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {padding: 18, fontSize: 10, fontFamily: "Helvetica"},
  container: {flex: 1},
  paper: {
    padding: 14,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {width: "58%"},
  headerRight: {width: "40%", alignItems: "flex-end"},

  clientLabel: {fontSize: 9, marginTop: 9, fontWeight: 700},
  clientName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0F172A",
    marginTop: 4,
    lineHeight: 1,
    marginBottom: 4,
  },
  clientHint: {marginTop: 4, color: "#475569", fontSize: 9, marginBottom: 8},
  clientDivider: {height: 1, backgroundColor: "#E5E7EB", marginVertical: 10},

  brandName: {fontSize: 16, fontWeight: 700},
  brandLegal: {fontSize: 10, marginTop: 2},
  brandLegalStrong: {fontSize: 10, marginTop: 4, fontWeight: 700},
  brandRow: {flexDirection: "row", alignItems: "center", gap: 8},
  logoBox: {width: 140, height: 40, marginBottom: 2, objectFit: "contain"},
  logoName: {width: 120, height: 22},
  brandMeta: {marginTop: 8, lineHeight: 1, color: "#374151"},
  clientCard: {
    marginTop: 10,
    borderRadius: 6,
  },

  capLabel: {fontSize: 10, color: "#6B7280"},
  bigNumber: {fontSize: 14, fontWeight: 700, marginTop: 2, marginBottom: 2},
  headerMeta: {marginTop: 10},
  metaLine: {lineHeight: 1},
  metaMuted: {color: "#6B7280"},

  divider: {height: 1, backgroundColor: "#E5E7EB", marginVertical: 10},

  sectionTitle: {fontSize: 11, fontWeight: 700, marginBottom: 6},

  summaryRow: {flexDirection: "row", gap: 10},
  summaryLeft: {width: "62%"},
  summaryRight: {width: "38%"},
  summaryValue: {fontSize: 10, color: "#111827", lineHeight: 1.35},
  noteText: {color: "#374151", lineHeight: 1.35},

  summaryGrid: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryCell: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    borderRadius: 6,
  },
  metaLabel: {fontSize: 9, color: "#6B7280"},
  metaValue: {marginTop: 3, color: "#111827", lineHeight: 1.2},

  tableWrap: {marginTop: 2},
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 6,
  },
  tableBody: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  tr: {
    flexDirection: "row",
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  cNum: {width: "6%", paddingHorizontal: 8},
  cDetail: {width: "52%", paddingHorizontal: 8},
  cQty: {width: "10%", paddingHorizontal: 8},
  cPU: {width: "16%", paddingHorizontal: 8},
  cTotal: {width: "16%", paddingHorizontal: 8},

  th: {fontSize: 9, fontWeight: 700, color: "#111827"},
  numText: {color: "#6B7280"},
  detailTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.2,
  },

  cellText: {color: "#111827"},
  cellRight: {textAlign: "right"},
  totalText: {fontWeight: 700},

  totalsWrap: {marginTop: 12, flexDirection: "row", justifyContent: "flex-end"},
  totalsBox: {
    width: "58%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
  },
  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  k: {color: "#374151"},
  v: {color: "#111827"},
  kStrong: {fontWeight: 700},
  vStrong: {fontWeight: 700},
  totalsDivider: {height: 1, backgroundColor: "#E5E7EB", marginVertical: 6},
  totalPayLabel: {fontSize: 11, fontWeight: 700},
  totalPayValue: {fontSize: 12, fontWeight: 700},
  totalsNote: {marginTop: 6, color: "#6B7280", fontSize: 9},

  signRow: {marginTop: 14, flexDirection: "row", gap: 10},
  signCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    minHeight: 44,
    justifyContent: "space-between",
  },
  signLabel: {fontSize: 9, color: "#6B7280"},
  signValue: {fontSize: 10, fontWeight: 700},
});
