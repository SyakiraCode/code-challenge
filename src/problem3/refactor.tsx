interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

/* 
   - Defining a union type ensures TypeScript will catch typos (e.g., "Zilliiqa" would throw an error).
*/
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

/* 
   - Lookup tables are faster than switch statements.
   - Easy to add new blockchains or change priority.
   - Eliminates multiple getPriority calls inside sorting (performance improvement).
*/
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<BoxProps> = (props) => {
  const { children, ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  /* 
    - Single pass: filter → sort → map in one go.
    - Avoids multiple loops over the same array.
    - Memoized with useMemo → only recalculates if balances change.
    - Guarantees all balances have .formatted when used in rendering.
  */
  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(
        (balance) =>
          BLOCKCHAIN_PRIORITY[balance.blockchain] !== undefined &&
          balance.amount > 0
      )
      .sort(
        (a, b) =>
          BLOCKCHAIN_PRIORITY[b.blockchain] -
          BLOCKCHAIN_PRIORITY[a.blockchain]
      )
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      }));
  }, [balances]);

  /* 
    - Rows are expensive to render if the list is long.
    - useMemo ensures rows are re-render only when formattedBalances or prices change.
    - Improves rendering performance and avoids unnecessary DOM updates.
    - Unique keys based on blockchain + currency ensure React can efficiently update only changed rows, preventing unnecessary re-renders.
  */
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;

      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
