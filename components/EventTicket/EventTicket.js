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

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          backgroundColor: "#ea580c",
          padding: "24px",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: "0" }}>
          Event Ticket
        </h1>
        <p style={{ fontSize: "14px", marginTop: "8px", color: "#fed7aa" }}>
          Your gateway to an amazing experience
        </p>
      </div>

      {/* Event Details Section */}
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1a1a" }}>
            Event Details
          </h2>
          <p style={{ fontSize: "14px", color: "#4a5568", marginTop: "8px" }}>
            Date: {formatDate(transaction.createdAt)}
          </p>
        </div>

        {/* Ticket Information Section */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1a1a1a" }}>
            Ticket Information
          </h2>
          {transaction.tickets.map((ticket, index) => (
            <div
              key={index}
              style={{
                marginTop: "8px",
                padding: "12px",
                backgroundColor: "#f7fafc",
                borderRadius: "6px",
              }}
            >
              <p style={{ fontSize: "16px", color: "#1a1a1a", margin: "0" }}>
                <span
                  style={{ fontWeight: "500", textTransform: "capitalize" }}
                >
                  {ticket.type}
                </span>{" "}
                - {ticket.qty} {ticket.qty > 1 ? "tickets" : "ticket"}
              </p>
              <p style={{ fontSize: "14px", color: "#4a5568", margin: "0" }}>
                Price per ticket: Rs.{ticket.price}
              </p>
            </div>
          ))}
        </div>

        {/* Total Amount Section */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "16px", color: "#4a5568", fontWeight: "500" }}
            >
              Total Amount:
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: "bold", color: "#ea580c" }}
            >
              Rs.{transaction.totalAmount}
            </span>
          </div>
        </div>

        {/* Customer Information Section */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "#f7fafc",
            padding: "16px",
            borderRadius: "6px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            Customer Information
          </h2>
          <p style={{ fontSize: "14px", color: "#4a5568", margin: "0" }}>
            Email: {transaction.customerEmail}
          </p>
          <p style={{ fontSize: "14px", color: "#4a5568", margin: "0" }}>
            Order ID: {transaction._id}
          </p>
          <p style={{ fontSize: "14px", color: "#4a5568", margin: "0" }}>
            Status:{" "}
            <span
              style={{
                color: "#22c55e",
                fontWeight: "500",
                textTransform: "capitalize",
              }}
            >
              {transaction.status}
            </span>
          </p>
        </div>

        {/* Footer Section */}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#718096", margin: "0" }}>
            Please present this ticket at the event entrance
          </p>
          <p style={{ fontSize: "12px", color: "#718096", margin: "0" }}>
            For any queries, please contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;
