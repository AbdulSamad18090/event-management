const EventTicket = ({ transaction }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-3xl font-bold text-center">Event Ticket</h1>
        <p className="text-center mt-2 text-blue-100">
          Your gateway to an amazing experience
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
          <p className="text-gray-600 mt-2">Event ID: {transaction.eventId}</p>
          <p className="text-gray-600">
            Date: {formatDate(transaction.createdAt)}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Ticket Information
          </h2>
          {transaction.tickets.map((ticket, index) => (
            <div key={index} className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-gray-800">
                <span className="font-medium capitalize">{ticket.type}</span> -{" "}
                {ticket.qty} {ticket.qty > 1 ? "tickets" : "ticket"}
              </p>
              <p className="text-gray-600 text-sm">
                Price per ticket: {formatCurrency(ticket.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(transaction.totalAmount)}
            </span>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Customer Information
          </h2>
          <p className="text-gray-600">Email: {transaction.customerEmail}</p>
          <p className="text-gray-600">Order ID: {transaction._id}</p>
          <p className="text-gray-600">
            Status:{" "}
            <span className="text-green-600 font-medium capitalize">
              {transaction.status}
            </span>
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Please present this ticket at the event entrance
          </p>
          <p className="text-sm text-gray-500">
            For any queries, please contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;
