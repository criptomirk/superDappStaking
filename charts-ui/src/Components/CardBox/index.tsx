import React from "react";
import { Box as ChakraBox, BoxProps as ChakraBoxProps } from "@chakra-ui/react";

const defaultStyles: ChakraBoxProps = {
  mt: 5,
  mx: "auto",
  px: 5,
  py: 5,
  border: "1px solid #eee",
  width: "max-content",
  borderRadius: "md",
  wordBreak: "break-all",
};

export const Box: React.FC<ChakraBoxProps> = (props) => {
  return <ChakraBox {...defaultStyles} {...props} />;
};

export default Box;
