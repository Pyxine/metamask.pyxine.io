const PYXINE_API_BASE_URL = 'https://api.pyxine.io/v1/score';

export type Score = {
  contractAddress: string;
  final: number;
  contractOwner: number;
  isVerified: boolean;
  transactionsDiffAccounts: number;
  transactions: number;
};

export async function getScore(transaction: { to: string }): Promise<Score> {
  let scoreResult = await fetch(`${PYXINE_API_BASE_URL}/${transaction.to}`, {
    headers: {
      'x-cached': 'true',
    },
  });

  if (scoreResult.status === 404) {
    scoreResult = await fetch(`${PYXINE_API_BASE_URL}/${transaction.to}`);
  }

  if (scoreResult.status !== 200) {
    throw new Error(
      `Error fetching Pyxine API. Error: ${JSON.stringify({
        status: scoreResult.status,
        statusText: scoreResult.statusText,
      })}`,
    );
  }

  const score = await scoreResult.json();

  return score;
}
