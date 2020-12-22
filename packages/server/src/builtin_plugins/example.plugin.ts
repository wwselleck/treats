import { TreatSourceOptionType } from "@treats-app/core";

const ExamplePlugin = {
  name: "builtin/example",
  treatSources: {
    ExampleTreatSource: {
      name: "ExampleTreatSource",
      configOptions: {
        exclude_c: {
          optionName: "exclude_c",
          optionType: TreatSourceOptionType.Boolean,
          isRequired: false,
        },
      },

      loadItems() {
        return Promise.resolve([
          {
            id: "a",
            title: "A",
            score: 500,
            description: "A",
            link: "https://example.com/a",
          },
          {
            id: "b",
            title: "B",
            score: 900,
            description: "B",
            link: "https://example.com/b",
          },
          {
            id: "c",
            title: "C",
            score: 300,
            description: "C",
            link: "https://example.com/c",
          },
          {
            id: "d",
            title: "D",
            score: 400,
            description: "D",
            link: "https://example.com/d",
          },
        ]);
      },
    },
  },
};
module.exports = ExamplePlugin;
