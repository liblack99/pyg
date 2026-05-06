import {Image, Page, Text, View} from "@react-pdf/renderer";
import type {ProductionOrder} from "../dto";
import {styles} from "./production-order-pdf.styles";
import {getProductionOrderDocumentStatusLabel} from "../utils/production-order-status";

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function moneyCOP(v: unknown) {
  const n = toNumber(v);
  return n.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export function ProductionOrderPdf({
  op,
  brandLogoSrc,
}: {
  op: ProductionOrder;
  brandLogoSrc?: string | null;
  brandNameLogoSrc?: string | null;
}) {
  const primaryName = op.projectName ?? "-";
  const items = op.items ?? [];
  const totalItems = items.reduce((acc, it) => acc + (it.quantity ?? 0), 0);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.paper}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.brandRow}>
                {brandLogoSrc ? (
                  <Image src={brandLogoSrc} style={styles.logoBox} />
                ) : (
                  <View>
                    <Text style={styles.brandName}>Parque y Grama</Text>
                    <Text style={styles.brandLegal}>
                      Parque y Grama Construcciones S.A.S.
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.brandLegalStrong}>
                Parque y Grama Construcciones S.A.S.
              </Text>
              <Text style={styles.brandMeta}>
                NIT: 901.495.979-7{"\n"}
                Telefono: (+57) (5) 339 6767{"\n"}
                Direccion: Carrera 67 # 76-102{"\n"}
                Barranquilla - Colombia
              </Text>
            </View>

            <View style={styles.headerRight}>
              <Text style={styles.bigNumber}>
                {op?.orderNumber ? `No. ${op.orderNumber}` : "-"}
              </Text>

              <View style={styles.headerMeta}>
                <Text style={styles.clientLabel}>Cliente / Proyecto:</Text>
                <Text style={styles.clientName}>{primaryName}</Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaMuted}>Fecha: </Text>
                  {op?.date}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaMuted}>Proveedor:</Text>{" "}
                  {op?.providerName ?? "-"}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaMuted}>Estado:</Text>{" "}
                  {getProductionOrderDocumentStatusLabel(op)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Text style={styles.sectionTitle}>Referencia</Text>
              <Text style={styles.summaryValue}>{op?.reference ?? "-"}</Text>

              <View style={styles.summaryGrid}>
                <View style={styles.summaryCell}>
                  <Text style={styles.metaLabel}>Forma de instalacion</Text>
                  <Text style={styles.metaValue}>
                    {op?.installationMethod ?? "-"}
                  </Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.metaLabel}>Fecha de entrega</Text>
                  <Text style={styles.metaValue}>
                    {op?.deliveryDateText ?? "-"}
                  </Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.metaLabel}>Color</Text>
                  <Text style={styles.metaValue}>{op?.color ?? "-"}</Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={styles.metaLabel}>Items</Text>
                  <Text style={styles.metaValue}>
                    {items.length} - Cant. total {totalItems}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.summaryRight}>
              <Text style={styles.sectionTitle}>Observaciones</Text>
              <Text style={styles.noteText}>{op?.observations ?? "-"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.tableWrap}>
            <View style={styles.tableHead}>
              <View style={styles.cNum}>
                <Text style={styles.th}>#</Text>
              </View>
              <View style={styles.cDetail}>
                <Text style={styles.th}>Descripcion</Text>
              </View>
              <View style={styles.cQty}>
                <Text style={[styles.th, styles.cellRight]}>Cant</Text>
              </View>
              <View style={styles.cPU}>
                <Text style={[styles.th, styles.cellRight]}>
                  Valor unitario
                </Text>
              </View>
              <View style={styles.cTotal}>
                <Text style={[styles.th, styles.cellRight]}>Valor</Text>
              </View>
            </View>

            <View style={styles.tableBody}>
              {items.map((it, idx) => (
                <View key={idx} style={styles.tr}>
                  <View style={styles.cNum}>
                    <Text style={styles.numText}>
                      {String(idx + 1).padStart(2, "0")}
                    </Text>
                  </View>
                  <View style={styles.cDetail}>
                    <Text style={styles.detailTitle}>
                      {it.description || "Item"}
                    </Text>
                  </View>
                  <View style={styles.cQty}>
                    <Text style={[styles.cellText, styles.cellRight]}>
                      {toNumber(it.quantity)}
                    </Text>
                  </View>
                  <View style={styles.cPU}>
                    <Text style={[styles.cellText, styles.cellRight]}>
                      {moneyCOP(it.unitCost)}
                    </Text>
                  </View>
                  <View style={styles.cTotal}>
                    <Text style={[styles.totalText, styles.cellRight]}>
                      {moneyCOP(it.totalCost)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.totalsWrap}>
            <View style={styles.totalsBox}>
              <Text style={styles.sectionTitle}>Resumen de costos</Text>

              <View style={styles.kvRow}>
                <Text style={styles.k}>Costo de fabricacion</Text>
                <Text style={styles.v}>{moneyCOP(op.fabricationCost)}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.k}>Administracion</Text>
                <Text style={styles.v}>{moneyCOP(op.administrativeCost)}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.k}>Imprevistos</Text>
                <Text style={styles.v}>{moneyCOP(op.impCost)}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.k}>Utilidad</Text>
                <Text style={styles.v}>{moneyCOP(op.utilCost)}</Text>
              </View>

              <View style={styles.totalsDivider} />

              <View style={styles.kvRow}>
                <Text style={styles.kStrong}>Subtotal</Text>
                <Text style={styles.vStrong}>{moneyCOP(op.subtotal)}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.k}>IVA</Text>
                <Text style={styles.v}>{moneyCOP(op.iva)}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.k}>ReteFuente</Text>
                <Text style={styles.v}>- {moneyCOP(op.retentions)}</Text>
              </View>
              <View style={styles.kvRow}>
                <Text style={styles.k}>ReteICA</Text>
                <Text style={styles.v}>- {moneyCOP(op.reteica)}</Text>
              </View>

              <View style={styles.totalsDivider} />

              <View style={styles.kvRow}>
                <Text style={styles.totalPayLabel}>Valor a pagar</Text>
                <Text style={styles.totalPayValue}>
                  {moneyCOP(op.totalCost)}
                </Text>
              </View>
              <Text style={styles.totalsNote}>
                * Valores expresados en COP.
              </Text>
            </View>
          </View>

          <View style={styles.signRow}>
            <View style={styles.signCol}>
              <Text style={styles.signLabel}>Elaboro</Text>
              <Text style={styles.signValue}>{op?.elaboratedBy ?? "-"}</Text>
            </View>
            <View style={styles.signCol}>
              <Text style={styles.signLabel}>Reviso</Text>
              <Text style={styles.signValue}>{op?.reviewedBy ?? "-"}</Text>
            </View>
            <View style={styles.signCol}>
              <Text style={styles.signLabel}>Autorizo</Text>
              <Text style={styles.signValue}>{op?.authorizedBy ?? "-"}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}
