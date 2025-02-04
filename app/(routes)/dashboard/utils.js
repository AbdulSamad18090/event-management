export const getRevenue = async (id) => {
  try {
    const response = await fetch(`/api/get-revenue/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch revenue");
    }

    return data.totalRevenue;
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return null; // Handle errors gracefully
  }
};
