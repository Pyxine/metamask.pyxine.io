import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { heading, panel, text } from "@metamask/snaps-sdk";

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {

    // Use the Ethereum provider to fetch the gas price.
    const currentGasPrice = await ethereum.request({
        method: "eth_gasPrice",
    }) as string;

    // Get fields from the transaction object.
    const transactionGas = parseInt(transaction.gas as string, 16);
    const currentGasPriceInWei = parseInt(currentGasPrice ?? "", 16);
    const maxFeePerGasInWei = parseInt(transaction.maxFeePerGas as string, 16);
    const maxPriorityFeePerGasInWei = parseInt(
        transaction.maxPriorityFeePerGas as string,
        16,
    );

    // Calculate gas fees the user would pay.
    const gasFees = Math.min(
        maxFeePerGasInWei * transactionGas,
        (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas,
    );

    // Calculate gas fees as percentage of transaction.
    const transactionValueInWei = parseInt(transaction.value as string, 16);
    const gasFeesPercentage = (gasFees / (gasFees + transactionValueInWei)) * 100;

    let score = await fetch(`https://api-pyxine-io-git-feat-enable-cors-flaroccas-projects.vercel.app/v1/score/${transaction.to}`);
   score = await score.json();

    // Display percentage of gas fees in the transaction insights UI.
    return {
        content: panel([
            heading("Pyxine"),
            text(
              `Score for **${transaction.to}** is: **${score.final}**`
            ),
        ]),
    };
};
