import {
  ChainId,
  Transaction,
  UserInputEventType,
  type OnTransactionHandler,
  type OnUserInputHandler,
} from '@metamask/snaps-sdk';
import { renderScore, renderRetry, PyxineActions } from './renders';
import { getScore } from './api';

let globalTransaction: Transaction | undefined = undefined;
let globalChainId: ChainId | undefined = undefined;
let globalOrigin: string | undefined = undefined;

const renderPanel = async (
  transaction: Transaction,
  chainId: ChainId | undefined,
  origin: string | undefined,
) => {
  try {
    const score = await getScore(transaction, chainId?.toString(), origin);

    return renderScore(transaction, score);
  } catch (error) {
    console.log(
      `Error analysing Transaction. ${JSON.stringify(error, null, 4)}`,
    );
    return renderRetry();
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {
  globalTransaction = transaction;
  globalChainId = chainId;
  globalOrigin = origin;

  const content = await renderPanel(transaction, chainId, transactionOrigin);

  return {
    content,
  };
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    if (event.name === PyxineActions.RetryAnalysis && globalTransaction) {
      const ui = await renderPanel(
        globalTransaction,
        globalChainId,
        globalOrigin,
      );

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui,
        },
      });
    }
  }
};
