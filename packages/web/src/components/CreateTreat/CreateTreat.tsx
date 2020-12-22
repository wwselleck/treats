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
import * as Rest from "../../lib/rest-client";

const useTreatSources = () => {
  const { result, loading } = Rest.useRequest(() => Rest.getTreatSources());
  return { treatSources: result, loading };
};

interface SourceSelectProps {
  treatSources: Array<Rest.TreatSource>;
  onChange(idSource: string): void;
}
const SourceSelect = ({ treatSources, onChange }: SourceSelectProps) => {
  return (
    <Select name="source" onChange={(e) => onChange(e.target.value)}>
      {treatSources.map((ts) => (
        <option>{ts.name}</option>
      ))}
    </Select>
  );
};

export const CreateTreat = () => {
  const { treatSources, loading } = useTreatSources();

  if (!treatSources || loading) {
    return null;
  }
  return (
    <Flex>
      <form>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input name="name" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="source">Source</FormLabel>
          <SourceSelect treatSources={treatSources} onChange={console.log} />
        </FormControl>
      </form>
    </Flex>
  );
};
