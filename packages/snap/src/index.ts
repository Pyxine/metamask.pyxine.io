import {
  Transaction,
  UserInputEventType,
  type OnTransactionHandler,
  type OnUserInputHandler,
} from '@metamask/snaps-sdk';
import { renderScore, renderRetry, PyxineActions } from './renders';
import { getScore } from './api';

let globalTransaction: Transaction | null = null;

const renderPanel = async (transaction: Transaction) => {
  try {
    const score = await getScore(transaction);

    return renderScore(transaction, score);
  } catch (error) {
    console.log(
      `Error analysing Transaction. ${JSON.stringify(error, null, 4)}`,
    );
    return renderRetry();
  }
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  globalTransaction = transaction;

  const panel = await renderPanel(transaction);

  return {
    content: panel,
  };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    if (event.name === PyxineActions.RetryAnalysis && globalTransaction) {
      const panel = await renderPanel(globalTransaction);

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: panel,
        },
      });
    }
  }
};
