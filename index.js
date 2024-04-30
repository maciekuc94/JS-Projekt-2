document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("currency-form");
  const loader = document.getElementById("loader");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const currencyCode = formData.get("currency");
    let amount = parseFloat(formData.get("amount"));

    const amountInput = document.getElementById("amount");
    amountInput.setAttribute("min", "0.01");
    amountInput.setAttribute("step", "0.01");

    if (amount < 0.01) {
      resultDiv.textContent = "Minimum value is 0.01";
      return;
    }

    loader.classList.remove("hidden");

    try {
      const rate = await getCurrency(currencyCode);
      const countedAmount = (amount * rate).toFixed(2);
      resultDiv.textContent = `${amount.toFixed(
        2
      )} ${currencyCode} = ${countedAmount} PLN`;
    } catch (error) {
      console.error("An error occurred:", error);
      resultDiv.textContent = "An error occurred. Please try again later.";
    } finally {
      loader.classList.add("hidden");
    }
  });

  async function getCurrency(currencyCode) {
    const apiUrl = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/?format=json`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      const data = await response.json();
      const rate = data?.rates?.[0]?.mid;
      if (rate) {
        return rate;
      } else {
        throw new Error("Incorrect data format from the API");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  }
});
