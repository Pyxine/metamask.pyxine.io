import {
  button,
  address,
  heading,
  panel,
  text,
  divider,
  image,
  row,
} from '@metamask/snaps-sdk';
import safeIcon from '../static/shield-safe.svg';
import crossIcon from '../static/shield-cross.svg';
import unknownIcon from '../static/shield-unknown.svg';
import warningIcon from '../static/shield-warning.svg';
import errorIcon from '../static/error.svg';
import betaIcon from '../static/beta.svg';
import type { Score } from './api';
import { remove0x } from '@metamask/utils';

export enum PyxineActions {
  RetryAnalysis = 'RetryAnalysis',
}

export function renderScore(transaction: { to: string }, score: Score): any {
  return panel([
    ...renderHeader(score, transaction.to),
    divider(),
    heading('Address'),
    address(`0x${remove0x(transaction.to)}`),
    divider(),
    heading('Details'),
    row('Symbol', text(score.symbol)),
    row('Description', text(score.description)),
    row(
      'Interactions',
      text(
        `${
          score.transactions == -1
            ? 'Not enough interactions'
            : score.transactions >= 1
            ? 'More than 10,000'
            : score.transactions * 10000
        }`,
      ),
    ),
    ...renderDetails(score),
  ]);
}

export function renderRetry(): any {
  return panel([
    image(betaIcon),
    image(errorIcon),
    heading(
      'There was an error trying to calculate the score, please try again in a few moments.',
    ),
    button({
      value: 'Retry',
      name: PyxineActions.RetryAnalysis,
    }),
  ]);
}

function renderDetails(score: any) {
  if (score.final == -1) {
    return [
      divider(),
      text(
        'As we couldn’t offer the level of protection we aim, we recommend you follow the security tips below to safeguard your transaction.',
      ),
      heading('Security Tips'),
      text('💡 Ensure you know and trust the address you are interacting with'),
      text(
        '💡 Double-check that the address shown in your wallet matches the actual contract address. Using Etherscan to verify it can be helpful',
      ),
      text(
        '💡 Always use a secure and private internet connection to protect your data',
      ),
      text(
        '💡 Keep your Pyxine extension updated to the latest version for optimal security',
      ),
    ];
  }

  return [
    divider(),
    heading('Verification Process'),
    text(
      `${renderNumericEvaluationIcon(
        score.contractOwner,
      )} Contract owner legitimacy`,
    ),
    text(
      `${renderBooleanEvaluationIcon(
        score.isVerified,
      )} Source code matches the deployed contract`,
    ),
    text(
      `${renderNumericEvaluationIcon(
        score.transactionsDiffAccounts,
      )} Expected volume of transactions`,
    ),
  ];
}

function renderHeader(score: any, address: string) {
  if (score.final == -1) {
    return [
      image(betaIcon),
      heading('Unknown risk transaction'),
      image(renderIcon(score.final)),
      text(`We don't have enough information about **${address}**`),
    ];
  }

  if (score.final < 0.3) {
    return [
      image(betaIcon),
      heading('High risk transaction'),
      image(renderIcon(score.final)),
      text(`The **${address}** didn't meet any of our security standards`),
    ];
  } else if (score.final >= 0.3 && score.final < 0.6) {
    return [
      image(betaIcon),
      heading('Middle risk transaction'),
      image(renderIcon(score.final)),
      text(`The **${address}** didn't meet some of our security standards`),
    ];
  } else {
    return [
      image(betaIcon),
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
