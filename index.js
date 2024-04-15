function getCurrency(currencyCode) {
  const apiUrl = `https://api.nbp.pl/api/exchangerates/rates/a/${currencyCode}/?format=json`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Nie można pobrać danych z API");
      }
      return response.json();
    })
    .then((data) => {
      return data.rates[0].mid;
    })
    .catch((error) => {
      console.error("Wystąpił błąd:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("currency-form");
  const loader = document.getElementById("loader");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const currencyCode = document.getElementById("currency-select").value;
    const amount = parseFloat(document.getElementById("amount").value);

    loader.classList.remove("hidden");

    try {
      const rate = await getCurrency(currencyCode);
      const countedAmount = (amount * rate).toFixed(0);
      resultDiv.textContent = `${amount} ${currencyCode} = ${countedAmount} PLN`;
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      resultDiv.textContent = "Wystąpił błąd. Spróbuj ponownie później.";
    } finally {
      loader.classList.add("hidden");
    }
  });
});
