import * as React from "react";
import { Box } from "@chakra-ui/core";
import * as Rest from "../../lib/rest-client";
import { CreateTreat } from "../CreateTreat";

const useTreats = () => {
  const [treats, setTreats] = React.useState<Array<Rest.Treat> | null>(null);
  React.useEffect(() => {
    Rest.getTreats().then((res) => {
      setTreats(res);
    });
  }, []);
  return treats;
};

export const Home = () => {
  const treats = useTreats();
  return (
    <div>
      <Box margin="0 auto" width="50%">
        {JSON.stringify(treats)}
        <CreateTreat />
      </Box>
    </div>
  );
};
