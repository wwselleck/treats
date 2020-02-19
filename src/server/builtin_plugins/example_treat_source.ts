import { TreatSourceConfigOptionType } from "../entity";

export default class ExampleTreatSourcePlugin {
  static definition = {
    id: "example",
    name: "Example Treat Source",
    configOptions: {
      exclude_c: {
        optionName: "exclude_c",
        optionType: TreatSourceConfigOptionType.String,
        isRequired: false
      }
    }
  };

  static create() {
    return new ExampleTreatSourcePlugin();
  }

  async loadItems() {
    return Promise.resolve([
      {
        id: "a",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "A",
        score: 500,
        description: "An A",
        link: "https://example.com/a"
      },
      {
        id: "b",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "B",
        score: 900,
        description: "B",
        link: "https://example.com/b"
      },
      {
        id: "c",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "C",
        score: 300,
        description: "C",
        link: "https://example.com/c"
      },
      {
        id: "d",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "D",
        score: 400,
        description: "D",
        link: "https://example.com/d"
      }
    ]);
  }
}

export const TreatSource = {
  name: "ExampleTreatSourcePlugin",
  configOptions: {
    exclude_c: {
      optionName: "exclude_c",
      optionType: TreatSourceConfigOptionType.String,
      isRequired: false
    }
  },
  loadItems: () => {
    return Promise.resolve([
      {
        id: "a",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "A",
        score: 500,
        description: "An A",
        link: "https://example.com/a"
      },
      {
        id: "b",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "B",
        score: 900,
        description: "B",
        link: "https://example.com/b"
      },
      {
        id: "c",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "C",
        score: 300,
        description: "C",
        link: "https://example.com/c"
      },
      {
        id: "d",
        idTreatSource: ExampleTreatSourcePlugin.definition.id,
        title: "D",
        score: 400,
        description: "D",
        link: "https://example.com/d"
      }
    ]);
  }
};
