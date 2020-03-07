import commander = require("commander");
import chalk = require("chalk");
const inquirer = require("inquirer");
import Table from "cli-table";
import { TreatsAPI } from "./api";
import {
  TreatSourceConfigOptionType,
  TreatSourceConfigOption,
  TreatSourceConfigOptions,
  TreatConfig
} from "../packages/core";

import {
  SerializedTreat,
  SerializedTreatInput,
  SerializedTreatItem,
  SerializedTreatSource
} from "../server";

const TreatTable = {
  toString(treats: Array<SerializedTreat>) {
    const table = new Table({
      head: ["id", "name", "config"]
    });

    for (const treat of treats) {
      table.push([treat.id, treat.name, JSON.stringify(treat.config)]);
    }
  }
};

const TreatItemTable = {
  toString(items: Array<SerializedTreatItem>) {
    const table = new Table({
      head: ["score", "title", "description", "link"]
    });
    for (const item of items) {
      table.push([
        chalk.blue(item.score),
        item.title,
        item.description,
        item.link
      ]);
    }
    return table.toString();
  }
};

const TreatCreatePrompt = {
  async render(
    treatSource: SerializedTreatSource
  ): Promise<SerializedTreatInput> {
    const basicQuestions = [
      {
        type: "input",
        name: "name"
      }
    ];
    const { name } = await inquirer.prompt(basicQuestions);

    let config = null;
    if (treatSource.configOptions) {
      config = await TreatConfigPrompt.render(treatSource.configOptions);
    }

    return { idTreatSource: treatSource.id, name, config };
  }
};
const TreatConfigPrompt = {
  async render(
    configOptions: TreatSourceConfigOptions
  ): Promise<SerializedTreat["config"]> {
    const questions = Object.values(configOptions).map(o => {
      if (o.optionType === TreatSourceConfigOptionType.String) {
        return TreatConfigPrompt.questionForString(o);
      } else if (o.optionType === TreatSourceConfigOptionType.Boolean) {
        return TreatConfigPrompt.questionForBoolean(o);
      } else {
        // if required option, error
        // otherwise warn
      }
    });
    const answers = await inquirer.prompt(questions);
    return answers;
  },
  questionForString(configOption: TreatSourceConfigOption) {
    return {
      type: "input",
      name: configOption.optionName
    };
  },
  questionForBoolean(configOption: TreatSourceConfigOption) {
    return {
      type: "confirm",
      name: configOption.optionName
    };
  }
};

const ItemsCommand = {
  register(program: commander.Command) {
    program.command("items <idTreat>").action(async idTreat => {
      const items = await new TreatsAPI().getItems(idTreat);
      console.log(TreatItemTable.toString(items));
    });
  }
};

const ListCommand = {
  register(program: commander.Command) {
    program.command("list").action(async () => {
      const treats = await new TreatsAPI().getTreats();
      console.log(TreatTable.toString(treats));
    });
  }
};

const CreateCommand = {
  register(program: commander.Command) {
    program.command("create").action(async () => {
      const treatSources = await new TreatsAPI().getTreatSources();
      const { idTreatSource } = await inquirer.prompt([
        {
          type: "list",
          name: "idTreatSource",
          choices: treatSources.map(ts => ({
            name: `${ts.name} (${ts.id})`,
            value: ts.id
          }))
        }
      ]);

      const treatSource = treatSources.find(ts => ts.id === idTreatSource)!;
      const treatInput = await TreatCreatePrompt.render(treatSource);
      const result = await new TreatsAPI().createTreat(treatInput);
      console.log(result);
    });
  }
};

export function run() {
  const program = new commander.Command();
  ItemsCommand.register(program);
  ListCommand.register(program);
  CreateCommand.register(program);
  program.parse(process.argv);
}
