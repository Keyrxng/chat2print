export function formatTextToHTML(text: string) {
  const lines = text?.split("\n");

  let htmlLines = [];
  let inList = false;

  lines?.forEach((line: string) => {
    if (line.startsWith("•")) {
      if (!inList) {
        htmlLines.push("<ul>");
        inList = true;
      }
      htmlLines.push(`<li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        htmlLines.push("</ul>");
        inList = false;
      }
      if (line.trim() !== "") {
        htmlLines.push(`${line}`);
      }
    }
  });

  if (inList) {
    htmlLines.push("</ul>");
  }

  return htmlLines;
}
