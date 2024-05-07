/**
 * Asynchronously sends a POST request to the specified URL with the provided data.
 */
const postRequest = async (url, data) => {
  // Configure the fetch request with appropriate headers and method
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Ensure the server treats the sent data as JSON
    },
    body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
  });

  // Check if the fetch was successful
  if (!response.ok) {
    // Throw an error with the response status text if the fetch was not successful
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  // Return the response data as JSON
  return response.json();
};

export default postRequest;
