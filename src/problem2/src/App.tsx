import { useEffect, useState } from "react";
import CurrencyCard from "./components/CurrencyCard";

export interface PriceItem {
  currency: string;
  date: string;
  price: number;
}

function App() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSwapped, setIsSwapped] = useState(false);

  // currency form state
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<number | null>(0);

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data);
        setLoading(false);

        // set defaults if available
        if (data.length > 0) {
          setFromCurrency(data[0].currency);
          setToCurrency(data[1]?.currency ?? data[0].currency);
        }
      })
      .catch((err) => {
        console.error("Failed to load prices: ", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!amount || !fromCurrency || !toCurrency) {
      setResult(null);
      return;
    }

    if (!fromData || !toData) {
      setResult(null);
      return;
    }

    const converted = (parseFloat(amount) * fromData.price) / toData.price;

    setResult(converted);
  }, [amount, fromCurrency, toCurrency]);

  const latestPrices = Object.values(
    prices.reduce((acc: Record<string, PriceItem>, item) => {
      // If we don't have this currency yet, or this item is newer, keep it
      if (
        !acc[item.currency] ||
        new Date(item.date) > new Date(acc[item.currency].date)
      ) {
        acc[item.currency] = item;
      }
      return acc;
    }, {}),
  );

  const fromData = latestPrices.find((p) => p.currency === fromCurrency);
  const toData = latestPrices.find((p) => p.currency === toCurrency);

  const exchangeRate =
    fromData && toData ? fromData.price / toData.price : null;

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setIsSwapped((prev) => !prev);
  };

  if (loading) return <div>Loading prices...</div>;

  return (
    <main className="font-roboto flex min-h-screen flex-1 flex-col items-center justify-center bg-linear-to-br from-[#12151b] to-[#13151c] text-white">
      <div className="relative h-1 w-1">
        <div className="absolute top-0 left-0 z-0 h-56 w-56 translate-[-50%] rounded-full bg-[hsl(220,20%,15%)] blur-3xl md:left-45 md:h-72 md:w-72 md:bg-[hsl(220,20%,13%)]" />
      </div>
      <div className="flex w-full max-w-lg items-center justify-center">
        <div className="z-10 mx-5 flex w-full flex-col items-center gap-y-4 rounded-xl border border-gray-300/20 bg-slate-200/2 p-6 shadow-md backdrop-blur-lg">
          <h2 className="text-2xl font-semibold">Currency Swap</h2>
          <hr className="my-2 w-full border-t border-gray-600/20" />

          <CurrencyCard
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            amount={amount}
            setAmount={setAmount}
            latestPrices={latestPrices}
          />

          <button
            onClick={handleSwapCurrencies}
            className={`-mt-6 -mb-6 h-10 w-10 rounded-full bg-gray-700 p-2 shadow-md transition duration-400 hover:cursor-pointer hover:bg-gray-600 ${isSwapped ? "rotate-180" : "rotate-0"}`}
          >
            ⇅
          </button>

          <CurrencyCard
            currency={toCurrency}
            setCurrency={setToCurrency}
            amount={result}
            latestPrices={latestPrices}
            isResult={true}
          />

          <hr className="my-2 w-full border-t border-gray-600/20" />
          {exchangeRate && (
            <div className="w-full rounded-md border border-[#81fe8f] bg-[#81fe8f] px-2 py-1 text-center">
              <p className="py-1 text-xs font-medium text-black/80">
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="relative h-1 w-1">
        <div className="absolute -top-12 left-0 h-48 w-48 translate-[-50%] rounded-full bg-[#81fe8f] opacity-10 blur-3xl md:h-60 md:w-96" />
        <div
          className="absolute -top-24 -left-44 hidden h-56 w-56 translate-[-50%] rounded-full bg-[hsl(220,20%,15%)] blur-3xl md:inline md:h-72 md:w-72 md:bg-[hsl(220,20%,13%)]"
          style={{
            top: "-100px",
            left: "-180px",
          }}
        />
      </div>
    </main>
  );
}

export default App;
