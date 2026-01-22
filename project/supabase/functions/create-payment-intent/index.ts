// import Stripe from "npm:stripe";
// import { serve } from "https://deno.land/std/http/server.ts";

// const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
//   apiVersion: "2023-10-16",
// });

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
//   "Access-Control-Allow-Methods": "POST, OPTIONS",
// };

// serve(async (req) => {
//   // ✅ Preflight
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { amount } = await req.json();

//     if (!amount || amount <= 0) {
//       return new Response(
//         JSON.stringify({ error: "Invalid amount" }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // ₹ → paise
//       currency: "inr",
//       automatic_payment_methods: { enabled: true },
//     });

//     return new Response(
//       JSON.stringify({ clientSecret: paymentIntent.client_secret }),
//       { headers: corsHeaders }
//     );
//   } catch (err) {
//     return new Response(
//       JSON.stringify({ error: err.message }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// });



import Stripe from "https://esm.sh/stripe@14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

// ✅ CORS headers (MANDATORY)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();

    // ✅ Wallet recharge rule (Stripe minimum ₹50)
    if (!amount || amount < 50) {
      return new Response(
        JSON.stringify({
          error: "Minimum recharge amount is ₹50",
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // ✅ Create Stripe PaymentIntent (INR)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to paise
      currency: "inr",
      payment_method_types: ["card"],
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: String(error),
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
