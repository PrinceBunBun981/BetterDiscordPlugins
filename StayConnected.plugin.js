/**
 * @name StayConnected
 * @author PrinceBunBun981
 * @authorId 644298972420374528
 * @description Prevents Discord from kicking you from calls when alone for too long.
 * @version 1.0
 * @source https://github.com/PrinceBunBun981/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/PrinceBunBun981/BetterDiscordPlugins/main/StayConnected.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

const config = {
    "main": "index.js",
    "info": {
        "name": "StayConnected",
        "authors": [{
            "name": "PrinceBunBun981",
            "discord_id": "644298972420374528",
            "github_username": "PrinceBunBun981",
        }],
        "version": "1.0",
        "description": "Prevents Discord from kicking you from calls when alone for too long.",
        "github": "https://github.com/PrinceBunBun981/BetterDiscordPlugins",
        "github_raw": "https://raw.githubusercontent.com/PrinceBunBun981/BetterDiscordPlugins/main/StayConnected.plugin.js"
    }
};


class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
            });
        }
    });
}

module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
    const plugin = (Plugin, Library) => {
    const {Logger, Patcher} = Library;

    return class StayConnected extends Plugin {
        onStart() {         
            const Timeout = ZeresPluginLibrary.WebpackModules.getModule((m) =>
                ["start", "stop", "isStarted"].every(
                    (proto) => m?.V7?.prototype?.[proto]
                )
            );

            Patcher.after(Timeout.prototype, "start", (timeout, [_, args]) => {
                if (args?.toString().includes("BOT_CALL_IDLE_DISCONNECT")) {
                    timeout.stop();
                }
            });

            Logger.log("Started");
        }

        onStop() {
            Patcher.unpatchAll();
            Logger.log("Stopped");
        }
    };
};
return plugin(Plugin, Api);})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/
