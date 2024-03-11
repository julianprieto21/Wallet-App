"use client";
import { lang } from "@/app/lib/const/string-en";
import { Account, Transaction } from "@/app/lib/types";
import { getBalanceFromTransactions } from "@/app/lib/utils";
import BalanceWidget from "@/app/components/wallet/BalanceWidget";
import { AccountSelector } from "@/app/components/wallet/AccountSelector";
import { useSearchParams } from "next/navigation";

function MainTitle({ userName }: { userName: string }) {
  return (
    <div className="w-2/5">
      <h1 className="text-7xl font-thin">{lang.hiText},</h1>
      <strong className="text-7xl font-medium">{userName.split(" ")[0]}</strong>
    </div>
  );
}

interface Props {
  userName: string;
  transactions: Transaction[];
  accounts: Account[];
}

export default function WalletInfo({
  userName,
  transactions,
  accounts,
}: Props) {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("account");
  let filteredTransactions = transactions;
  if (accountId) {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.account_id === accountId
    );
  }
  const { income, expense } = getBalanceFromTransactions(filteredTransactions);
  const balance = income + expense;
  return (
    <div className="flex flex-row items-center justify-around w-2/4">
      <MainTitle userName={userName} />
      <div className="flex flex-col gap-4 items-center w-1/2">
        <BalanceWidget balance={balance} />
        <AccountSelector accounts={accounts} />
      </div>
    </div>
  );
}
