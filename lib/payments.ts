import Razorpay from "razorpay";
import Stripe from "stripe";
import { env } from "@/lib/env";

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});

export const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-09-30.acacia" }) : null;
