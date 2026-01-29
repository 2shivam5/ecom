import mongoose from "mongoose";
import User from "./userModel.js";
import Product from "./productModel.js";
import { percentDecodeString } from "whatwg-url";
import { boolean } from "webidl-conversions";

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        reqired:true,
        ref:User
    },
    orderItems:[{
        Product:{
            type:mongoose.Schema.Types.ObjectId,
            reqired:true,
            ref:Product
        },
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }],
    orderStatus:{
        type:String,
        enum:['Pending','paid','shipped','out for delivery','delivered'],
        default:'Pending'
    },


    shippingAddress:{
        address:String,
        city:String,
        pinCode:String,
        Country:String
        
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentResult:{
        id:String,
        status:String,
        email:String
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    isPaid:{
        type:Boolean,
        required:true,
        default:false
    },
    isDelivered:{
        type:Boolean,
        required:true,
        default:false
    },
    deliveredAt:
    {
        type:Date
    },
    deliveryOtp:String,
    otpExpireAt:Date,
   
    deliveryConfirmed:{
    type:Boolean,
    default:false
},
},{timestamps:true});

orderSchema.methods.generateDeliveryOtp=function()
{
    const otp=Math.floor(100000+Math.random()*900000).toString();

    this.deliveryOtp=otp;
    this.otpExpireAt=Date.now() +10*60*1000;

    return otp;

};

orderSchema.methods.verifyDeliveryOtp=function(otp){
    if (!this.deliveryOtp) return false;

    return this.deliveryOtp===otp;
};

export const Order = mongoose.model('Order', orderSchema);
export default Order;