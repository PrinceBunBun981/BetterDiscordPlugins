/**
 * @name OwOcord
 * @author PrinceBunBun981
 * @authorId 644298972420374528
 * @description Changes various things on your client to be *perfect*. (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧
 * @version 1.0
 * @source https://github.com/PrinceBunBun981/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/PrinceBunBun981/BetterDiscordPlugins/main/OwOcord.plugin.js
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

/*
 * Vanilla Discord Client script by Ben - https://gist.github.com/Benricheson101/6a16ff2c1f1c208ac1e17e3f9571e66d#file-discord-owo-js (255834596766253057)
 * Modified to work with BetterDiscord and allow for specific options:
 * - Enable/Disable String Translations
 * - Enable/Disable Guild Name Translations
 * - Enable/Disable Channel Name Translations
 */

const FACE_CHANCE = 40;
const faces = [
    '(o´∀`o)',
    '(#｀ε´)',
    '(๑•̀ㅁ•́๑)✧',
    '(*≧m≦*)',
    '(・`ω´・)',
    'UwU',
    'OwO',
    '>w<',
    '｡ﾟ( ﾟ^∀^ﾟ)ﾟ｡',
    'ヾ(｀ε´)ﾉ',
    '(´• ω •`)',
    'o(>ω<)o',
    '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
    '(⁀ᗢ⁀)',
    '(￣ε￣＠)',
    '( 〃▽〃)',
    '(o^ ^o)',
    "ヾ(*'▽'*)",
];

/**
 * OwOify a string.
 * @param {String} str The string to OwOify.
 * @returns The OwOified string.
 */
function transform(str) {
    let out = '';
    let level = 0;
    const chars = str.split('');
    for (let i = 0; i < chars.length; i++) {
        switch (chars[i]) {
            case '(':
            case '{':
                out += chars[i];
                level++;
                break;
            case ')':
            case '}':
                out += chars[i];
                level--;
                break;
            case '!': {
                out += chars[i];
                if (
                    level !== 0 ||
                    !(
                        chars[i - 1] !== '}' &&
                        chars[i - 2] !== '}' &&
                        chars[i + 1] !== '{' &&
                        chars[i + 2] !== '{'
                    ) ||
                    chars[i + 1] === '!'
                ) {
                    break;
                }
                const face = faces[Math.floor(Math.random() * faces.length)];
                out += ' ' + face + ' ';
                continue;
            }
            default: {
                if (level == 0) {
                    out += chars[i].replace(/[rl]/g, 'w').replace(/[RL]/g, 'W');
                } else {
                    out += chars[i];
                }
                break;
            }
        }
        if (i === chars.length - 1) {
            if (Math.floor(Math.random() * 100) < FACE_CHANCE) {
                const face = faces[Math.floor(Math.random() * faces.length)];
                out += ' ' + face;
            }
        }
    }
    return out.trim();
};

const config = {
    "main": "index.js",
    "info": {
        "name": "OwOcord",
        "authors": [{
            "name": "PrinceBunBun981",
            "discord_id": "644298972420374528",
            "github_username": "PrinceBunBun981",
        }],
        "version": "1.0",
        "description": transform("Changes various things on your client to be *perfect*."),
        "github": "https://github.com/PrinceBunBun981/BetterDiscordPlugins",
        "github_raw": "https://raw.githubusercontent.com/PrinceBunBun981/BetterDiscordPlugins/main/OwOcord.plugin.js"
    },
    "defaultConfig": [{
        "type": "switch",
        "id": "transformStrings",
        "name": "Discord Strings",
        "note": transform("OwOify Discord messages to be perfect. Very buggy - will occasionally crash."),
        "value": true
    },
    {
        "type": "switch",
        "id": "transformGuilds",
        "name": "Guild Names",
        "note": transform("OwOify names for servers you're in to be perfect."),
        "value": true
    },
    {
        "type": "switch",
        "id": "transformChannels",
        "name": "Channel Names",
        "note": transform("OwOify channel names in servers to be perfect."),
        "value": true
    }
]};

const settings = BdApi.loadData(config.info.name, `settings`);

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

    const language = BdApi.findModuleByProps("getLanguages", "Messages");
    const provider = language._provider;
    const strs = BdApi.findModuleByProps("COMMAND_NICK_SUCCESS");
    const defaultStrs = provider._context.defaultMessages;
    const GuildStore = BdApi.findModuleByProps("getGuildCount");
    const ChannelStore = BdApi.findModuleByProps("getMutableGuildChannelsForGuild");

    let newStrs = {...strs};
    let newDefaultStrs = {...defaultStrs}

    /**
     * OwOifies all Discord strings.
     */
    function transformStrings() {
        newStrs = Object.fromEntries(
            Object.entries(newStrs).map(([name, str]) =>
                typeof str === 'string' ? [name, transform(str)] : [name, str]
            )
        );
        console.log(newStrs);
        provider.refresh({
            messages: newStrs,
            defaultMessages: newDefaultStrs,
            locale: 'en-US',
        });
    }

    /**
     * Resets Discord strings to their defaults.
     */
    function resetStrings() {
        provider.refresh({
            messages: strs,
            defaultMessages: newDefaultStrs,
            locale: 'en-US',
        });
    }

    /**
     * OwOifies guild and/or channel names.
     * @param {Boolean} transformGuilds OwOify guild names?
     * @param {Boolean} transformChannels OwOify channel names?
     */
    function transformGuildsAndChannels(transformGuilds, transformChannels) {
        Object.values(GuildStore.getGuilds()).forEach(g => {
            if (transformGuilds) {
                g.oldName = g.name;
                g.name = transform(g.name);
            }
            if (transformChannels) {
                var channels = ChannelStore.getMutableGuildChannelsForGuild(g.id);
                if (channels) {
                    Object.values(channels).forEach(c => {
                        c.oldName = c.name;
                        c.name = transform(c.name);
                    });
                }
            }
        });
    }

    /**
     * Resets guild and/or channel names.
     * @param {Boolean} transformGuilds Reset guild names?
     * @param {Boolean} transformChannels Reset channel names?
     */
    function resetGuildsAndChannels(transformGuilds, transformChannels) {
        Object.values(GuildStore.getGuilds()).forEach(g => {
            if (transformGuilds) {
                if (g.oldName && g.name != g.oldName) g.name = g.oldName;
            }
            if (transformChannels) {
                var channels = ChannelStore.getMutableGuildChannelsForGuild(g.id);
                if (channels) {
                    Object.values(channels).forEach(c => {
                        if (c.oldName && c.name != c.oldName) c.name = c.oldName;
                    });
                }
            }
        });
    }

    return class OwO extends Plugin {

        onStart() {
            Logger.log("Started");
            if (settings.transformStrings) setTimeout(() => {transformStrings()}, 5000);
            transformGuildsAndChannels(settings.transformGuilds, settings.transformChannels);
        }

        onStop() {
            Logger.log("Stopped");
            resetStrings();
            resetGuildsAndChannels(true, true);
            Patcher.unpatchAll();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, checked) => {
                switch (id) {
                    case "transformStrings":
                        if (checked) {
                            transformStrings();
                        } else {
                            resetStrings();
                        }
                        break;
                    case "transformGuilds":
                        if (checked) {
                            transformGuildsAndChannels(true, false);
                        } else {
                            resetGuildsAndChannels(true, false);
                        }
                        break;
                    case "transformChannels":
                        if (checked) {
                            transformGuildsAndChannels(false, true);
                        } else {
                            resetGuildsAndChannels(false, true);
                        }
                        break;
                }
            });
            return panel.getElement();
        }
    };

};
return plugin(Plugin, Api);})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/