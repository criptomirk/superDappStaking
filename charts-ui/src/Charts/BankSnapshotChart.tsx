import {
  Divider,
  HStack,
  Select,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import {
  BankSnapShotArray,
  BankSnapShotItem,
  BankSnapShotItemWalletBalance,
} from "../Types/charts";
import CardBox from "../Components/CardBox";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";

const formatTick = (value: number | string) => {
  value = Number(value);

  if (value >= 1000 && value < 100_000) {
    return `${(value / 1000).toFixed(1)}k`; // Convert to 'k' format and keep one decimal
  }

  if (value >= 100_000) {
    return `${(value / 1_000_000).toFixed(1)}kk`; // Convert to 'k' format and keep one decimal
  }
  return value.toString();
};

export const BankShanpshotChart: FC = () => {
  const [data, setData] = useState<BankSnapShotArray>([]);

  const [selectedWalletBalances, setSelectedWalletBalances] = useState<
    BankSnapShotItemWalletBalance[]
  >([]);

  useEffect(() => {
    fetch("/results-json/bankSnapShots.json")
      .then((response) => response.json())
      .then((data: BankSnapShotArray) => {
        const newData = data.map((item) => {
          // Assuming balance is a string that needs to be converted to a number
          const totalBalance = item.walletsBalances.reduce(
            (acc, curr) => acc + Number(curr.balance),
            0
          );
          console.log(totalBalance, "totalBalance");
          const protocolOwnerBalance = Number(item.protocolOwnerBalance);
          console.log(protocolOwnerBalance, "protocolOwnerBalance");
          const percentage =
            totalBalance > 0 ? (protocolOwnerBalance / totalBalance) * 100 : 0;
          console.log(percentage, "ownerPercentage");

          return {
            ...item,
            protocolOwnerPercentage: percentage,
          };
        });
        console.log(newData);
        setData(newData);
      });
  }, []);

  const onChangeWallet = (idx: number) => {
    const walletsBalances: BankSnapShotItemWalletBalance[] = [];
    data.forEach((item: BankSnapShotItem) => {
      walletsBalances.push(item.walletsBalances[idx]);
    });
    setSelectedWalletBalances(walletsBalances);
  };

  console.log(data, "wallet balance data");

  // Define responsive width and height
  const chartWidth = useBreakpointValue({
    base: 500,
    sm: 600,
    md: 700,
    lg: 1100,
    xl: 1200,
  });
  const chartHeight = useBreakpointValue({
    base: 550,
    sm: 600,
    md: 750,
    lg: 850,
    xl: 950,
  });

  const tooltipFormatter = (value: string, name: string) => {
    // Convert the value to a number before formatting
    const numericValue = parseFloat(value);
    // Now, safely call .toFixed() on the numeric value
    return [`${numericValue.toFixed(2)}%`, name];
  };

  return (
    <CardBox>
      <Text
        sx={{
          mt: 5,
          mx: "auto",
        }}
      >
        Protocol Owner Balance chart in PERCENTAGE.
      </Text>
      <LineChart width={chartWidth} height={chartHeight} data={data}>
        <Line
          type="monotone"
          dataKey="protocolOwnerPercentage"
          stroke="#8884d8"
        />
        <CartesianGrid stroke="#ccc" />
        <Legend />
        <XAxis label={"Hour"} />
        <YAxis
          interval={"preserveStart"}
          allowDecimals={true}
          tickFormatter={(value) => `${value.toFixed(2)}%`} // Format as percentage with two decimal places
          domain={[0, "dataMax + 5"]} // Adjust domain if necessary to ensure all data is visible
        />
        <Tooltip formatter={tooltipFormatter} />
      </LineChart>

      <Divider sx={{ mt: 5 }} />

      <Text
        sx={{
          mt: 5,
          mx: "auto",
        }}
      >
        Total Groups
      </Text>
      <LineChart width={chartWidth} height={chartHeight} data={data}>
        <Line type="monotone" dataKey="totalGroups" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <Legend />

        <XAxis label={"Hour"} />
        <YAxis
          interval={"preserveStart"}
          allowDecimals={false}
          tickSize={8}
          type="category"
        />
        <Tooltip />
      </LineChart>

      <Divider sx={{ mt: 5 }} />

      <HStack>
        <Text
          sx={{
            mt: 5,
            mx: "auto",
          }}
        >
          Wallets Balances
        </Text>
        <Select
          placeholder="Select wallet"
          onChange={(e) => onChangeWallet(Number(e.target.value))}
        >
          {data[0]?.walletsBalances.map((wallet, idx) => (
            <option key={idx} value={idx}>
              {idx}-{wallet.address}
            </option>
          ))}
        </Select>
      </HStack>
      <LineChart
        width={chartWidth}
        height={chartHeight}
        data={selectedWalletBalances ?? []}
      >
        <Line type="linear" dataKey="balance" stroke="black" />
        <Legend />

        <XAxis label={"Hour"} />
        <YAxis
          allowDecimals={false}
          tickFormatter={formatTick}
          tickSize={8}
          type="category"
        />
        <Tooltip />
      </LineChart>
    </CardBox>
  );
};
