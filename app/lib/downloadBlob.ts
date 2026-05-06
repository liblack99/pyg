export function downloadBlob(args: {blob: Blob; filename: string}) {
  const url = URL.createObjectURL(args.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = args.filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Evita errores intermitentes en algunos navegadores que aún están
  // consumiendo el blob justo después del click.
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
