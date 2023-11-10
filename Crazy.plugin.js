/**
 * @name Crazy
 * @author PrinceBunBun981
 * @authorId 644298972420374528
 * @description Crazy? I was crazy once. They locked me in a room... a rubber room... a rubber room with rats... and rats make me crazy.
 * @version 1.3
 * @source https://github.com/PrinceBunBun981/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/PrinceBunBun981/BetterDiscordPlugins/main/Crazy.plugin.js
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
        "name": "Crazy",
        "authors": [{
            "name": "PrinceBunBun981",
            "discord_id": "644298972420374528",
            "github_username": "PrinceBunBun981",
        }],
        "version": "1.3",
        "description": "Crazy? I was crazy once. They locked me in a room... a rubber room... a rubber room with rats... and rats make me crazy.",
        "github": "https://github.com/PrinceBunBun981/BetterDiscordPlugins",
        "github_raw": "https://raw.githubusercontent.com/PrinceBunBun981/BetterDiscordPlugins/main/Crazy.plugin.js"
    },
    "defaultConfig": [{
        "type": "switch",
        "id": "autoCrazy",
        "name": "Auto Crazy",
        "note": "Automatically respond to DMs or Group DMs that contain the word \"crazy\".",
        "value": false
    }]
};

const messages = {
    crazy_messages: ["crazy?", "i was crazy once", "they locked me in a room", "a rubber room", "a rubber room with rats", "and rats make me crazy"],
    context_button: "Crazy?",
    user_is_crazy: "%user% is crazy.",
    sent_repeat_text: "That was crazy!"
}
 
let settings = BdApi.loadData(config.info.name, `settings`);

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
    const {React} = BdApi;

    const Dispatcher = BdApi.findModuleByProps("dispatch", "subscribe");
    const CurrentUserStore = BdApi.findModuleByProps("getCurrentUser");
    const ChannelStore = BdApi.findModuleByProps("getDMFromUserId");
    const MessageStore = BdApi.findModuleByProps("sendMessage");
    const Toast = BdApi.findModuleByProps("showToast");

    let lastUsed = 0;

    async function repeatSend(id) {
        console.log(id);
        Toast.showToast(Toast.createToast(messages.sent_repeat_text, Toast.ToastType.SUCCESS, {position: Toast.ToastPosition.TOP}));
        for (var i = 0; i < messages.crazy_messages.length; i++) {
            MessageStore.sendMessage(id, {content: messages.crazy_messages[i], invalidEmojis: [], validNonShortcutEmojis: []});
            await new Promise(res => setTimeout(res, messages.crazy_messages[i].length * Math.floor(Math.random() * (150 - 100 + 1) + 100 + (messages.crazy_messages[i].includes(" ") ? 0 : 200))));
        }
    }

    return class Crazy extends Plugin {
        async onMessage({message, channelId}) {
            if (settings.autoCrazy && Date.now() - lastUsed > 25000 && message.content.toLowerCase().includes("crazy") && message.author.id != CurrentUserStore.getCurrentUser().id) {
                let channel = ChannelStore.getChannel(channelId);
                if (channel.isDM() || channel.isGroupDM()) {
                    Toast.showToast(Toast.createToast(messages.user_is_crazy.replace("%user%", message.author.username), Toast.ToastType.MESSAGE, {position: Toast.ToastPosition.TOP}));
                    lastUsed = Date.now();
                    await new Promise(res => setTimeout(res, Math.floor(Math.random() * (7500 - 5000 + 1) + 5000)));
                    repeatSend(channel.id);
                } 
            }
        }

        onStart() {         
            this.userContextMenuPatch = BdApi.ContextMenu.patch("user-context", (tree, c) => {
                if (c.user.id != CurrentUserStore.getCurrentUser().id && !c.user.bot && !c.user.system) {
                    tree.props.children.push(
                        React.createElement(BdApi.ContextMenu.Separator),
                        React.createElement(BdApi.ContextMenu.Item, {
                            label: messages.context_button,
                            id: "user-crazy-context-menu-item",
                            action: () => {
                                repeatSend(ChannelStore.getDMFromUserId(c.user.id));
                            }
                        })
                    );
                }
            });

            this.channelContextMenuPatch = BdApi.ContextMenu.patch("channel-context", (tree, c) => {
                tree.props.children.push(
                    React.createElement(BdApi.ContextMenu.Separator),
                    React.createElement(BdApi.ContextMenu.Item, {
                        label: messages.context_button,
                        id: "channel-crazy-context-menu-item",
                        action: () => {
                            repeatSend(c.channel.id);
                        }
                    })
                );
            });

            this.gdmContextMenuPatch = BdApi.ContextMenu.patch("gdm-context", (tree, c) => {
                tree.props.children.push(
                    React.createElement(BdApi.ContextMenu.Separator),
                    React.createElement(BdApi.ContextMenu.Item, {
                        label: messages.context_button,
                        id: "gdm-crazy-context-menu-item",
                        action: () => {
                            repeatSend(c.channel.id);
                        }
                    })
                );
            });

            Dispatcher.subscribe("MESSAGE_CREATE", this.onMessage);

            Logger.log("Started");
        }

        onStop() {
            this.userContextMenuPatch();
            this.channelContextMenuPatch();
            this.gdmContextMenuPatch();
            Dispatcher.unsubscribe("MESSAGE_CREATE", this.onMessage);
            Patcher.unpatchAll();

            Logger.log("Stopped");
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(() => {
                settings = BdApi.loadData(config.info.name, `settings`);
            });
            return panel.getElement();
        }
    };
};
return plugin(Plugin, Api);})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/
