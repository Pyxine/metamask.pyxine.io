import type { OnTransactionHandler } from '@metamask/snaps-sdk';
import { heading, panel, text, divider, image } from '@metamask/snaps-sdk';
import safeIcon from '../static/shield-safe.svg';
import crossIcon from '../static/shield-cross.svg';
import unknownIcon from '../static/shield-unknown.svg';
import warningIcon from '../static/shield-warning.svg';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  let score = await fetch(
    `https://api-pyxine-io.vercel.app/v1/score/${transaction.to}`,
      {
      headers: {
      "x-cached": "true",
    }},
  );
  score = await score.json();
  console.log(score);
  return {
    content: panel(renderScore(score, transaction.to)),
  };
};

function renderScore(score: any, address: any): any {
  const transactions = score.transactions * 10000;
  return [
    ...renderHeader(score, address),
    divider(),
    heading('Address'),
    text(address),
    // heading('Creation Date'),
    // text('01/01/1970'),
    heading('Interactions'),
    text(`${transactions == -10000 ? 'Not enough interactions' : (transactions >= 10000 ? 'More than 10,000' : transactions)}`),
    ...renderDetails(score),
  ];
}

function renderDetails(score: any) {
  if (score.final == -1) {
    return [
      divider(),
      text("As we couldn’t offer the level of protection we aim, we recommend you follow the security tips below to safeguard your transaction."),
      heading("Security Tips"),
      text("✔️  Ensure you know and trust the address you are interacting with"),
      text("✔️  Double-check that the address shown in your wallet matches the actual contract address. Using Etherscan to verify it can be helpful"),
      text("✔️  Always use a secure and private internet connection to protect your data"),
      text("✔️  Keep your Pyxine extension updated to the latest version for optimal security")
    ];
  }

  return [
    divider(),
    heading('Verification Process'),
    text(
      `${renderNumericEvaluationIcon(score.contractOwner)} Contract owner legitimacy`,
    ),
    text(
      `${renderBooleanEvaluationIcon(
        score.isVerified,
      )} Source code matches the deployed contract`,
    ),
    text(
      `${renderNumericEvaluationIcon(score.transactionsDiffAccounts)} Expected volume of transactions`,
    ),
  ];
}

function renderHeader(score: any, address: string) {
  if (score.final == -1) {
    return [
      heading('Unknown risk transaction'),
      image(renderIcon(score.final)),
      text(`We don't have enough information about **${address}**`),
    ];
  }

  if (score.final < 0.3) {
    return [
      heading('High risk transaction'),
      image(renderIcon(score.final)),
      text(`The **${address}** didn't meet any of our security standards`),
    ];
  } else if (score.final >= 0.3 && score.final < 0.6) {
    return [
      heading('Middle risk transaction'),
      image(renderIcon(score.final)),
      text(`The **${address}** didn't meet some of our security standards`)
    ];
  } else {
    return [
      heading('Low risk transaction'),
      image(renderIcon(score.final)),
      text(`The **${address}** met most of our security standards`),
    ];
  }
}

function renderNumericEvaluationIcon(score: number): string {
  if (score < 0.3) {
    return '❌';
  } else if (score >= 0.3 && score < 0.6) {
    return '⚠️';
  } else {
    return '✅';
  }
}

function renderBooleanEvaluationIcon(score: boolean): string {
  if (score) {
    return '✅';
  } else {
    return '❌';
  }
}

function renderIcon(score: number): any {
  if (score == -1) {
    return unknownIcon;
  } else if (score < 0.3) {
    return crossIcon;
  } else if (score >= 0.3 && score < 0.6) {
    return warningIcon;
  } else {
    return safeIcon;
  }
}
