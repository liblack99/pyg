export function getZohoProjectFolderPath(date = new Date()) {
  const yearFolderName = String(date.getFullYear());
  const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
  const monthName = date.toLocaleDateString("es-CO", {
    month: "long",
  });

  return {
    yearFolderName,
    monthFolderName: `${monthNumber}-${monthName}`,
  };
}
