export const fetchTransactions = async (customerEmail) => {
    try {
      if (!customerEmail) {
        console.error("Customer email is required");
        return null;
      }
  
      const response = await fetch(`/api/transaction/get?email=${customerEmail}`);
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return null;
    }
  };
  