import React, { FC } from "react";
import { Select } from "@chakra-ui/react";

export type StrategySelectorProps = {
    onSelect: (strategy: number) => void;
    selected: number;
    min?: number;
    max?: number;
}


export const StrategySelector: FC<StrategySelectorProps> = ({ onSelect, selected = 1, min = 1, max = 7 }) => {
    return (
        <Select placeholder="Select strategy" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelect(parseInt(e.target.value))}>
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((strategy) => (
                <option key={strategy} value={strategy} defaultValue={selected}>
                    {`Strategy ${strategy}`}
                </option>
            ))}
        </Select>
    );
}