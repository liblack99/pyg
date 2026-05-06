import type {Quotation, QuotationTerm} from "@/app/core/quotations/dto";
import {Page, Text, View, Image} from "@react-pdf/renderer";
import {styles} from "./quotation-invoice-pdf.styles";
import {calculateItemTotals} from "@/app/utils/calculateItem"; // ajusta ruta real

type ClientSnap = {
  name?: string;
  documentType?: string;
  documentNumber?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  contact?: string | null;
  city?: string | null;

  // soportar tu Client DTO también
  contactName1?: string | null;
  contactRole1?: string | null;
  contactPhone1?: string | null;
};

function fmtDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

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

function acceptedTerms(terms?: QuotationTerm[]) {
  if (!terms?.length) return [];
  return terms.filter((t) => t.accepted).sort((a, b) => a.order - b.order);
}

function parseClientSnapshot(snapshot: unknown): ClientSnap {
  if (!snapshot || typeof snapshot !== "object") return {};
  return snapshot as ClientSnap;
}

function bestContact(client: ClientSnap): string {
  if (client.contact && client.contact.trim()) return client.contact;

  const parts = [
    client.contactName1?.trim(),
    client.contactRole1?.trim(),
    client.contactPhone1?.trim(),
  ].filter(Boolean);

  return parts.length ? parts.join(" • ") : "—";
}

export function QuotationInvoicePdf({
  q,
  brandLogoSrc,
}: {
  q: Quotation;
  brandLogoSrc?: string | null;
  brandNameLogoSrc?: string | null;
}) {
  const client = parseClientSnapshot(q.clientSnapshot as unknown);
  const items = q.items ?? [];
  const termsOk = acceptedTerms(q.terms);

  const hasConditions = Boolean(
    q.timeDelivery ||
    q.workLocation ||
    q.guarantees ||
    q.commercialCondition ||
    q.paymentMethod ||
    q.specialConditions,
  );

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.paper}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <View>
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
              <Text style={styles.brandMeta}>
                NIT: 901.495.979-7{"\n"}
                Telefono: (+57) (5) 339 6767{"\n"}
                Direccion: Carrera 67 # 76-102{"\n"}
                Barranquilla • Colombia
              </Text>
            </View>
            <View style={styles.rightHeader}>
              <Text style={styles.capLabel}>Cotización</Text>
              <Text style={styles.bigNumber}>{q.numberQuotation}</Text>

              <View style={styles.headerMeta}>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaMuted}>Fecha:</Text> {fmtDate(q.date)}
                </Text>
                <Text style={styles.metaLine}>
                  <Text style={styles.metaMuted}>Vigencia:</Text> {q.validDays}{" "}
                  días
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* CLIENTE + PROYECTO */}
          <View style={styles.twoColRow}>
            <View style={styles.leftCol}>
              <Text style={styles.sectionTitle}>Cliente</Text>
              <Text style={styles.clientName}>
                {client?.name ?? "Sin cliente"}
              </Text>
              <Text style={styles.clientDoc}>
                {client?.documentType ?? "Documento"}:{" "}
                {client?.documentNumber ?? "—"}
              </Text>

              <View style={styles.metaGrid}>
                <View style={styles.metaCell}>
                  <Text style={styles.metaLabel}>Contacto</Text>
                  <Text style={styles.metaValue}>{bestContact(client)}</Text>
                </View>
                <View style={styles.metaCell}>
                  <Text style={styles.metaLabel}>Teléfono</Text>
                  <Text style={styles.metaValue}>{client?.phone ?? "—"}</Text>
                </View>
                <View style={styles.metaCell}>
                  <Text style={styles.metaLabel}>Email</Text>
                  <Text style={styles.metaValue}>{client?.email ?? "—"}</Text>
                </View>
                <View style={styles.metaCell}>
                  <Text style={styles.metaLabel}>Dirección</Text>
                  <Text style={styles.metaValue}>
                    {client?.address ?? "—"}
                    {client?.city ? ` • ${client.city}` : ""}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.rightCol}>
              <Text style={styles.sectionTitle}>Detalles del Proyecto</Text>
              <Text style={styles.projectValue}>
                {q.projectReference
                  ? q.projectReferenceDetail
                    ? `${q.projectReference} ${q.projectReferenceDetail}`
                    : q.projectReference
                  : "-"}
              </Text>

              <Text style={[styles.sectionTitle, {marginTop: 10}]}>
                Presentación
              </Text>
              <Text style={styles.projectText}>
                {q.projectPresentation || ""}
              </Text>

              {q.reviewTitle || q.reviewDetails ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Reseña</Text>
                  <Text style={styles.projectValue}>
                    {q.reviewTitle ?? "—"}
                  </Text>
                  <Text style={styles.reviewText}>{q.reviewDetails ?? ""}</Text>
                </>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          {/* TABLA ITEMS */}
          <View style={styles.tableWrap}>
            <View style={styles.tableHead}>
              <View style={styles.cNum}>
                <Text style={styles.th}>#</Text>
              </View>
              <View style={styles.cDetail}>
                <Text style={styles.th}>Detalle</Text>
              </View>
              <View style={styles.cUnit}>
                <Text style={[styles.th, styles.cellRight]}>Und</Text>
              </View>
              <View style={styles.cQty}>
                <Text style={[styles.th, styles.cellRight]}>Cant</Text>
              </View>
              <View style={styles.cPU}>
                <Text style={[styles.th, styles.cellRight]}>P/U</Text>
              </View>
              <View style={styles.cTotal}>
                <Text style={[styles.th, styles.cellRight]}>Total</Text>
              </View>
            </View>

            <View style={styles.tableBody}>
              {items.map((it, idx) => {
                const totals = calculateItemTotals(
                  q.projectReference,
                  toNumber(it.quantity),
                  toNumber(it.unitPrice),
                  toNumber(it.adminPercent),
                  toNumber(it.imprPercent),
                  toNumber(it.utilPercent),
                  toNumber(it.ivaPercent),
                );

                return (
                  <View key={it.id ?? idx} style={styles.tr}>
                    <View style={styles.cNum}>
                      <Text style={styles.numText}>
                        {String(idx + 1).padStart(2, "0")}
                      </Text>
                    </View>

                    <View style={styles.cDetail}>
                      <Text style={styles.detailTitle}>
                        {it.productName ?? "Ítem"}
                      </Text>
                      {it.description ? (
                        <Text style={styles.detailDesc}>{it.description}</Text>
                      ) : null}
                      {it.code ? (
                        <Text style={styles.detailCode}>Código: {it.code}</Text>
                      ) : null}

                      {/* Desglose fijo (en PDF no hay details) */}
                      <View style={styles.breakdown}>
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLine}>Subtotal</Text>
                          <Text style={styles.breakdownLine}>
                            {moneyCOP(totals.subtotal)}
                          </Text>
                        </View>
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLine}>
                            Admin {it.adminPercent}%
                          </Text>
                          <Text style={styles.breakdownLine}>
                            {moneyCOP(totals.admin)}
                          </Text>
                        </View>
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLine}>
                            Impr {it.imprPercent}%
                          </Text>
                          <Text style={styles.breakdownLine}>
                            {moneyCOP(totals.impr)}
                          </Text>
                        </View>
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLine}>
                            Util {it.utilPercent}%
                          </Text>
                          <Text style={styles.breakdownLine}>
                            {moneyCOP(totals.util)}
                          </Text>
                        </View>
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLine}>
                            IVA/U {it.ivaPercent}%
                          </Text>
                          <Text style={styles.breakdownLine}>
                            {moneyCOP(totals.iva)}
                          </Text>
                        </View>

                        <View style={styles.breakdownStrongRow}>
                          <Text style={styles.breakdownStrong}>Total ítem</Text>
                          <Text style={styles.breakdownStrong}>
                            {moneyCOP(totals.total)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.cUnit}>
                      <Text style={[styles.cellText, styles.cellRight]}>
                        {it.unit ?? "—"}
                      </Text>
                    </View>
                    <View style={styles.cQty}>
                      <Text style={[styles.cellText, styles.cellRight]}>
                        {toNumber(it.quantity)}
                      </Text>
                    </View>
                    <View style={styles.cPU}>
                      <Text style={[styles.cellText, styles.cellRight]}>
                        {moneyCOP(it.unitPrice)}
                      </Text>
                    </View>
                    <View style={styles.cTotal}>
                      <Text style={[styles.totalText, styles.cellRight]}>
                        {moneyCOP(totals.total)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* TOTALES */}
          <View style={styles.totalsWrap}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsTopRow}>
                <Text style={styles.totalsTopLabel}>Total general</Text>
                <Text style={styles.totalsTopValue}>
                  {items.length} {items.length > 1 ? "Productos" : "Producto"}
                </Text>
              </View>

              <View style={styles.totalsValueRow}>
                <Text style={styles.totalsValueLabel}>Valor</Text>
                <Text style={styles.totalsBig}>{moneyCOP(q.totalGeneral)}</Text>
              </View>

              <View style={styles.totalsDivider} />
              <Text style={styles.totalsNote}>
                * Valores expresados en COP.
              </Text>
            </View>
          </View>

          {/* CONDICIONES */}
          {hasConditions ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Condiciones</Text>

              <View style={styles.conditionsGrid}>
                {q.timeDelivery ? (
                  <View style={styles.conditionCell}>
                    <Text style={styles.metaLabel}>Tiempo entrega</Text>
                    <Text style={styles.metaValue}>{q.timeDelivery}</Text>
                  </View>
                ) : null}

                {q.workLocation ? (
                  <View style={styles.conditionCell}>
                    <Text style={styles.metaLabel}>Lugar de trabajo</Text>
                    <Text style={styles.metaValue}>{q.workLocation}</Text>
                  </View>
                ) : null}

                {q.paymentMethod ? (
                  <View style={styles.conditionCell}>
                    <Text style={styles.metaLabel}>Forma de pago</Text>
                    <Text style={styles.metaValue}>{q.paymentMethod}</Text>
                  </View>
                ) : null}

                {q.guarantees ? (
                  <View style={styles.conditionCell}>
                    <Text style={styles.metaLabel}>Garantías</Text>
                    <Text style={styles.metaValue}>{q.guarantees}</Text>
                  </View>
                ) : null}

                {q.commercialCondition ? (
                  <View style={styles.conditionWide}>
                    <Text style={styles.metaLabel}>Condición comercial</Text>
                    <Text style={styles.metaValue}>
                      {q.commercialCondition}
                    </Text>
                  </View>
                ) : null}

                {q.specialConditions ? (
                  <View style={styles.conditionWide}>
                    <Text style={styles.metaLabel}>Condiciones especiales</Text>
                    <Text style={styles.metaValue}>{q.specialConditions}</Text>
                  </View>
                ) : null}
              </View>
            </>
          ) : null}

          {/* TÉRMINOS ACEPTADOS */}
          {termsOk.length ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Términos aceptados</Text>

              <View style={styles.termsList}>
                {termsOk.map((t, i) => (
                  <View key={t.id} style={styles.termItem}>
                    <Text style={styles.termIndex}>{i + 1}.</Text>
                    <Text style={styles.termText}>{t.text}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text>
              Elaborado por:{" "}
              <Text style={styles.footerStrong}>{q.createdBy ?? "—"}</Text>
            </Text>
            <Text>
              {q.numberQuotation} • {fmtDate(q.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
