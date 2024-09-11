const BASE_URL =
  "const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`";


const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) { 
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    // Set default values for 'from' and 'to' selects
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // Update flag when currency is changed
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update exchange rate and display result
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Ensure amount is valid
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
  console.log("Fetching data from URL:", URL); // Debug log

  try {
    let response = await fetch(URL);
    console.log("Response Status:", response.status); // Debug log
    if (!response.ok) throw new Error("Failed to fetch exchange rate data.");
    let data = await response.json();
    console.log("Exchange Rate Data:", data); // Debug log
    let rate = data[toCurr.value.toLowerCase()];

    let finalAmount = (amtVal * rate).toFixed(2); // Round to 2 decimal places
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Please try again later.";
  }
};

// Function to update the flag image based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for button click to get exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent form submission
  updateExchangeRate();
});

// Update exchange rate on initial page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
