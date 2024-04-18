document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("currency-form");
  const loader = document.getElementById("loader");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const currencyCode = formData.get("currency");
    const amount = parseFloat(formData.get("amount"));

    if (amount < 0.01) {
      resultDiv.textContent = "Minimalna wartość to 0.01";
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
      console.error("Wystąpił błąd:", error);
      resultDiv.textContent = "Wystąpił błąd. Spróbuj ponownie później.";
    } finally {
      loader.classList.add("hidden");
    }
  });

  async function getCurrency(currencyCode) {
    const apiUrl = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/?format=json`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Nie można pobrać danych z API");
      }
      const data = await response.json();
      const rate = data?.rates?.[0]?.mid;
      if (rate) {
        return rate;
      } else {
        throw new Error("Niepoprawny format danych z API");
      }
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      throw error;
    }
  }
});
