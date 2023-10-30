import { type Compiler, type NormalModule } from 'webpack';

const { validate } = require('schema-utils');

import { isVueTemplate, isScriptTemplate } from './utils';
const PLUGIN_NAME = 'AutoTrackPlugin';
export type Options = {
  debug?: boolean;
  buriedPoint: string;
};
const validationSchema = {
  type: 'object',
  additonalProperties: false,
  properties: {
    buriedPoint: {
      type: 'string'
    },
    debug: {
      type: 'boolean'
    }
  }
};
type NormalModuleLoader = {
  loader: string;
  options: any;
  ident?: string;
  type?: string;
};
export class AutoTrackPlugin {
  constructor(protected readonly options: Options) {
    validate(validationSchema, options, {
      name: PLUGIN_NAME
    });
  }
  public apply(compiler: Compiler): void {
    const { debug, buriedPoint } = this.options;
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      const modifiedModules: (string | number)[] = [];
      const tapCallback = (_: any, normalModule: NormalModule) => {
        const userRequest = normalModule.userRequest || '';
        const startIndex =
          userRequest.lastIndexOf('!') === -1
            ? 0
            : userRequest.lastIndexOf('!') + 1;
        const moduleRequest = userRequest
          .substring(startIndex)
          .replace(/\\/g, '/');
        if (modifiedModules.includes(moduleRequest)) {
          return;
        }
        if (isVueTemplate(moduleRequest) || isScriptTemplate(moduleRequest)) {
          let loader;
          try {
            loader = require.resolve('./loader.js');
          } catch (e) {
            loader = require.resolve('../build/loader.js');
          }
          const vueTemplateIndex = (
            normalModule.loaders as NormalModuleLoader[]
          ).findIndex(item =>
            item.loader.includes('/loaders/templateLoader.js')
          );

          (normalModule.loaders as NormalModuleLoader[]).splice(
            vueTemplateIndex > -1 ? vueTemplateIndex : -2,
            0,
            { loader, options: { moduleRequest, buriedPoint } }
          );
          modifiedModules.push(moduleRequest);

          if (debug) {
            console.log(
              `\n[${PLUGIN_NAME}] Use loader for "${moduleRequest}".`
            );
          }
        }
      };
      const NormalModule = compiler.webpack?.NormalModule;
      const isNormalModuleAvailable =
        Boolean(NormalModule) && Boolean(NormalModule.getCompilationHooks);
      if (isNormalModuleAvailable) {
        NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(
          PLUGIN_NAME,
          tapCallback
        );
      } else {
        compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, tapCallback);
      }
    });
  }
}
