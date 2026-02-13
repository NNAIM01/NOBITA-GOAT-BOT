<<<<<<< HEAD
const axios = require("axios");

const BASE_CONFIG_URL =
  "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json";

const getBaseApis = async () => {
  const res = await axios.get(BASE_CONFIG_URL);
  return res.data;
};

module.exports = {
  config: {
    name: "spy",
    aliases: ["whoishe", "whoisshe", "whoami", "atake"],
    version: "1.4",
    role: 0,
    author: "Dipto | Modded by MAHBUB ULLASH",
    description: "Get user information and profile photo",
    category: "information",
    countDown: 10,
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    try {
      const senderUID = event.senderID;
      const mentionUID = Object.keys(event.mentions || {})[0];
      let uid;

      if (args[0]) {
        if (/^\d+$/.test(args[0])) {
          uid = args[0];
        } else {
          const match = args[0].match(/profile\.php\?id=(\d+)/);
          if (match) uid = match[1];
        }
      }

      if (!uid) {
        uid =
          event.type === "message_reply"
            ? event.messageReply.senderID
            : mentionUID || senderUID;
      }

      const baseApis = await getBaseApis();
      const simBase = baseApis.simsimi;
      const bankBase = baseApis.bank;

      let teachCount = 0;

      try {
        const t = await axios.get(`${simBase}/baby?cmd=top-t&arg=${uid}`);
        if (t.data && t.data.code === 200) {
          const msg = String(t.data.message || "");
          const allNums = msg.match(/\d+/g) || [];

          const filtered = allNums.filter((n) => n !== String(uid));

          if (filtered.length > 0) {
            teachCount = Number(filtered[filtered.length - 1]);
          } else {
            teachCount = 0;
          }
        } else {
          teachCount = 0;
        }
      } catch (e) {
        console.error("Teach API error:", e.message || e);
        teachCount = 0;
      }

      let money = 0;

      try {
        const b = await axios.get(`${bankBase}/users/${uid}`);
        if (b.data && !b.data.error) {
          money = b.data.money || 0;
        } else {
          const local = await usersData.get(uid);
          money = (local && local.money) || 0;
        }
      } catch (err) {
        console.error("Bank API error:", err.message || err);
        const local = await usersData.get(uid);
        money = (local && local.money) || 0;
      }

      const userInfo = await api.getUserInfo(uid);

      // ✅ FIXED AVATAR SYSTEM (Graph API like your working pp/profile)
      const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      let genderText;
      switch (userInfo[uid].gender) {
        case 1:
          genderText = "𝙶𝚒𝚛𝚕🙋🏻‍♀️";
          break;
        case 2:
          genderText = "Boy🙋🏻‍♂️";
          break;
        default:
          genderText = "𝙶𝚊𝚢🤷🏻‍♂️";
      }

      const allUser = (await usersData.getAll()) || [];
      const totalUsers = allUser.length || 1;

      let rankStr = `N/A/${totalUsers}`;
      if (allUser.length > 0) {
        const expSorted = allUser
          .slice()
          .sort((a, b) => (b.exp || 0) - (a.exp || 0));

        const idx = expSorted.findIndex(
          (u) => String(u.userID) === String(uid)
        );

        if (idx !== -1) {
          rankStr = `#${idx + 1}/${totalUsers}`;
        }
      }

      let moneyRankStr = `N/A/${totalUsers}`;
      if (allUser.length > 0) {
        const moneySorted = allUser
          .slice()
          .sort((a, b) => (b.money || 0) - (a.money || 0));

        const mIdx = moneySorted.findIndex(
          (u) => String(u.userID) === String(uid)
        );

        if (mIdx !== -1) {
          moneyRankStr = `#${mIdx + 1}/${totalUsers}`;
        }
      }

      const position = userInfo[uid].type
        ? userInfo[uid].type.toUpperCase()
        : "𝙽𝚘𝚛𝚖𝚊𝚕 𝚄𝚜𝚎𝚛";

      const userInformation = `
╭────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]
├‣ 𝙽𝚊𝚖𝚎: ${userInfo[uid].name}
├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}
├‣ 𝚄𝙸𝙳: ${uid}
├‣ 𝙲𝚕𝚊𝚜𝚜: ${position}
├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${userInfo[uid].vanity || "𝙽𝚘𝚗𝚎"}
├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${userInfo[uid].profileUrl}
├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${
        userInfo[uid].isBirthday !== false
          ? userInfo[uid].isBirthday
          : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"
      }
├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}
╰‣ 𝙵𝚛𝚒𝚎𝚗𝚍 𝚠𝚒𝚝𝚑 𝚋𝚘𝚝: ${
        userInfo[uid].isFriend ? "𝚈𝚎𝚜✅" : "𝙽𝚘❎"
      }

╭─────[ 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 ]
├‣ 𝙼𝚘𝚗𝚎𝚢: ${formatMoney(money)}$
├‣ 𝚁𝚊𝚗𝚔: ${rankStr}
├‣ 𝙼𝚘𝚗𝚎𝚢 𝚁𝚊𝚗𝚔: ${moneyRankStr}
╰‣ 𝙱𝚊𝚋𝚢 𝚝𝚎𝚊𝚌𝚑: ${teachCount}
`;

      return message.reply({
        body: userInformation,
        attachment: await global.utils.getStreamFromURL(avatarUrl),
      });
    } catch (err) {
      console.error("Spy Command Error:", err);
      return message.reply("⚠️ spy কমান্ড চলাতে সমস্যা হয়েছে।");
    }
  },
};

function formatMoney(num) {
  if (isNaN(num)) return num;

  const units = ["", "K", "M", "B", "T", "Q"];
  let unit = 0;

  while (Math.abs(num) >= 1000 && unit < units.length - 1) {
    num /= 1000;
    unit++;
  }

  return num.toFixed(2).replace(/\.00$/, "") + units[unit];
}
=======
const axios = require("axios");

const BASE_CONFIG_URL =
  "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json";

const getBaseApis = async () => {
  const res = await axios.get(BASE_CONFIG_URL);
  return res.data;
};

module.exports = {
  config: {
    name: "spy",
    aliases: ["whoishe", "whoisshe", "whoami", "atake"],
    version: "1.4",
    role: 0,
    author: "Dipto | Modded by MAHBUB ULLASH",
    description: "Get user information and profile photo",
    category: "information",
    countDown: 10,
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    try {
      const senderUID = event.senderID;
      const mentionUID = Object.keys(event.mentions || {})[0];
      let uid;

      if (args[0]) {
        if (/^\d+$/.test(args[0])) {
          uid = args[0];
        } else {
          const match = args[0].match(/profile\.php\?id=(\d+)/);
          if (match) uid = match[1];
        }
      }

      if (!uid) {
        uid =
          event.type === "message_reply"
            ? event.messageReply.senderID
            : mentionUID || senderUID;
      }

      const baseApis = await getBaseApis();
      const simBase = baseApis.simsimi;

      // ===== Baby Teach (unchanged) =====
      let teachCount = 0;

      try {
        const t = await axios.get(`${simBase}/baby?cmd=top-t&arg=${uid}`);
        if (t.data && t.data.code === 200) {
          const msg = String(t.data.message || "");
          const allNums = msg.match(/\d+/g) || [];
          const filtered = allNums.filter((n) => n !== String(uid));
          teachCount = filtered.length > 0 ? Number(filtered.pop()) : 0;
        }
      } catch (e) {
        teachCount = 0;
      }

      // ===== ✅ GoatBot DB Money System =====
      const localData = await usersData.get(uid);
      const money = (localData && localData.money) || 0;

      const userInfo = await api.getUserInfo(uid);

      const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      let genderText;
      switch (userInfo[uid].gender) {
        case 1:
          genderText = "𝙶𝚒𝚛𝚕🙋🏻‍♀️";
          break;
        case 2:
          genderText = "Boy🙋🏻‍♂️";
          break;
        default:
          genderText = "𝙶𝚊𝚢🤷🏻‍♂️";
      }

      const allUser = (await usersData.getAll()) || [];
      const totalUsers = allUser.length || 1;

      // ===== EXP Rank =====
      let rankStr = `N/A/${totalUsers}`;
      if (allUser.length > 0) {
        const expSorted = allUser
          .slice()
          .sort((a, b) => (b.exp || 0) - (a.exp || 0));

        const idx = expSorted.findIndex(
          (u) => String(u.userID) === String(uid)
        );

        if (idx !== -1) rankStr = `#${idx + 1}/${totalUsers}`;
      }

      // ===== Money Rank (DB based) =====
      let moneyRankStr = `N/A/${totalUsers}`;
      if (allUser.length > 0) {
        const moneySorted = allUser
          .slice()
          .sort((a, b) => (b.money || 0) - (a.money || 0));

        const mIdx = moneySorted.findIndex(
          (u) => String(u.userID) === String(uid)
        );

        if (mIdx !== -1) moneyRankStr = `#${mIdx + 1}/${totalUsers}`;
      }

      const position = userInfo[uid].type
        ? userInfo[uid].type.toUpperCase()
        : "𝙽𝚘𝚛𝚖𝚊𝚕 𝚄𝚜𝚎𝚛";

      const userInformation = `
╭────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]
├‣ 𝙽𝚊𝚖𝚎: ${userInfo[uid].name}
├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}
├‣ 𝚄𝙸𝙳: ${uid}
├‣ 𝙲𝚕𝚊𝚜𝚜: ${position}
├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${userInfo[uid].vanity || "𝙽𝚘𝚗𝚎"}
├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${userInfo[uid].profileUrl}
├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${
        userInfo[uid].isBirthday !== false
          ? userInfo[uid].isBirthday
          : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"
      }
├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}
╰‣ 𝙵𝚛𝚒𝚎𝚗𝚍 𝚠𝚒𝚝𝚑 𝚋𝚘𝚝: ${
        userInfo[uid].isFriend ? "𝚈𝚎𝚜✅" : "𝙽𝚘❎"
      }

╭─────[ 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 ]
├‣ 𝙼𝚘𝚗𝚎𝚢: ${formatMoney(money)}$
├‣ 𝚁𝚊𝚗𝚔: ${rankStr}
├‣ 𝙼𝚘𝚗𝚎𝚢 𝚁𝚊𝚗𝚔: ${moneyRankStr}
╰‣ 𝙱𝚊𝚋𝚢 𝚝𝚎𝚊𝚌𝚑: ${teachCount}
`;

      return message.reply({
        body: userInformation,
        attachment: await global.utils.getStreamFromURL(avatarUrl),
      });
    } catch (err) {
      console.error("Spy Command Error:", err);
      return message.reply("⚠️ spy কমান্ড চলাতে সমস্যা হয়েছে।");
    }
  },
};

function formatMoney(num) {
  if (isNaN(num)) return num;

  const units = ["", "K", "M", "B", "T", "Q"];
  let unit = 0;

  while (Math.abs(num) >= 1000 && unit < units.length - 1) {
    num /= 1000;
    unit++;
  }

  return num.toFixed(2).replace(/\.00$/, "") + units[unit];
}
>>>>>>> ad24205 (Updated cmds files)
