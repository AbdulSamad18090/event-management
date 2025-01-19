export const filterEvents = (events) => {
  const currentDate = new Date();

  const upcomingEvents = events.filter(
    (event) => new Date(event.date.from) > currentDate
  );
  const pastEvents = events.filter(
    (event) => new Date(event.date.to) < currentDate
  );

  return { upcomingEvents, pastEvents };
};

export const getDate = (timestamp) => {
  const date = new Date(timestamp); // Convert timestamp to a Date object
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const fetchOrganizer = async (id) => {
  try {
    const response = await fetch(`/api/organizer/get/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch organizer: HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    // Validate the structure of the response
    if (!data || !data.organizer) {
      throw new Error(
        "Invalid response structure: 'organizer' field is missing"
      );
    }

    return data.organizer;
  } catch (error) {
    console.error("Error fetching organizer:", error);
    throw error; // Rethrow to handle in the component
  }
};

export function getInitials(name) {
  return name
    ?.split(" ") // Split the name into words
    .map((word) => word[0]) // Get the first letter of each word
    .join("") // Join the initials together
    .toUpperCase(); // Ensure the initials are uppercase
}

export const fetchNoOfAttendeesForOrganizer = async (id) => {
  try {
    const res = await fetch(`/api/organizer/get/attendees-count/${id}`);

    if (!res.ok) {
      // Handle response errors
      const errorData = await res.json();
      console.error(
        "Error =>",
        errorData.message || "Failed to fetch attendees count"
      );
      return null; // Return null to indicate failure
    }

    const data = await res.json();
    return data.attendeesCount; // Return the attendees count
  } catch (error) {
    // Handle network or unexpected errors
    console.error("Network/Error =>", error.message || "Something went wrong");
    return null; // Return null to indicate failure
  }
};



export function formatNumber(value) {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B"; // Billion
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"; // Million
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K"; // Thousand
  } else {
    return value.toString(); // Less than 1,000, return as is
  }
}
