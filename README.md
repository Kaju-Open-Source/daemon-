# daemon[]

> quietly runs in the background. manages nicknames so you don't have to.

daemon[] is a lightweight Discord bot for kaju[oss] that automatically prefixes member nicknames based on their assigned role.

---

## prefix map

| role          | prefix   |
|---------------|----------|
| `core`        | [core]   |
| `ai-eng`      | [ai]     |
| `frontend`    | [fe]     |
| `backend`     | [be]     |
| `contributor` | [cb]     |
| `enthusiast`  | [en]     |
| `viewer`      | [vw]     |

highest role wins. if someone is `core` and `fe`, they get `[core]`.

---

## setup

**1. clone & install**
```bash
git clone <your-repo>
cd daemon
npm install
```

**2. create your bot**
- go to https://discord.com/developers/applications
- create a new application → add a bot
- copy the token

**3. set up env**
```bash
cp .env.example .env
# paste your token into .env
```

**4. invite the bot to your server**

generate an invite URL with these permissions:
- `Manage Nicknames`
- `View Channels`

and these scopes:
- `bot`
- `applications.commands`

> ⚠️ daemon[] must have a role **higher** than the roles it manages in your server's role list, otherwise Discord won't let it change nicknames.

**5. run it**
```bash
node index.js
```

---

## running on oracle cloud (recommended)

```bash
# install node on your VM
sudo apt update && sudo apt install -y nodejs npm

# clone and set up
git clone <your-repo>
cd daemon
npm install
cp .env.example .env
nano .env  # paste your token

# run with pm2 so it stays alive
npm install -g pm2
pm2 start index.js --name "daemon"
pm2 save
pm2 startup
```

---

## notes

- the bot **cannot** change the server owner's nickname — Discord limitation
- roles are matched case-insensitively
- if a member has no matching role, any existing prefix is stripped cleanly
