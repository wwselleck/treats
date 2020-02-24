import commander = require("commander");
import { TreatsAPI } from "./api";

const ItemsCommand = {
  register(program: commander.Command) {
    program.command("items").action(() => {
      console.log("items");
    });
  }
};

const ListCommand = {
  register(program: commander.Command) {
    program.command("list").action(async () => {
      console.log("list");
      const treats = await new TreatsAPI().getTreats();
      console.log(treats);
    });
  }
};

export function run() {
  const program = new commander.Command();
  ItemsCommand.register(program);
  ListCommand.register(program);
  program.parse(process.argv);
}
