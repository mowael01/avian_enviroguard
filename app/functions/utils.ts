export function getSoundCategory(sound: number, freuquqncy: number) {
  if (sound > 1 || freuquqncy > 500) {
    return "High Sound";
  } else if (sound > 0.5) {
    return "Moderate Sound";
  } else {
    return "No sound";
  }
}

export function getLight(light: boolean) {
  if (light) {
    return "On";
  } else {
    return "Off";
  }
}

export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0"); // Day with two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month with two digits
  const year = date.getFullYear(); // Full year

  let hours = date.getHours(); // Get hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes and pad
  const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0)
  const time = `${hours}:${minutes} ${ampm}`; // Format time as hh:mm AM/PM

  return `${day}/${month}/${year} ${time}`; // Combine date and time
}

/**
 * Converts user text input into a date range for Supabase queries.
 *
 * @param {string} userInput - The user's text input (e.g., "last week", "this month", "2024-01-15").
 * @returns {object|null} An object with `startDate` and `endDate` Date objects, or null if the input is invalid.
 */
export function getDateRangeFromUserInput(userInput: string) {
  if (!userInput) {
    return null; // Handle empty input
  }

  userInput = userInput.toLowerCase().trim(); // Normalize input

  const now = new Date();
  let startDate, endDate;

  if (userInput === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Up to the start of the next day
  } else if (userInput === "yesterday") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (userInput === "this week") {
    const diff = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1); // Adjust for Sunday being 0
    startDate = new Date(now.getFullYear(), now.getMonth(), diff);
    endDate = new Date(now.getFullYear(), now.getMonth(), diff + 7);
  } else if (userInput === "last week") {
    const diff = now.getDate() - now.getDay() - 6;
    startDate = new Date(now.getFullYear(), now.getMonth(), diff);
    endDate = new Date(now.getFullYear(), now.getMonth(), diff + 7);
  } else if (userInput === "this month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (userInput === "last month") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (userInput === "this year") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear() + 1, 0, 1);
  } else if (userInput === "last year") {
    startDate = new Date(now.getFullYear() - 1, 0, 1);
    endDate = new Date(now.getFullYear(), 0, 1);
  } else if (userInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Check for YYYY-MM-DD format
    try {
      startDate = new Date(userInput);
      endDate = new Date(userInput);
      endDate.setDate(endDate.getDate() + 1); //To include the whole day
    } catch (error) {
      return null; // Invalid date format
    }
  } else if (userInput.match(/^\d{4}-\d{2}$/)) {
    //Check for YYYY-MM format
    try {
      const [year, month] = userInput.split("-").map(Number);
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    } catch (error) {
      return null;
    }
  } else {
    return null; // Invalid input
  }

  return { startDate, endDate };
}
