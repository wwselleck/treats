#!/usr/bin/env node

export * from "./cli";

import * as CLI from "./cli";

if (require.main === module) {
  CLI.run();
}
