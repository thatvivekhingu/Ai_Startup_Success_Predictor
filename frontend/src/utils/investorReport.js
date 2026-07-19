const safeName = (value) =>
  (value || "startup")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function downloadInvestorReport(result) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  const analysis = result.analysis;
  const startup = result.inputs || result;
  const margin = 18;
  const width = 174;
  let y = 0;

  const pageHeader = () => {
    pdf.setFillColor(14, 18, 16);
    pdf.rect(0, 0, 210, 36, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.text("Foundr.AI", margin, 16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(82, 209, 130);
    pdf.text("INVESTOR READINESS REPORT", margin, 25);
    pdf.setTextColor(110, 122, 114);
    pdf.text(new Date().toLocaleString(), 192, 25, { align: "right" });
    y = 48;
  };

  const nextPage = () => {
    pdf.addPage();
    pageHeader();
  };

  const ensureSpace = (needed = 24) => {
    if (y + needed > 278) nextPage();
  };

  const heading = (title) => {
    ensureSpace(18);
    pdf.setTextColor(25, 33, 28);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(title, margin, y);
    y += 9;
  };

  const paragraph = (copy) => {
    pdf.setTextColor(92, 104, 96);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9.5);
    const lines = pdf.splitTextToSize(copy, width);
    ensureSpace(lines.length * 5 + 4);
    pdf.text(lines, margin, y);
    y += lines.length * 5 + 4;
  };

  const row = (label, value, tone = "normal") => {
    ensureSpace(8);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(105, 116, 108);
    pdf.text(label, margin, y);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(
      tone === "risk" ? 207 : tone === "strong" ? 34 : 28,
      tone === "risk" ? 76 : tone === "strong" ? 126 : 38,
      tone === "risk" ? 68 : tone === "strong" ? 70 : 31,
    );
    pdf.text(String(value), 112, y);
    y += 7;
  };

  pageHeader();
  pdf.setTextColor(25, 33, 28);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text(startup.startup_name || result.startup_name, margin, y);
  y += 9;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(92, 104, 96);
  pdf.setFontSize(10);
  pdf.text(
    `${startup.industry} / ${startup.country} / ${startup.product_stage}`,
    margin,
    y,
  );
  y += 14;

  pdf.setFillColor(237, 247, 240);
  pdf.rect(margin, y, 54, 33, "F");
  pdf.setTextColor(32, 126, 70);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(String(analysis.success_index), margin + 7, y + 15);
  pdf.setFontSize(7);
  pdf.text("SUCCESS INDEX", margin + 7, y + 24);
  pdf.setFillColor(246, 247, 246);
  pdf.rect(margin + 60, y, 114, 33, "F");
  pdf.setTextColor(25, 33, 28);
  pdf.setFontSize(12);
  pdf.text(analysis.badge.name, margin + 68, y + 13);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(92, 104, 96);
  pdf.text(
    `Model probability ${analysis.confidence_interval.estimate}% (${analysis.confidence_interval.lower}-${analysis.confidence_interval.upper}% estimated range)`,
    margin + 68,
    y + 23,
  );
  y += 45;

  heading("Executive summary");
  paragraph(
    `${analysis.benchmark.summary} The assessment combines the deployed model probability with funding readiness, market fit, team strength, and burn resilience. It is intended to support diligence, not replace it.`,
  );

  heading("Readiness scorecard");
  analysis.dimensions.forEach((item) =>
    row(
      item.name,
      `${item.score}/100 - ${item.status}`,
      item.score >= 70 ? "strong" : item.score < 45 ? "risk" : "normal",
    ),
  );
  y += 3;

  heading("Operating metrics");
  row("Funded runway", `${analysis.derived_metrics.runway_months} months`);
  row("Burn multiple", `${analysis.derived_metrics.burn_multiple}x`);
  row(
    "Revenue per employee",
    `$${analysis.derived_metrics.revenue_per_employee.toLocaleString()}`,
  );
  row(
    "Peer position",
    `Top ${analysis.benchmark.top_percent}% / ${analysis.benchmark.scope}`,
  );
  y += 3;

  heading("Risk review");
  analysis.risk_heatmap.forEach((item) =>
    row(
      item.name,
      `${item.status} risk (${item.risk}/100)`,
      item.status === "High"
        ? "risk"
        : item.status === "Low"
          ? "strong"
          : "normal",
    ),
  );
  y += 3;

  heading("Primary score drivers");
  analysis.explanations.slice(0, 6).forEach((item) => {
    const sign = item.impact >= 0 ? "+" : "";
    row(
      item.feature,
      `${sign}${item.impact} impact`,
      item.impact >= 0 ? "strong" : "risk",
    );
    paragraph(item.detail);
  });

  heading("Recommended actions");
  analysis.recommendations.forEach((item, index) =>
    paragraph(`${index + 1}. ${item}`),
  );

  heading("Submitted operating profile");
  [
    ["Funding", `$${Number(startup.funding).toLocaleString()}`],
    ["Annual revenue", `$${Number(startup.revenue).toLocaleString()}`],
    ["Monthly burn", `$${Number(startup.burn_rate).toLocaleString()}`],
    ["Team size", startup.team_size],
    ["Founder experience", `${startup.experience} years`],
    ["Annual growth", `${startup.growth_rate}%`],
    ["Competition index", `${startup.competition}/100`],
  ].forEach(([label, value]) => row(label, value));

  ensureSpace(25);
  y += 8;
  pdf.setDrawColor(218, 224, 220);
  pdf.line(margin, y, 192, y);
  y += 7;
  paragraph(
    "Decision-support report only. Scores are estimates based on submitted data and the currently deployed model. Validate assumptions with audited financials, customer evidence, market research, and professional advice before making investment decisions.",
  );

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setFontSize(7.5);
    pdf.setTextColor(130, 140, 133);
    pdf.text(
      `Foundr.AI / Confidential / Page ${page} of ${pageCount}`,
      192,
      290,
      { align: "right" },
    );
  }

  pdf.save(`${safeName(startup.startup_name)}-foundr-ai-investor-report.pdf`);
}
