import path from "path";
import configTools from "@skylixgh/nitrojs-config-tools";
import ConfigAppType from "../enums/ConfigAppType";
import ConfigType from "../interfaces/ConfigType";
import { Errors as ConfigToolsErrors } from "@skylixgh/nitrojs-config-tools";
import terminal, { State as TerminalState } from "@skylixgh/nitrojs-terminal";

/**
 * Read the NitroJS app config
 * @param path The path to the config
 */
export default function readConfig(configPath = "nitrojs.config.ts", callBack: (config: ConfigType) => void) {
    terminal.animate("Loading your application's configuration");

    configTools
        .read<ConfigType>(
            path.join(process.cwd(), configPath),
            {
                type: ConfigAppType.desktop,
                node: {
                    autoRestart: true,
                    resourceDirectories: []
                }
            },
            {
                supportedTypes: {
                    yaml: false,
                    json: false
                }
            }
        )
        .then((config) => {
            terminal.stopAnimation(TerminalState.success, "Successfully loaded your application's configuration");
            callBack(config);
        })
        .catch((errorCode) => {
            switch (errorCode) {
                case ConfigToolsErrors.filePathWasDirectory:
                    terminal.stopAnimation(TerminalState.error, "Failed to load the configuration because the file path provided was a directory");
                    break;

                case ConfigToolsErrors.incorrectExportOrNone:
                    terminal.stopAnimation(
                        TerminalState.error,
                        "Failed to load the configuration because either a config was not exported or was exported using the wrong name"
                    );
                    break;

                case ConfigToolsErrors.invalidFilePath:
                    terminal.stopAnimation(
                        TerminalState.error,
                        "Failed to load the configuration because the file path provided is invalid or the file doesn't exist in the current directory"
                    );
                    break;

                case ConfigToolsErrors.unsupportedFileType:
                    terminal.stopAnimation(
                        TerminalState.error,
                        "Failed to load the configuration because the file extension is unsupported for loading configurations in this app"
                    );
                    break;

                default:
                    terminal.stopAnimation(TerminalState.error, "Failed to load your configuration because the file contains errors");

                    errorCode.split("\n").forEach((line: string) => {
                        terminal.error("  " + line);
                    });

                    terminal.error("The error has been printed above");
                    break;
            }
        });
}
