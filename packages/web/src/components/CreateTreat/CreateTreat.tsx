import * as React from "react";
import {
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
} from "@chakra-ui/core";

interface SourceSelectProps {
  onChange(idSource: string): void;
}
const SourceSelect = ({ onChange }: SourceSelectProps) => {
  return (
    <Select name="source" onChange={(e) => onChange(e.target.value)}>
      <option>Twitch</option>
      <option>Reddit</option>
      <option>Sports Scores</option>
    </Select>
  );
};

export const CreateTreat = () => {
  return (
    <Flex>
      <form>
        <FormControl>
          <FormLabel htmlFor="source">Source</FormLabel>
          <SourceSelect onChange={console.log} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" />
        </FormControl>
      </form>
    </Flex>
  );
};

