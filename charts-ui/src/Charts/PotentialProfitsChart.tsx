import {
  Divider,
  HStack,
  Select,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import React, { FC, useCallback, useEffect, useState } from "react";
import {
  PotentialProfitItem,
  PotentialProfitUserItem,
  PotentialProfitsData,
} from "../Types/charts";
import CardBox from "../Components/CardBox";
import { StrategySelector } from "../Components/StrategySelector";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

//Commented to use % formatting
// const formatTick = (value: number | string) => {
//   value = Number(value);

//   if (value >= 1000 && value < 100_000) {
//     return `${(value / 1000).toFixed(1)}k`; // Convert to 'k' format and keep one decimal
//   }

//   if (value >= 100_000) {
//     return `${(value / 1_000_000).toFixed(1)}kk`; // Convert to 'k' format and keep one decimal
//   }
//   return value.toString();
// };

const formatPercentageTick = (value: number) => `${value.toFixed(2)}%`;

const resourceUrlBuilder = (strategy: number, resource: string) => {
  return `/results-json/${strategy}/${resource}.json`;
}

export const PotentialProfitsChart: FC = () => {
  const [renderData, setRenderData] = useState<{
    [key: number]: {
      [key: number]: {
        potentialProfit: string;
        buyPrice: string | null;
      };
    };
  }>({}); // key is token ID , number is amount of tokens


  const [strategy, setStrategy] = useState<number>(1);

  const [selectedTokenHours, setSelectedTokenHours] = useState<
    {
      hour: number;
      price: string;
      potentialProfit: string;
    }[]
  >([]);

  useEffect(() => {
    fetch(resourceUrlBuilder(strategy, "potentialProfitsSnapShots"))
      .then((response) => response.json())
      .then((data: PotentialProfitsData[]) => {
        const changeRenderData: {
          [key: number]: {
            [key: number]: {
              potentialProfit: string;
              buyPrice: string | null;
            };
          };
        } = {};
        const avTokens: number[] = [];
        const latestBuyPrices: { [tokenId: number]: string } = {}; // Track the latest buyPrice for each token

        data.forEach((item: PotentialProfitsData, hour: number) => {
          item.forEach((snap: PotentialProfitUserItem) => {
            if (snap.potentialProfits.length > 0) {
              snap.potentialProfits.forEach(
                (_item: PotentialProfitItem, index: number) => {
                  if (null !== _item) {
                    const tokenId = parseInt(_item.tokenId);
                    if (!changeRenderData[tokenId]) {
                      changeRenderData[tokenId] = {};
                    }
                    if (!avTokens.includes(tokenId)) {
                      avTokens.push(tokenId);
                    }

                    // Update the latestBuyPrices with the current item's buyPrice if it exists
                    if (_item.buyPrice) {
                      latestBuyPrices[tokenId] = _item.buyPrice;
                    }

                    // Use the latest known buyPrice if the current item's buyPrice is null
                    const buyPrice =
                      _item.buyPrice || latestBuyPrices[tokenId] || null;

                    changeRenderData[tokenId][hour] = {
                      potentialProfit: _item.potentialProfit,
                      buyPrice: buyPrice, // Use the latest buyPrice here
                    };
                  }
                }
              );
            }
          });
        });

        setRenderData(changeRenderData);
      });
  }, [strategy]);

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

  const [maxValue, setMaxValue] = useState<number>(0);
  const [minValue, setMinValue] = useState<number>(0);

  const handleSelectSelectedTokenHours = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedTokenId = parseInt(e.target.value);
      const selectedTokenBuyPrice = Object.values(
        renderData[selectedTokenId]
      ).find((item) => item.buyPrice !== null)?.buyPrice;

      // Assuming you want to use 'potentialProfit' as the price for the chart
      const datasetSelected = Object.keys(renderData[selectedTokenId]).map(
        (hour) => {
          console.log(hour, "hour");
          const item = renderData[selectedTokenId][parseInt(hour)];
          const buyPrice = selectedTokenBuyPrice
            ? parseFloat(selectedTokenBuyPrice)
            : 0;
          const itemPotentialProfit = parseFloat(item.potentialProfit);
          // Calculate the percentage
          const percentage =
            buyPrice > 0 ? (itemPotentialProfit / buyPrice) * 100 : 0;

          console.log("item", item);

          return {
            hour: parseInt(hour),
            price: item.potentialProfit, // Convert number to string here
            potentialProfit: percentage.toString(), // This is already a string
          };
        }
      );

      setSelectedTokenHours([...datasetSelected]);

      // Adjust maxYValue calculation if needed
      const maxYValue = Math.max(
        ...datasetSelected.map((item) => parseFloat(item.potentialProfit))
      );
      const minYValue = Math.min(
        ...datasetSelected.map((item) => parseFloat(item.potentialProfit))
      );
      const upperDomainLimit = maxYValue * 1.2; // Adding 20% as a buffer
      const lowerDomainLimit = minYValue * 0.8; // Removing 20% as a buffer
      setMaxValue(upperDomainLimit);
      setMinValue(lowerDomainLimit);
    },
    [renderData]
  );

  const tooltipFormatter = (value: string, name: string) => {
    // Convert the value to a number before formatting
    const numericValue = parseFloat(value);
    // Now, safely call .toFixed() on the numeric value
    return [`${numericValue.toFixed(2)}%`, name];
  };

  return (
    <CardBox>
      <HStack mb={3}>
        <Text w={'30%'}>
          Strategy
        </Text>
        <StrategySelector
          onSelect={(selected: number) => {
            console.log("selected - ", selected);
            setStrategy(selected);
          }}
          selected={strategy}
          min={1}
          max={7} />
      </HStack>
      <HStack>
        <Text
          sx={{
            mt: 5,
            mx: "auto",
          }}
        >
          Potential Profits based on token
        </Text>
        <Select
          placeholder="Select token"
          onChange={(e) => handleSelectSelectedTokenHours(e)}
        >
          {Object.keys(renderData).map((key: string) => {
            return (
              <option key={key} value={key}>
                {key}
              </option>
            );
          })}
        </Select>
      </HStack>

      <LineChart
        width={chartWidth}
        height={chartHeight}
        data={selectedTokenHours}
      >
        <CartesianGrid />
        <XAxis dataKey="hour" />
        <YAxis
          allowDataOverflow={true}
          domain={[minValue, maxValue]}
          dataKey="potentialProfit"
          fill="#8884d8"
          tickFormatter={formatPercentageTick}
          allowDecimals={true}
          type="number"
        />
        <Line
          type="monotone"
          label={`Share potential price at hour`}
          dataKey="potentialProfit"
          stroke="#8884d8"
          dot={(props) => {
            // Destructure the payload to get the current point's potentialProfit value
            const { payload } = props;
            // Check if potentialProfit is 20% or greater
            const isProfitable = payload.potentialProfit >= 20;
            // Return a custom dot with color green if profitable
            return (
              <circle
                key={props.key}
                cx={props.cx}
                cy={props.cy}
                r={5}
                fill={isProfitable ? "green" : "#8884d8"} // green for 20% or greater
                stroke="none"
              />
            );
          }}
        />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />
      </LineChart>
    </CardBox>
  );
};
