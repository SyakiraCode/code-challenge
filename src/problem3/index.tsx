/* 1. WalletBalance interface is missing blockchain properties

    Issue:
    - balance.blockchain is used multiple times, but blockchain is not defined in WalletBalance

    Error type: 
    - Typescript type error (e.g Property 'blockchain' does not exist on type 'WalletBalance')

    Severity:
    - 🔴 Critical (compile-time error)
    
*/
interface WalletBalance {
    currency: string;
    amount: number;
}

interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    /* 2. getPriority parameter typed as any

        Issue:
        - Using any removes type safety and goes against the purpose of TypeScript.

        Error type: 
        - Type safety issue / bad practice

        Severity:
        - 🟡 Medium (won’t crash, but risky)
    
    */
    const getPriority = (blockchain: any): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100
            case 'Ethereum':
                return 50
            case 'Arbitrum':
                return 30
            case 'Zilliqa':
                return 20
            case 'Neo':
                return 20
            default:
                return -99
        }
    }

    /* 
        3. Undefined variable lhsPriority

        Issue:
        - lhsPriority is never declared anywhere.

        Error type: 
        - Reference error (e.g Cannot find name 'lhsPriority')

        Severity:
        - 🔴 Critical (compile-time error)

        ---------------------------------------------------------

        4. Logical error in filter condition

        Issue:
        - This keeps balances with zero or negative amounts, which is likely the opposite of the intended behavior.

        Error type: 
        - Logical error

        Severity:
        - 🟠 High (produces wrong data, but app still runs)

        --------------------------------------------------------------

        5. Missing return value in sort comparator

        Issue:
        - Comparator does not return 0 when priorities are equal.
        - sort() expects negative, positve or 0 return result
        - Missing 0 causes unstable sorting

        Error type: 
        - Logical/runtime behavior bug

        Severity:
        - 🟠 High (order may be wrong in some cases)

        ---------------------------------------------------------------------

        6. Incorrect dependency array in useMemo

        Issue:
        - prices is not used inside sortedBalances

        Error type: 
        - React hooks dependency misuse

        Severity:
        - 🟡 Medium (unnecessary re-renders)

    */
    const sortedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
    }, [balances, prices]);

    /* 7. formattedBalances is never used

        Issue:
        - Dead / unused variable.

        Error type: 
        - Code smell

        Severity:
        - 🟢 Low (cleanup issue only)
    
    */
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
        return {
            ...balance,
            formatted: balance.amount.toFixed()
        }
    })

    /* 
        8. Wrong type used in sortedBalances.map

        Issue:
        - sortedBalances is WalletBalance[], not FormattedWalletBalance[]. 
        - formatted does not exist yet at this stage.

        Error type: 
        - Type mismatch (e.g Property 'formatted' does not exist on type 'WalletBalance')

        Severity:
        - 🔴 Critical (TypeScript error)

        ---------------------------------------------------------------------

        9. key={index} in list rendering

        Issue:
        - Using array index as key can cause rendering bugs when list order changes.

        Error type: 
        - React anti-pattern

        Severity:
        - 🟡 Medium (UI bugs in certain conditions)

    */
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}