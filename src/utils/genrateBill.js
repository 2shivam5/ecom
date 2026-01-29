import PDFDocument from "pdfkit";

export const buildInvoicePdf = (order) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  const money = (n) => `₹${Number(n || 0).toFixed(2)}`;

  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.text(`Status: ${order.orderStatus || order.status}`);
  doc.moveDown();

  const u = order.user;
  doc.text(`Customer: ${u?.name || ""}`);
  doc.text(`Email: ${u?.email || ""}`);
  doc.moveDown();

  doc.fontSize(13).text("Items:", { underline: true });
  doc.moveDown(0.5);

  const items = order.orderItems || order.items || [];
  let subTotal = 0;

  items.forEach((it, i) => {
    const name = it.name || it.product?.name || `Item ${i + 1}`;
    const qty = Number(it.quantity || it.qty || 1);
    const price = Number(it.price || it.product?.price || 0);
    const total = qty * price;

    subTotal += total;

    doc.fontSize(11).text(`${i + 1}. ${name}`);
    doc.text(`   Qty: ${qty} | Price: ${money(price)} | Total: ${money(total)}`);
    doc.moveDown(0.3);
  });

  doc.moveDown();

  const shipping = Number(order.shippingPrice || 0);
  const tax = Number(order.taxPrice || 0);
  const grandTotal = Number(order.totalPrice) || subTotal + shipping + tax;

  doc.fontSize(12).text(`Subtotal: ${money(subTotal)}`, { align: "right" });
  doc.text(`Shipping: ${money(shipping)}`, { align: "right" });
  doc.text(`Tax: ${money(tax)}`, { align: "right" });
  doc.fontSize(14).text(`Grand Total: ${money(grandTotal)}`, { align: "right" });

  doc.moveDown(2);
  doc.fontSize(10).text("This is a computer generated invoice.", { align: "center" });

  return doc;
};

export const buildInvoicePdfBuffer = async (order, generatedBy) => {
  return new Promise((resolve, reject) => {
    const doc = buildInvoicePdf(order);

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.end();
  });
};