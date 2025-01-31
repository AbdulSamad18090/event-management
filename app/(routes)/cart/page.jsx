"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { removeFromCart } from "@/lib/features/cartSlice";
import Link from "next/link";

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Calculate total price for all events (price * quantity)
  const total = items.reduce(
    (sum, item) =>
      sum + item.tickets.reduce((subtotal, t) => subtotal + t.price * t.qty, 0),
    0
  );

  return (
    <div className="container mx-auto min-h-96 p-4">
      <h1 className="text-5xl font-bold mb-6 text-center">Your Cart</h1>
      {items.length === 0 ? (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col items-center p-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-center text-muted-foreground mb-6">
              Looks like you haven't added any tickets to your cart yet. Explore
              our events and find something you'll love!
            </p>
            <Link href={"/events/browse"}><Button
              className="group"
            >
              Browse Events
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => {
              // Correct subtotal calculation (price * quantity)
              const eventTotal = item.tickets.reduce(
                (subtotal, t) => subtotal + t.price * t.qty,
                0
              );

              return (
                <Card key={item.eventId} className="w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {item.title}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(removeFromCart(item.eventId))}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.tickets.map((ticket, i) => (
                      <div key={`${item.eventId}-${ticket.type}`}>
                        <div className="grid grid-cols-3 gap-2">
                          <Badge variant="secondary" className="text-sm w-fit">
                            {ticket.type.toUpperCase()}
                          </Badge>
                          <span className="text-center">
                            Rs.{ticket.price.toFixed(2)}
                          </span>
                          <span className="text-right">x{ticket.qty}</span>
                        </div>
                        {i !== item.tickets.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <span className="font-semibold">
                      Subtotal: Rs.{eventTotal.toFixed(2)}
                    </span>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Summary Section */}
          <Card className="lg:col-span-1 w-full">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="font-semibold">Total:</span>
              <span>Rs.{total.toFixed(2)}</span>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartPage;
