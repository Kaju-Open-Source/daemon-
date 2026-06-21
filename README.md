# daemon[]

> it just changes nicknames. that's it. that's the bot.

a lightweight Discord bot that automatically prefixes member nicknames based on their assigned role. built for [kaju[oss]](https://github.com/Kaju-Open-Source).

---

## prefix map

| role | prefix |
|------|--------|
| `[core]` | [CORE] |
| `[ai-eng]` | [AI] |
| `[frontend]` | [FE] |
| `[backend]` | [BE] |
| `[contributor]` | [CB] |
| `[bot]` | [BT] |
| `[viewer]` | [VW] |

highest role wins — if someone has `[core]` and `[fe]`, they get `[CORE]`.

---

## setup

**1. clone & install**
```bash
git clone ttps://github.com/Kaju-Open-Source/daemon-.git
cd daemon
npm install
```

**2. create your bot**
- go to [discord.com/developers/applications](https://discord.com/developers/applications)
- create a new application → bot tab → add a bot
- under **Privileged Gateway Intents** enable **Server Members Intent**
- copy the token

**3. set up env**
```bash
cp .env.example .env
# open .env and paste your token — no quotes, no spaces
```

**4. invite to your server**

go to OAuth2 → URL Generator and select:
- scope: `bot`
- permission: `Manage Nicknames`

paste the generated URL in your browser and select your server.

> ⚠️ in your server's role list, drag daemon[]'s role **above** all the roles it manages — otherwise Discord blocks nickname changes.

**5. run**
```bash
node index.js
```

you should see:
```
[daemon] online as daemon[]#1234
[daemon] watching 1 server(s)
```

---

## keeping it alive with pm2

```bash
npm install -g pm2
pm2 start index.js --name "daemon"
pm2 save
pm2 startup
```

works on Linux (Ubuntu/Arch) or any cloud VM. daemon[] will restart automatically on reboot.

---

## known limitations

- **server owner** — Discord does not allow any bot to change the server owner's nickname. change yours manually.
- roles are matched **case-insensitively**
- if a member has no matching role, any existing prefix is stripped cleanly

---

## contributing

this is an open source project by kaju[oss]. PRs and issues are welcome — check out the open issues if you want to jump in.

---

*part of the kaju[oss] toolchain.*
