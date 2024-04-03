"use server";
import { VercelPoolClient, db } from "@vercel/postgres";
import { Account, Transaction, User, Wallet } from "./types";
import { createUser, createWallet } from "./actions";

export async function fetchAllUsers(client: VercelPoolClient) {
  try {
    const data = await client.sql<User>`SELECT * FROM users`;
    return data.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fecth user data.");
  }
}

export async function fetchUser(client: VercelPoolClient, mail: string, name: string) {
  try {
    const data =
      await client.sql<User>`SELECT * FROM users WHERE email = ${mail}`;
    if (data.rows.length === 0) {
      createUser(client, {email: mail, name: name});
      const data =
        await client.sql<User>`SELECT * FROM users WHERE email = ${mail}`;
      createWallet(client, {
        created_at: new Date(),
        user_id: data.rows[0].id,
      } as Wallet);
      return data.rows[0];
    }
    return data.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fecth user data.");
  }
}

export async function fetchWalletFromUser(
  client: VercelPoolClient,
  userId: string
) {
  try {
    const data =
      await client.sql<Wallet>`SELECT * FROM wallets WHERE user_id = ${userId}`;
    return data.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fecth wallet data.");
  }
}

export async function fetchAccountsFromWallet(
  client: VercelPoolClient,
  walletId: string
) {
  try {
    const data =
      await client.sql<Account>`SELECT a.* FROM accounts AS a WHERE wallet_id = ${walletId}`;
    return data.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fecth account data.");
  }
}

export async function fetchTransactionsFromWallet(
  client: VercelPoolClient,
  walletId: string
) {
  try {
    const data =
      await client.sql<Transaction>`SELECT t.* FROM transactions AS t WHERE wallet_id = ${walletId}`;
    return data.rows;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fecth transactions data.");
  }
}

export async function fetchTransactionFromId(
  client: VercelPoolClient,
  transactionId: string
) {
  try {
    const data =
      await client.sql<Transaction>`SELECT t.* FROM transactions AS t WHERE id = ${transactionId}`;
    return data.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fecth transactions data.");
  } finally {
    client.release();
  }
}

export async function fetchData({mail, name}: {mail: string, name: string}) {
  const client: VercelPoolClient = await db.connect();
  const user: User = await fetchUser(client, mail, name);
  const wallet: Wallet = await fetchWalletFromUser(client, user.id);
  const accounts: Account[] = await fetchAccountsFromWallet(client, wallet.id);
  const transactions: Transaction[] = await fetchTransactionsFromWallet(
    client,
    wallet.id
  );
  return { accounts, transactions };
}
