"use client";
import { clearCart } from "@/lib/features/cartSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Success() {
  const dispatch = useDispatch(); // Get the dispatch function from the Redux store
  useEffect(() => {
    dispatch(clearCart());
  }, []);
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
      <p>Thank you for your purchase. You will receive your tickets shortly.</p>
    </div>
  );
}
