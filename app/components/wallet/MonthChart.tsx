"use client";
import { Transaction } from "@/app/lib/types";
import { formatBalance, formatDate, getBalanceByDay } from "@/app/lib/utils";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import { lang } from "@/app/lib/const/string-en";

export default function MonthChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const groupedTransactions = getBalanceByDay(transactions, month, year);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: boolean;
    payload: any;
    label: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <strong className="label">{formatDate(label)}</strong>
          <p className="desc">{formatBalance(payload[0].value)}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <h1 className="text-2xl font-semibold pb-2">{lang.monthChartText}</h1>
      <ResponsiveContainer width="65%" height="30%">
        <LineChart
          width={500}
          height={300}
          data={groupedTransactions}
          margin={{
            top: 5,
            right: 60,
            left: 60,
            bottom: 5,
          }}
        >
          <Tooltip
            content={<CustomTooltip active={true} payload={0} label="" />}
          />
          {/* <YAxis /> */}
          <XAxis dataKey="date" tick={false} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
