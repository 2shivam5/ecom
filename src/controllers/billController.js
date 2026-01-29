import asyncHandler from "../utils/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { buildInvoicePdf } from "../utils/genrateBill.js";

export const createInvoice=asyncHandler(async(req,res)=>{
const order=await Order.findById(req.params.id).populate("user","name email");

if(!order){
    return res.status(404)
    .json({message:"Order not found"});
}
const status=order.orderStatus || order.status;

if (status !== "delivered") {
    return res.status(400)
    .json({ message: "Bill can be generated only for delivered orders" });
}
const isAdmin=["admin","superAdmin"].includes(req.user.role);
//const isOwner=(order.user._id)===(req.user._id);
const isOwner = order.user?._id?.equals(req.user?._id);


if(!isAdmin && !isOwner){
    return res.status(403)
    .json({message:"You are not authorized to generate bill for this order"});
}
res.setHeader("Content-Type","application/pdf");
res.setHeader(
    "Content-Disposition",
    `attachment; filename="invoice_${order._id}.pdf"`
);

const pdfDoc=buildInvoicePdf(order);
pdfDoc.pipe(res);
pdfDoc.end();
});