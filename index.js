const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// ─── Role priority (highest → lowest) ───────────────────────────────────────
// The first matching role in this list wins
const ROLE_PREFIX_MAP = [
  { name: "[core]",        prefix: "[CORE]" },
  { name: "[ai-engineer]",      prefix: "[AI]"   },
  { name: "[frontend]",    prefix: "[FE]"   },
  { name: "[backend]",     prefix: "[BE]"   },
  { name: "[contributor]", prefix: "[CB]"   },
  { name: "[bot]",         prefix: "[BT]"   },
  { name: "[viewer]",      prefix: "[VW]"   },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strips any existing daemon[] prefix from a nickname/username
 * so we don't stack prefixes on re-assignment
 */
function stripPrefix(name) {
  return name.replace(/^\[.*?\]\s*/, "").trim();
}

/**
 * Finds the highest priority prefix for a member based on their roles
 * Returns null if no matching role found
 */
function getPrefix(member) {
  for (const { name, prefix } of ROLE_PREFIX_MAP) {
    const hasRole = member.roles.cache.some(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );
    if (hasRole) return prefix;
  }
  return null;
}

/**
 * Updates a member's nickname with the correct prefix
 */
async function updateNickname(member) {
  const prefix = getPrefix(member);
  const baseName = stripPrefix(member.nickname || member.user.username);
  const newNick = prefix ? `${prefix} ${baseName}` : baseName;
  const currentNick = member.nickname || member.user.username;

  // Skip if nothing changed
  if (currentNick === newNick) return;

  try {
    await member.setNickname(newNick);
    console.log(`[daemon] updated: ${member.user.tag} → ${newNick}`);
  } catch (err) {
    // Bot can't change the server owner's nickname — Discord limitation
    if (err.code === 50013) {
      console.warn(`[daemon] missing permissions to update: ${member.user.tag} (server owner?)`);
    } else {
      console.error(`[daemon] failed to update ${member.user.tag}:`, err.message);
    }
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

client.once(Events.ClientReady, async (c) => {
  console.log(`[daemon] online as ${c.user.tag}`);
  console.log(`[daemon] watching ${c.guilds.cache.size} server(s)`);
});

// Fires whenever a member's roles change
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const rolesChanged =
    oldMember.roles.cache.size !== newMember.roles.cache.size ||
    !oldMember.roles.cache.every((r) => newMember.roles.cache.has(r.id));

  if (rolesChanged) {
    await updateNickname(newMember);
  }
});

// Fires when a new member joins — assign prefix if they already have a role
client.on(Events.GuildMemberAdd, async (member) => {
  await updateNickname(member);
});

// ─── Login ───────────────────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
