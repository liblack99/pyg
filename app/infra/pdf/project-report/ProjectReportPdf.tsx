import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type {Style} from "@react-pdf/types";
import type {ReactNode} from "react";
import type {
  ProjectReportAlertDto,
  ProjectReportBudgetItemDto,
  ProjectReportDocumentDto,
  ProjectReportDto,
  ProjectReportEventDto,
  ProjectReportFabricationItemDto,
  ProjectReportPurchaseDto,
  ProjectReportTimelineRowDto,
  ProjectReportWarrantyCaseDto,
} from "@/app/core/projects/report/dto/project-report.dto";

type Props = {
  report: ProjectReportDto;
  brandLogoSrc: string | null;
};

type CellProps = {
  children: string;
  width?: string;
  strong?: boolean;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingHorizontal: 34,
    paddingBottom: 42,
    fontSize: 8.6,
    fontFamily: "Helvetica",
    color: "#172033",
    backgroundColor: "#ffffff",
  },
  cover: {
    borderBottomWidth: 2,
    borderBottomColor: "#1f7a4d",
    paddingBottom: 16,
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 118,
    height: 36,
    objectFit: "contain",
  },
  brandText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#14532d",
  },
  reportBadge: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 4,
    backgroundColor: "#eaf7ef",
    color: "#14532d",
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.35,
  },
  metaGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaItem: {
    width: "31.8%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 5,
    padding: 8,
    minHeight: 42,
  },
  metaLabel: {
    fontSize: 6.8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 9.2,
    color: "#0f172a",
    fontWeight: 700,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  kpi: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dbe4ee",
    padding: 8,
    minHeight: 48,
  },
  kpiLabel: {
    fontSize: 6.8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#0f172a",
  },
  healthSuccess: {
    color: "#15803d",
  },
  healthWarning: {
    color: "#b45309",
  },
  healthDanger: {
    color: "#b91c1c",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 24,
  },
  headerRow: {
    backgroundColor: "#f8fafc",
  },
  cell: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    fontSize: 7.4,
    lineHeight: 1.25,
  },
  headerCell: {
    fontWeight: 700,
    color: "#334155",
    textTransform: "uppercase",
    fontSize: 6.4,
  },
  strong: {
    fontWeight: 700,
  },
  summaryBox: {
    marginTop: 7,
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  warningBox: {
    marginTop: 7,
    padding: 7,
    borderRadius: 5,
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    color: "#9a3412",
    fontSize: 8,
  },
  dangerBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    color: "#991b1b",
  },
  muted: {
    color: "#64748b",
  },
  empty: {
    padding: 9,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 5,
    color: "#64748b",
    backgroundColor: "#f8fafc",
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 18,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#64748b",
    fontSize: 7,
  },
});

function toneStyle(tone: "success" | "warning" | "danger") {
  if (tone === "danger") return styles.healthDanger;
  if (tone === "warning") return styles.healthWarning;
  return styles.healthSuccess;
}

function Cell({children, width = "25%", strong = false}: CellProps) {
  return (
    <Text style={[styles.cell, {width}, strong ? styles.strong : {}]}>
      {children}
    </Text>
  );
}

function HeaderCell({children, width = "25%"}: CellProps) {
  return (
    <Text style={[styles.cell, styles.headerCell, {width}]}>{children}</Text>
  );
}

function Empty({children}: {children: string}) {
  return <Text style={styles.empty}>{children}</Text>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Cover({report, brandLogoSrc}: Props) {
  const header = report.header;
  return (
    <View style={styles.cover}>
      <View style={styles.brandRow}>
        {brandLogoSrc ? (
          <Image src={brandLogoSrc} style={styles.logo} />
        ) : (
          <Text style={styles.brandText}>Parque y Grama</Text>
        )}
        <Text style={styles.reportBadge}>Reporte de proyecto</Text>
      </View>

      <Text style={styles.title}>Proyecto {header.projectCode}</Text>
      <Text style={styles.subtitle}>
        Informe ejecutivo para seguimiento de presupuesto, compras, fabricacion,
        documentos, garantias y actividad reciente.
      </Text>

      <View style={styles.metaGrid}>
        <Meta label="Cotizacion" value={header.quotationNumber} />
        <Meta label="Cliente" value={header.clientName} />
        <Meta label="Estado" value={header.projectStatusLabel} />
        <Meta label="Etapa actual" value={header.currentStageLabel} />
        <Meta label="Responsable" value={header.responsible} />
        <Meta label="Generado" value={header.generatedAt} />
      </View>
    </View>
  );
}

function Meta({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function ExecutiveSummary({report}: {report: ProjectReportDto}) {
  const summary = report.executiveSummary;
  return (
    <Section title="Resumen ejecutivo">
      <View style={styles.kpiRow}>
        <Kpi label="Total cotizacion sin IVA" value={summary.quotationWithoutIva.formatted} />
        <Kpi label="Limite de gasto 65%" value={summary.spendingLimit65.formatted} />
        <Kpi label="Presupuesto actual" value={summary.currentBudget.formatted} />
      </View>
      <View style={styles.kpiRow}>
        <Kpi label="Saldo disponible" value={summary.availableBalance.formatted} />
        <Kpi label="Porcentaje ejecutado" value={summary.executedPercentLabel} />
        <Kpi
          label="Estado general"
          value={summary.healthLabel}
          valueStyle={toneStyle(summary.healthTone)}
        />
      </View>
    </Section>
  );
}

function Kpi({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: Style;
}) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={[styles.kpiValue, valueStyle ?? {}]}>{value}</Text>
    </View>
  );
}

function TimelineTable({rows}: {rows: ProjectReportTimelineRowDto[]}) {
  return (
    <Section title="Cronograma">
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <HeaderCell width="25%">Etapa</HeaderCell>
          <HeaderCell width="25%">Fecha plan</HeaderCell>
          <HeaderCell width="25%">Fecha real</HeaderCell>
          <HeaderCell width="25%">Estado</HeaderCell>
        </View>
        {rows.map((row) => (
          <View style={styles.row} key={row.name}>
            <Cell width="25%" strong>{row.name}</Cell>
            <Cell width="25%">{row.plannedAt}</Cell>
            <Cell width="25%">{row.realAt}</Cell>
            <Cell width="25%">{row.status}</Cell>
          </View>
        ))}
      </View>
    </Section>
  );
}

function BudgetSection({report}: {report: ProjectReportDto}) {
  const budget = report.budget;
  return (
    <Section title="Presupuesto">
      {budget.items.length ? (
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <HeaderCell width="26%">Producto / descripcion</HeaderCell>
            <HeaderCell width="10%">Cant.</HeaderCell>
            <HeaderCell width="10%">Unidad</HeaderCell>
            <HeaderCell width="19%">Proveedor</HeaderCell>
            <HeaderCell width="17%">Costo unit.</HeaderCell>
            <HeaderCell width="18%">Costo total</HeaderCell>
          </View>
          {budget.items.map((item: ProjectReportBudgetItemDto) => (
            <View style={styles.row} key={item.id} wrap={false}>
              <Cell width="26%">{item.description}</Cell>
              <Cell width="10%">{item.quantity}</Cell>
              <Cell width="10%">{item.unit}</Cell>
              <Cell width="19%">{item.supplier}</Cell>
              <Cell width="17%">{item.unitCost.formatted}</Cell>
              <Cell width="18%" strong>{item.totalCost.formatted}</Cell>
            </View>
          ))}
        </View>
      ) : (
        <Empty>Sin informacion de presupuesto registrada.</Empty>
      )}

      <View style={styles.summaryBox}>
        <Text>Total presupuesto: {budget.totalBudget.formatted}</Text>
        <Text>Limite 65%: {budget.spendingLimit65.formatted}</Text>
        <Text>Saldo: {budget.balance.formatted}</Text>
        <Text>Ejecucion: {budget.usagePercentLabel}</Text>
      </View>

      {budget.warning ? (
        <Text
          style={[
            styles.warningBox,
            budget.warningTone === "danger" ? styles.dangerBox : {},
          ]}>
          {budget.warning}
        </Text>
      ) : null}
    </Section>
  );
}

function PurchasesSection({rows}: {rows: ProjectReportPurchaseDto[]}) {
  return (
    <Section title="Compras">
      {rows.length ? (
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <HeaderCell width="34%">Item</HeaderCell>
            <HeaderCell width="22%">Proveedor</HeaderCell>
            <HeaderCell width="14%">Estado</HeaderCell>
            <HeaderCell width="15%">Ordenada</HeaderCell>
            <HeaderCell width="15%">Recibida</HeaderCell>
          </View>
          {rows.map((item) => (
            <View style={styles.row} key={item.id} wrap={false}>
              <Cell width="34%">{item.item}</Cell>
              <Cell width="22%">{item.supplier}</Cell>
              <Cell width="14%">{item.statusLabel}</Cell>
              <Cell width="15%">{item.orderedAt}</Cell>
              <Cell width="15%">{item.receivedAt}</Cell>
            </View>
          ))}
        </View>
      ) : (
        <Empty>Sin informacion de compras registrada.</Empty>
      )}
    </Section>
  );
}

function FabricationSection({report}: {report: ProjectReportDto}) {
  const fabrication = report.fabrication;
  return (
    <Section title="Fabricacion">
      <View style={styles.summaryBox}>
        <Text>Estado: {fabrication.statusLabel}</Text>
        <Text>Progreso: {fabrication.progressLabel}</Text>
        <Text>Inicio plan: {fabrication.plannedStartAt}</Text>
        <Text>Fin plan: {fabrication.plannedEndAt}</Text>
      </View>
      <View style={styles.summaryBox}>
        <Text>Inicio real: {fabrication.actualStartAt}</Text>
        <Text>Fin real: {fabrication.actualEndAt}</Text>
        <Text>Notas: {fabrication.notes}</Text>
      </View>

      {fabrication.items.length ? (
        <View style={[styles.table, {marginTop: 7}]}>
          <View style={[styles.row, styles.headerRow]}>
            <HeaderCell width="30%">Nombre</HeaderCell>
            <HeaderCell width="10%">Cant.</HeaderCell>
            <HeaderCell width="12%">Unidad</HeaderCell>
            <HeaderCell width="18%">Estado</HeaderCell>
            <HeaderCell width="15%">Inicio plan</HeaderCell>
            <HeaderCell width="15%">Fin plan</HeaderCell>
          </View>
          {fabrication.items.map((item: ProjectReportFabricationItemDto) => (
            <View style={styles.row} key={item.id} wrap={false}>
              <Cell width="30%">{item.name}</Cell>
              <Cell width="10%">{item.quantity}</Cell>
              <Cell width="12%">{item.unit}</Cell>
              <Cell width="18%">{item.statusLabel}</Cell>
              <Cell width="15%">{item.plannedStartAt}</Cell>
              <Cell width="15%">{item.plannedEndAt}</Cell>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.empty, {marginTop: 7}]}>
          Sin items de fabricacion registrados.
        </Text>
      )}
    </Section>
  );
}

function DocumentsSection({rows}: {rows: ProjectReportDocumentDto[]}) {
  return (
    <Section title="Documentos">
      {rows.length ? (
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <HeaderCell width="22%">Tipo</HeaderCell>
            <HeaderCell width="30%">Titulo</HeaderCell>
            <HeaderCell width="14%">Estado</HeaderCell>
            <HeaderCell width="14%">Modo</HeaderCell>
            <HeaderCell width="20%">URL</HeaderCell>
          </View>
          {rows.map((doc) => (
            <View style={styles.row} key={doc.id} wrap={false}>
              <Cell width="22%">{doc.typeLabel}</Cell>
              <Cell width="30%">{doc.title}</Cell>
              <Cell width="14%">{doc.stateLabel}</Cell>
              <Cell width="14%">{doc.modeLabel}</Cell>
              <Cell width="20%">{doc.url}</Cell>
            </View>
          ))}
        </View>
      ) : (
        <Empty>Sin documentos registrados.</Empty>
      )}
    </Section>
  );
}

function WarrantySection({report}: {report: ProjectReportDto}) {
  const warranty = report.warranty;
  return (
    <Section title="Garantias">
      {!warranty.hasWarrantyInfo ? (
        <Empty>Sin informacion de garantias registrada.</Empty>
      ) : (
        <>
          <View style={styles.summaryBox}>
            <Text>Estado: {warranty.statusLabel}</Text>
            <Text>Inicio: {warranty.startsAt}</Text>
            <Text>Fin: {warranty.endsAt}</Text>
            <Text>Meses: {warranty.months}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text>Costo total: {warranty.costTotal.formatted}</Text>
            <Text>Casos abiertos: {String(warranty.openCasesCount)}</Text>
            <Text>Casos totales: {String(warranty.casesCount)}</Text>
          </View>
          <Text style={[styles.empty, {marginTop: 7}]}>Terminos: {warranty.terms}</Text>

          {warranty.cases.length ? (
            <View style={[styles.table, {marginTop: 7}]}>
              <View style={[styles.row, styles.headerRow]}>
                <HeaderCell width="26%">Titulo</HeaderCell>
                <HeaderCell width="14%">Tipo</HeaderCell>
                <HeaderCell width="14%">Estado</HeaderCell>
                <HeaderCell width="18%">Responsable</HeaderCell>
                <HeaderCell width="14%">Costo est.</HeaderCell>
                <HeaderCell width="14%">Costo real</HeaderCell>
              </View>
              {warranty.cases.map((item: ProjectReportWarrantyCaseDto) => (
                <View style={styles.row} key={item.id} wrap={false}>
                  <Cell width="26%">{item.title}</Cell>
                  <Cell width="14%">{item.typeLabel}</Cell>
                  <Cell width="14%">{item.statusLabel}</Cell>
                  <Cell width="18%">{item.responsibleLabel}</Cell>
                  <Cell width="14%">{item.estimatedCost.formatted}</Cell>
                  <Cell width="14%">{item.realCost.formatted}</Cell>
                </View>
              ))}
            </View>
          ) : null}
        </>
      )}
    </Section>
  );
}

function ActivitySection({activity}: {activity: ProjectReportDto["activity"]}) {
  return (
    <Section title="Alertas y actividad reciente">
      <Text style={[styles.metaLabel, {marginBottom: 4}]}>Ultimas alertas</Text>
      {activity.alerts.length ? (
        <ActivityTable rows={activity.alerts} />
      ) : (
        <Empty>Sin alertas recientes.</Empty>
      )}
      <Text style={[styles.metaLabel, {marginTop: 8, marginBottom: 4}]}>
        Ultimos eventos
      </Text>
      {activity.events.length ? (
        <ActivityTable rows={activity.events} />
      ) : (
        <Empty>Sin eventos recientes.</Empty>
      )}
    </Section>
  );
}

type ActivityRow = ProjectReportAlertDto | ProjectReportEventDto;

function ActivityTable({rows}: {rows: ActivityRow[]}) {
  return (
    <View style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        <HeaderCell width="18%">Fecha</HeaderCell>
        <HeaderCell width="16%">Modulo</HeaderCell>
        <HeaderCell width="26%">Titulo</HeaderCell>
        <HeaderCell width="40%">Descripcion</HeaderCell>
      </View>
      {rows.map((row) => (
        <View style={styles.row} key={row.id} wrap={false}>
          <Cell width="18%">{row.createdAt}</Cell>
          <Cell width="16%">{row.moduleLabel}</Cell>
          <Cell width="26%" strong>{row.title}</Cell>
          <Cell width="40%">{row.description}</Cell>
        </View>
      ))}
    </View>
  );
}

function Footer({generatedAt}: {generatedAt: string}) {
  return (
    <View style={styles.footer} fixed>
      <Text>Reporte generado automaticamente por Parque y Grama ERP</Text>
      <Text>{generatedAt}</Text>
      <Text render={({pageNumber, totalPages}) => `Pagina ${pageNumber} de ${totalPages}`} />
    </View>
  );
}

export function ProjectReportPdf({report, brandLogoSrc}: Props) {
  return (
    <Document title={`Reporte proyecto ${report.header.projectCode}`}>
      <Page size="A4" style={styles.page}>
        <Cover report={report} brandLogoSrc={brandLogoSrc} />
        <ExecutiveSummary report={report} />
        <TimelineTable rows={report.timeline} />
        <BudgetSection report={report} />
        <PurchasesSection rows={report.purchases} />
        <FabricationSection report={report} />
        <DocumentsSection rows={report.documents} />
        <WarrantySection report={report} />
        <ActivitySection activity={report.activity} />
        <Footer generatedAt={report.header.generatedAt} />
      </Page>
    </Document>
  );
}
