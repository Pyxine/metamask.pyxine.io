import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { heading, panel, text } from "@metamask/snaps-sdk";

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
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
