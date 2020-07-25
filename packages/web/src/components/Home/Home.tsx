import * as React from "react";
import * as Rest from "../../lib/rest-client";

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
  return <div>{JSON.stringify(treats)}</div>;
};
