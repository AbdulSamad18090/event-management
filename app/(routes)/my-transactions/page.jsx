"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Receipt,
  CreditCard,
  Mail,
  Calendar,
  Tag,
  Package,
  CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AccessDenied from "@/components/AccessDenied/AccessDenied";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const TransactionsPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
      if (!session || session?.user.role === "organizer") {
        router.push("/");
      } else {
        fetchTransactions();
      }
    }
  }, [session, status, router]);

  const fetchTransactions = async () => {
    // Mock data - Replace with actual API call
    setTransactions([
      {
        _id: "679df76c2dec32fcd4894d34",
        stripeSessionId:
          "cs_test_a1J5uLewnHBQ1GcZ9X2QlWPZVWmyaL8sC0wWvQB3dkAL8ItJW7ozMgSOfG",
        customerEmail: "ahmadbaig7072@gmail.com",
        eventId: "67879e992d33385d4c691a68",
        tickets: [
          {
            type: "vip",
            price: 1800,
            qty: 1,
            _id: "679df76c2dec32fcd4894d35",
          },
        ],
        totalAmount: 1800,
        status: "paid",
        createdAt: "2025-02-01T10:29:00.361+00:00",
        updatedAt: "2025-02-01T10:29:00.361+00:00",
      },
      {
        _id: "679df76c2dec32fcd4894d34",
        stripeSessionId:
          "cs_test_a1J5uLewnHBQ1GcZ9X2QlWPZVWmyaL8sC0wWvQB3dkAL8ItJW7ozMgSOfG",
        customerEmail: "ahmadbaig7072@gmail.com",
        eventId: "67879e992d33385d4c691a68",
        tickets: [
          {
            type: "standard",
            price: 1800,
            qty: 1,
            _id: "679df76c2dec32fcd4894d35",
          },
          {
            type: "vip",
            price: 1000,
            qty: 2,
            _id: "679df76c2dec32fcd4894d35",
          },
        ],
        totalAmount: 2800,
        status: "pending",
        createdAt: "2025-02-01T10:29:00.361+00:00",
        updatedAt: "2025-02-01T10:29:00.361+00:00",
      },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-muted flex justify-center items-center">
        <LoaderCircle size={30} className="animate-spin" />
      </div>
    );
  }

  if (!session || session?.user.role === "organizer") {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.{transactions.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.reduce(
                (acc, curr) =>
                  acc +
                  curr.tickets.reduce((sum, ticket) => sum + ticket.qty, 0),
                0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Transaction
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.
              {transactions.length > 0
                ? Math.round(
                    transactions.reduce(
                      (acc, curr) => acc + curr.totalAmount,
                      0
                    ) / transactions.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full ">
            <div>
              <CardTitle className="text-2xl">Transactions</CardTitle>
              <CardDescription>
                A list of all your transactions and their details.
              </CardDescription>
            </div>
            <div className="flex items-center">
              <Input className="w-64" placeholder="Search transactions..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-30">Transaction ID</TableHead>
                  {/* <TableHead className="min-w-60">Customer</TableHead> */}
                  <TableHead className="min-w-80">Tickets</TableHead>
                  <TableHead className="min-w-36">Amount</TableHead>
                  <TableHead className="min-w-36">Status</TableHead>
                  <TableHead className="min-w-60">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {transaction._id.slice(-8)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {transaction.stripeSessionId.slice(-8)}
                          </span>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{transaction.customerEmail}</span>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {transaction.tickets.map((ticket, idx) => (
                            <Badge key={idx} variant="secondary">
                              {ticket.qty}x {ticket.type.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        Rs.{transaction.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(
                              new Date(transaction.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No transactions found.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
