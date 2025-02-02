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
import { Button } from "@/components/ui/button";
import { fetchTransactions } from "./utils";
import { fetchEvent } from "../events/utils";

const TransactionsPage = () => {
  const { data: session, status } = useSession();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [eventNames, setEventNames] = useState({});

  console.log(transactions);

  useEffect(() => {
    if (status === "loading") {
      setIsPageLoading(true);
    } else {
      setIsPageLoading(false);
      if (!session || session?.user.role === "organizer") {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const getTransactions = async () => {
    try {
      setIsTransactionsLoading(true);
      const fetchedTransactions = await fetchTransactions(session?.user?.email);
      setTransactions(fetchedTransactions);
      setFilteredTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  const getEventName = async (eventId) => {
    try {
      const event = await fetchEvent(eventId);
      return event.name || "Unknown event";
    } catch (error) {
      console.error(`Error fetching event name for ID ${eventId}:`, error);
      return "Error loading event";
    }
  };

  useEffect(() => {
    if (session) {
      getTransactions();
    }
  }, [session]);

  useEffect(() => {
    const fetchEventNames = async () => {
      const names = {};
      for (const transaction of transactions) {
        if (!names[transaction.eventId]) {
          const eventName = await getEventName(transaction.eventId);
          names[transaction.eventId] = eventName;
        }
      }
      setEventNames(names);
    };

    if (transactions.length > 0) {
      fetchEventNames();
    }
  }, [transactions]);

  // Search functionality
  useEffect(() => {
    const filterTransactions = () => {
      if (!searchQuery.trim()) {
        setFilteredTransactions(transactions);
        return;
      }

      const query = searchQuery.toLowerCase();
      const filtered = transactions.filter((transaction) => {
        const eventName = eventNames[transaction.eventId]?.toLowerCase() || "";
        const transactionId = transaction._id.toLowerCase();
        const status = transaction.status.toLowerCase();
        const amount = transaction.totalAmount.toString();
        const date = format(
          new Date(transaction.createdAt),
          "MMM dd, yyyy"
        ).toLowerCase();
        const tickets = transaction.tickets
          .map((ticket) => `${ticket.qty}x ${ticket.type}`)
          .join(" ")
          .toLowerCase();

        return (
          eventName.includes(query) ||
          transactionId.includes(query) ||
          status.includes(query) ||
          amount.includes(query) ||
          date.includes(query) ||
          tickets.includes(query)
        );
      });

      setFilteredTransactions(filtered);
    };

    filterTransactions();
  }, [searchQuery, transactions, eventNames]);

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

  if (isPageLoading) {
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isTransactionsLoading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                transactions.length
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isTransactionsLoading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                transactions.reduce(
                  (acc, curr) =>
                    acc +
                    curr.tickets.reduce((sum, ticket) => sum + ticket.qty, 0),
                  0
                )
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
              {isTransactionsLoading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                `Rs.${
                  transactions.length > 0
                    ? Math.round(
                        transactions.reduce(
                          (acc, curr) => acc + curr.totalAmount,
                          0
                        ) / transactions.length
                      )
                    : 0
                }`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Transactions</CardTitle>
              <CardDescription>
                A list of all your transactions and their details.
              </CardDescription>
            </div>
            <div className="flex items-center md:w-fit w-full">
              <Input
                className="md:w-64 w-full"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-36">Transaction ID</TableHead>
                  <TableHead className="min-w-60">Event Name</TableHead>
                  <TableHead className="min-w-80">Tickets</TableHead>
                  <TableHead className="min-w-36">Amount</TableHead>
                  <TableHead className="min-w-36">Status</TableHead>
                  <TableHead className="min-w-44">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTransactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Loading transactions...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>
                            {eventNames[transaction.eventId] || (
                              <div className="flex items-center gap-2">
                                <LoaderCircle
                                  size={12}
                                  className="animate-spin"
                                />
                                <span>Loading...</span>
                              </div>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(
                            transaction.tickets.reduce((acc, ticket) => {
                              // Group tickets by type and sum the quantity
                              acc[ticket.type] =
                                (acc[ticket.type] || 0) + ticket.qty;
                              return acc;
                            }, {})
                          ).map(([type, qty], idx) => (
                            <Badge key={idx} variant="secondary">
                              {qty}x {type.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        Rs.{transaction.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            transaction.status
                          )} hover:${getStatusColor(transaction.status)}`}
                        >
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
                          {searchQuery
                            ? "No transactions found matching your search."
                            : "No transactions found."}
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
