# DurHack Live Event Site

## Setup

Start by using `ssh root@[ip]` and providing access token to connect to Scaleway.

### Install dependencies

1) `apt` dependencies:
   ```bash
   sudo apt-get update
   sudo apt-get install curl tmux ca-certificates gnupg snapd git-all
   ```
2) NVM (node version manager):
   ```bash
   curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
   source ~/.bashrc
   ```
3) Node:
   ```bash
   nvm install 18
   nvm use 18
   ```
4) MySQL
   ```bash
   sudo apt-get install mysql-client=8.0* mysql-server=8.0*
   ```
5) Nginx
   ```bash
   sudo apt-get install nginx
   ``` 
6) Certbot
   ```bash
   sudo snap install --classic certbot
   sudo ln -s /snap/bin/certbot /usr/bin/certbot
   ```

### Clone the repository

You will need to **[set up SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)**\
since `durhack-live` is a private repository.

```bash
sudo mkdir -p /var/www/live.durhack.com
sudo chmod -R 766 /var/www/live.durhack.com 
cd /var/www/live.durhack.com
git init
git remote add origin git@github.com:ducompsoc/durhack-live.git
git pull origin master
```

Alternatively, you can use a **[Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)** 
by providing your GitHub username and a PAT as your password
when prompted. 

```bash 
mkdir -p /var/www/live.durhack.com
sudo chmod -R 766 /var/www/live.durhack.com 
cd /var/www/live.durhack.com
git init 
git remote add origin https://github.com/ducompsoc/durhack-live
git pull origin master
Username: YOUR_USERNAME
Password: YOUR_PERSONAL_ACCESS_TOKEN
```

### Client 

1) `cd client`
2) `npm install`
3) `npm run build`

### Database

First, set a password for `root` so that `mysql_secure_installation` will succeed.
```bash
sudo systemctl start mysql.service
sudo mysql
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH 'caching_sha2_password' BY 'new-root-password';
mysql> exit
```

Use the secure installation script.
```bash
sudo mysql_secure_installation
```

Reset `root`'s authentication plugin so that `sudo mysql` will log in as root.
```bash
mysql -u root -p
Enter password for 'root'@'localhost': *
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH auth_socket;
```

Create databases, and a user for those databases.
```bash
mysql> CREATE DATABASE `durhack-live`;
mysql> CREATE DATABASE `durhack-live-session`;
mysql> CREATE USER 'durhack'@'localhost' IDENTIFIED WITH 'caching_sha2_password' BY 'the-best-durhack-password'; 
mysql> GRANT ALL PRIVILEGES ON `durhack-live`.* TO 'durhack'@'localhost';
mysql> GRANT ALL PRIVILEGES ON `durhack-live-session`.* TO 'durhack'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> exit
```

#### Interacting via SQL

Use DataGrip to connect via `durhack` user, or by CLI:

```bash
sudo mysql
mysql> USE durhack-live;
mysql> show tables;
```

#### Export data for Hackathons UK

Use DataGrip to connect via `durhack` user.
- Timestamps `/` -> `-`
- Convert to `YYYY-MM-DD HH:MM:SS` datetime (use ' at start of field to prevent auto conversion)
- "I accept" -> 1
- "I don't accept" -> 0
- Reorder columns to: 
  - email
  - blank
  - full name
  - preferred name
  - blank * 5
  - age
  - phone
  - uni
  - grad year
  - ethnicity
  - gender
  - Hackathons UK - Data Sharing Consent,
  - Hackathons UK - Event Logistics Information Consent
  - timestamp
- Delete first header row
- add additional updatedAt default - `2022-11-19 09:00:00`

### Server

1) `cd server`
2) `npm install`
3) Setup config. Add a file `config/local.json` that overwrites keys from `config/default.json`
   1) Use `openssl rand -base64 48` to generate cryptographically strong secrets, place them into 
      appropriate config keys, specifically
      - `csrf.secret`
      - `cookie-parser.secret`
      - (do not overwrite `jsonwebtoken` secret - production uses RSA by default)
      - `session.secret`
      - `hackathonStateSocket.secret`
   2) Configure databases. Add suitable login information and database names to `mysql.data` and `mysql.session`
   3) Add API keys and secrets from other applications
      - MailGun -> `mailgun.key`
      - Discord -> `discord.clientId` and `discord.clientSecret`
4) `npm run build`

### Nginx

Create a file in `/etc/nginx/sites-available` called `live.durhack.com`.

```
server {
    server_name live.durhack.com www.live.durhack.com;
    
    location /api {
        proxy_pass http://127.0.0.1:3001$request_uri;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /socket.io {
        proxy_pass http://127.0.0.1:3001$request_uri;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://127.0.0.1:3000$request_uri;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    listen [::]:80 ipv6only=on;
    listen 80;
}
```

Enable the site by symlinking it to `/etc/nginx/sites-enabled`:
```bash
ln -s /etc/nginx/sites-available/live.durhack.com /etc/nginx/sites-enabled/
```

Reload nginx:
```bash
sudo systemctl reload nginx
```

### Firewall
[todo]

### SSL (HTTPS)
Configure the firewall and check its status:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw delete 'Nginx HTTP'
sudo ufw status
```

Use Certbot to set up SSL on our nginx configuration:
```bash
sudo certbot --nginx -d live.durhack.com -d www.live.durhack.com
```
Follow Certbot's instructions to verify we own the `durhack.com` domain through Let's Encrypt.\
Make sure to choose `2: Redirect` when prompted to specify how to handle insecure HTTP traffic.

Certbot will then auto-reload nginx. 

Verify auto-renewal works correctly (check command completes with no errors):
```bash
sudo certbot renew --dry-run
```

## Starting 

1) Start Docker: `docker start durhack-mysql-container -i`
2) Start server in `tmux` window: `cd server`, `npm start`
3) Start client in `tmux` window: `cd client`, `npm start`
