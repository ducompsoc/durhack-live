# DurHack Live Event Site

## Setup

All setup uses Node 18.
Start by using `ssh root@[ip]` and providing access token to connect to Scaleway.

Clone the repository. You will need to **[set up SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)** since `durhack-live` is a private repository.

```bash
mkdir -p /var/www/live.durhack.com
cd /var/www/live.durhack.com
git init
git remote add origin git@github.com:ducompsoc/durhack-live.git
git pull origin master
```

Alternatively, you can use a **[Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)** by providing your GitHub username and a PAT as your password
when prompted. 

```bash 
mkdir -p /var/www/live.durhack.com
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

### Database (Docker)

```bash
cd durhack-live/
docker rm durhack-mysql-container
mkdir data/
docker run --name durhack-mysql-container --env MYSQL_DATABASE=durhack --env MYSQL_ROOT_PASSWORD='strongexamplepassword' -p 3306:3306 -v /data:/var/lib/mysql -i mysql:8
```

#### Interacting via SQL

Connect via DataGrip, or by CLI:

```bash
sudo apt-get install mysql-client
docker exec -it durhack-mysql-container bash
bash-4.4# mysql -uroot -p
mysql> USE durhack;
mysql> show tables;
```

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
