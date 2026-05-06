import type {ProjectModule} from "@/app/core/projects/activity/dto";
import type {ProjectDocumentType} from "@/app/core/projects/documents/dto";

export function getProjectModuleByDocumentType(
  type: ProjectDocumentType,
): ProjectModule {
  if (
    [
      "INSTALLATION_PHOTO",
      "INSTALLATION_RECORD",
      "INSTALLATION_SUPPORT",
    ].includes(type)
  ) {
    return "INSTALLATION";
  }

  if (["WARRANTY_EVIDENCE", "WARRANTY_SUPPORT"].includes(type)) {
    return "WARRANTY";
  }

  if (["FINANCE_SUPPORT"].includes(type)) {
    return "FINANCE";
  }

  return "DOCUMENTS";
}
