// src/passenger/Wallet.tsx
import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function Wallet() {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setBalance(data?.balance ?? 0));
  }, [user]);

  async function recharge() {
    if (!stripe || !elements || !user) return;

    setLoading(true);

    const res = await fetch(
      "https://nmifzpsamcktsckabfkm.supabase.co/functions/v1/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      await supabase.rpc("add_wallet_balance", {
        uid: user.id,
        amt: amount,
      });

      setBalance(balance + amount);
      alert("Wallet recharged successfully");
    }

    setLoading(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">Wallet</h2>

      <p className="text-lg">Balance: ₹{balance}</p>

      <select
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-3 rounded-lg w-full"
      >
        <option value={50}>₹50</option>
        <option value={100}>₹100</option>
        <option value={200}>₹200</option>
      </select>

      <CardElement />

      <button
        onClick={recharge}
        disabled={loading}
        className="bg-green-600 text-white py-3 rounded-lg w-full"
      >
        {loading ? "Recharging..." : "Recharge Wallet"}
      </button>
    </div>
  );
}
