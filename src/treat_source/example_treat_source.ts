import { TreatSource } from ".";

export const ExampleTreatSource: TreatSource = {
  id: "example",
  name: "Example Treat Source",
  items() {
    return Promise.resolve([
      {
        id: "a",
        idTreatSource: this.id,
        title: "A",
        score: 500,
        description: "An A",
        link: "https://example.com/a"
      },
      {
        id: "b",
        idTreatSource: this.id,
        title: "B",
        score: 900,
        description: "B",
        link: "https://example.com/b"
      },
      {
        id: "c",
        idTreatSource: this.id,
        title: "C",
        score: 300,
        description: "C",
        link: "https://example.com/c"
      },
      {
        id: "d",
        idTreatSource: this.id,
        title: "D",
        score: 400,
        description: "D",
        link: "https://example.com/d"
      }
    ]);
  }
};
