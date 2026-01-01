import type { PriceItem } from "../App";
import fallbackToken from "../assets/fallback-token.png";

const TOKEN_ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

type BaseCurrencyCardProps = {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  latestPrices: PriceItem[];
};

type ResultCurrencyCardProps = BaseCurrencyCardProps & {
  isResult: true;
  amount: number | null;
};

type InputCurrencyCardProps = BaseCurrencyCardProps & {
  isResult?: false;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
};

type CurrencyCardProps = ResultCurrencyCardProps | InputCurrencyCardProps;

const CurrencyCard = (props: CurrencyCardProps) => {
  const { currency, setCurrency, amount, latestPrices, isResult } = props;

  const getTokenIconUrl = (symbol: string) => {
    return `${TOKEN_ICON_BASE}/${symbol.toUpperCase()}.svg`;
  };

  function formatWithCommas(value: string): string {
    if (!value) return "";

    const [integer, decimal] = value.split(".");
    const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt;
  }

  return (
    <div className="w-full rounded-md border border-gray-600 bg-linear-to-b from-[#353e4b]/65 via-[#2f3843]/50 to-[#262e36]/35 p-3">
      <label className="mb-1 block text-sm text-white">
        {isResult ? "To" : "From"}
      </label>
      <div className="flex items-center">
        <img
          src={getTokenIconUrl(currency)}
          onError={(e) => {
            e.currentTarget.src = fallbackToken;
          }}
          alt={currency}
          className="h-6 w-6"
        />

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="p-2 text-white placeholder-white hover:cursor-pointer focus:outline-none"
        >
          {latestPrices.map((p, index) => (
            <option
              key={`${p.currency}-${index}`}
              value={p.currency}
              className="bg-gray-800 text-white"
            >
              {p.currency}
            </option>
          ))}
        </select>

        {isResult ? (
          <input
            value={formatWithCommas(amount?.toString() || "0")}
            placeholder="0"
            className="no-spinner w-24 flex-1 border-none bg-transparent p-2 text-right text-2xl text-white placeholder-neutral-400 focus:outline-none"
            readOnly
          />
        ) : (
          <input
            type="number"
            value={amount || ""}
            placeholder="0"
            className="no-spinner w-24 flex-1 border-none bg-transparent p-2 text-right text-2xl text-white placeholder-neutral-400 focus:outline-none"
            onChange={
              !isResult ? (e) => props.setAmount(e.target.value) : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default CurrencyCard;
