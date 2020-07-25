import {
  TreatSource,
  TreatSourceType,
  TreatSourceService,
} from "@treats-app/core";
import { PluginService } from "./plugin_service";
import { Plugin, PluginTreatSource } from "./plugin";

export class PluginTreatSourceService implements TreatSourceService {
  pluginService: PluginService;

  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async get(id: string): Promise<TreatSource> {
    const { pluginName, pluginTreatSourceName } = parseIdPluginTreatSource(id);

    const plugin = await this.pluginService.get(pluginName);
    const pluginTreatSource = plugin.treatSource(pluginTreatSourceName);

    return treatSourceFromPluginTreatSource(plugin, pluginTreatSource);
  }

  async all(): Promise<Array<TreatSource>> {
    const plugins = await this.pluginService.all();

    const treatSources = plugins
      .map((p: Plugin) => ({
        plugin: p,
        treatSources: p.treatSources(),
      }))
      .map((obj) =>
        obj.treatSources.map((ts) =>
          treatSourceFromPluginTreatSource(obj.plugin, ts)
        )
      )
      .reduce((acc: Array<TreatSource>, curr: Array<TreatSource>) => {
        acc = acc.concat(curr);
        return acc;
      }, [] as Array<TreatSource>);

    return treatSources;
  }
}

export function treatSourceFromPluginTreatSource(
  plugin: Plugin,
  pluginTreatSource: PluginTreatSource
): TreatSource {
  return {
    id: idForPluginTreatSource(plugin, pluginTreatSource),
    name: pluginTreatSource.name,
    configOptions: pluginTreatSource.configOptions,
    type: TreatSourceType.Plugin,
    info: {
      pluginName: plugin.name,
    },
  };
}

function idForPluginTreatSource(
  plugin: Plugin,
  treatSource: PluginTreatSource
) {
  return `${plugin.name}_${treatSource.name}`;
}

function parseIdPluginTreatSource(idPluginTreatSource: string) {
  const [pluginName, pluginTreatSourceName] = idPluginTreatSource.split("_");
  return {
    pluginName,
    pluginTreatSourceName,
  };
}
