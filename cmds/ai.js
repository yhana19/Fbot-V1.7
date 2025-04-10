const axios = require("axios");

module.exports = {
    name: "ai",
    usePrefix: false,
    usage: "ai <your question> | <reply to an image>",
    version: "1.2",
    admin: false,
    cooldown: 2,

    execute: async ({ api, event, args }) => {
        try {
            const { threadID } = event;
            let prompt = args.join(" ");
            let imageUrl = null;
            let apiUrl = `https://autobot.mark-projects.site/api/gemini-2.5-pro-vison?ask=${encodeURIComponent(prompt)}`;

            if (event.messageReply && event.messageReply.attachments.length > 0) {
                const attachment = event.messageReply.attachments[0];
                if (attachment.type === "photo") {
                    imageUrl = attachment.url;
                    apiUrl += `&imagurl=${encodeURIComponent(imageUrl)}`;
                }
            }

            const loadingMsg = await api.sendMessage("🔎𝗖𝗿𝗲𝗱𝗲𝗻𝗰𝗲 𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗬𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻...", threadID);

            const response = await axios.get(apiUrl);
            const description = response?.data?.data?.description;

            if (description) {
                return api.sendMessage(`💬𝗬𝗼𝘂𝗿 𝗮𝘀𝘀𝗶𝘀𝘁𝗮𝗻𝘁 𝗖𝗿𝗲𝗱𝗲𝗻𝗰𝗲\n━━━━━━━━━━━━━━━━\n${description}\n━━━━━━━━━━━━━━━━`, threadID, loadingMsg.messageID);
            }

            return api.sendMessage("⚠️ No description found in response.", threadID, loadingMsg.messageID);
        } catch (error) {
            console.error("❌ Gemini Error:", error);
            return api.sendMessage("❌ Error while contacting Gemini API.", event.threadID);
        }
    }
};
