import commander = require("commander");
import chalk = require("chalk");
import Table from "cli-table";
import { TreatsAPI } from "./api";

const TreatItemTable = {
  toString(items: any) {
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

      const table = new Table({
        head: ["id", "name", "config"]
      });

      for (const treat of treats) {
        table.push([treat.id, treat.name, JSON.stringify(treat.config)]);
      }

      console.log(table.toString());
    });
  }
};

export function run() {
  const program = new commander.Command();
  ItemsCommand.register(program);
  ListCommand.register(program);
  program.parse(process.argv);
}
