export const fetchEvent = async (eventId) => {
    try {
      if (!eventId) {
        console.error("Event ID is required.");
        return null;
      }
  
      // Fetch event from the API
      const response = await fetch(`/api/event/get/specific-event/${eventId}`);
  
      if (!response.ok) {
        // If the response status is not OK, throw an error
        const errorData = await response.json();
        console.error("Error fetching event:", errorData.message);
        return null;
      }
  
      // If the request is successful, parse and return the event data
      const data = await response.json();
      return data.event;
  
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  };
  