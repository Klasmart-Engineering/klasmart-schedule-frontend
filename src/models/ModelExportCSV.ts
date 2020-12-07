export function exportCSV(name: string, title: string, data: string[]) {
  let str = `${title}\n`;
  data.forEach((item) => {
    str += `${item}\t\n`;
  });
  let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  let link = document.createElement("a");
  link.href = uri;
  link.download = `${name}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
