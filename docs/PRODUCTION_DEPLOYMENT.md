# Production Deployment Guide

## Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (free tier works)
- Domain name (optional)
- SSL certificate (for HTTPS)

## Environment Setup

### 1. MongoDB Atlas Configuration

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier available)
3. Create database user with read/write permissions
4. Whitelist IP addresses (0.0.0.0/0 for all IPs, or specific IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/pharma_dsa`

### 2. Server Environment Variables

Create `.env` file in `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/pharma_dsa?retryWrites=true&w=majority

# JWT Secret (generate strong random string)
JWT_SECRET=your-super-secure-random-string-min-32-chars

# CORS (your frontend domain)
CLIENT_URL=https://yourdomain.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Generate JWT Secret:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### 3. Client Environment Variables

Create `.env` file in `client/` directory:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_ENV=production
```

## Build for Production

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install --production

# Install client dependencies
cd ../client
npm install
```

### 2. Build Client

```bash
cd client
npm run build
```

This creates optimized production build in `client/dist/`

### 3. Test Production Build Locally

```bash
# From server directory
npm start
```

Visit `http://localhost:5000` - server will serve the built client

## Deployment Options

### Option 1: Single Server Deployment (Recommended for small scale)

Deploy both frontend and backend on same server:

1. **Copy files to server:**

```bash
# Upload these directories to your server
- server/
- client/dist/
- package.json (root)
```

2. **On server, install dependencies:**

```bash
cd server
npm install --production
```

3. **Start with PM2 (process manager):**

```bash
# Install PM2 globally
npm install -g pm2

# Start application
cd server
pm2 start server.js --name pharma-dsa

# Enable startup on boot
pm2 startup
pm2 save
```

4. **Setup Nginx reverse proxy:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

5. **Enable HTTPS with Let's Encrypt:**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Separate Frontend/Backend Deployment

**Backend (API Server):**

- Deploy to Heroku, Railway, Render, or DigitalOcean
- Set environment variables in platform dashboard
- Deploy from `server/` directory

**Frontend (Static Site):**

- Deploy `client/dist/` to Vercel, Netlify, or Cloudflare Pages
- Update `VITE_API_URL` to point to backend URL
- Rebuild client after changing env vars

### Option 3: Cloud Platform Deployment

#### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create pharma-dsa

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

#### Railway.app

1. Connect GitHub repository
2. Add environment variables in dashboard
3. Railway auto-deploys on git push

#### Render.com

1. Create new Web Service
2. Connect GitHub repository
3. Build command: `cd server && npm install && cd ../client && npm install && npm run build`
4. Start command: `cd server && npm start`
5. Add environment variables in dashboard

## Post-Deployment Checklist

### Security

- [ ] All environment variables set correctly
- [ ] JWT_SECRET is strong random string (32+ characters)
- [ ] MongoDB connection string secured
- [ ] CORS configured to allow only your domains
- [ ] HTTPS enabled (SSL certificate installed)
- [ ] Rate limiting enabled
- [ ] Default admin password changed
- [ ] Security headers configured (helmet.js)

### Performance

- [ ] Client built in production mode
- [ ] Static assets have cache headers
- [ ] Database indexes created
- [ ] MongoDB connection pooling configured
- [ ] Gzip compression enabled

### Monitoring

- [ ] Error logging configured (e.g., Sentry)
- [ ] Uptime monitoring enabled (e.g., UptimeRobot)
- [ ] Performance monitoring (e.g., New Relic)
- [ ] Database backups scheduled

### Testing

- [ ] All API endpoints working
- [ ] Authentication flow tested
- [ ] Role-based permissions verified
- [ ] Mobile responsiveness checked
- [ ] Cross-browser compatibility tested

## Initial Data Setup

### 1. Seed Database (Optional)

```bash
# From server directory
npm run seed
```

This creates:

- Default users (admin, pharmacist, viewer)
- Sample medicines
- Sample batches
- Initial audit logs

### 2. Change Default Passwords

**IMPORTANT**: After first deployment, login and change default passwords:

```
Admin: admin / admin123 → Change immediately!
Pharmacist: pharmacist / pharma123 → Change immediately!
Viewer: viewer / view123 → Change immediately!
```

## Backup Strategy

### MongoDB Atlas Backups

- Enable automated backups in Atlas dashboard
- Retention: 7 days minimum
- Test restore process monthly

### Manual Backup

```bash
# Backup database
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/pharma_dsa" --out=backup

# Restore database
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/pharma_dsa" backup/pharma_dsa
```

## Scaling Considerations

### Database

- Monitor connection pool usage
- Add indexes for frequently queried fields
- Consider read replicas for high traffic
- Upgrade to dedicated cluster if needed

### Application

- Use PM2 cluster mode for multi-core utilization:

```bash
pm2 start server.js -i max
```

- Add load balancer for multiple servers
- Implement caching (Redis) for frequent queries
- Use CDN for static assets

## Troubleshooting

### Server won't start

```bash
# Check logs
pm2 logs pharma-dsa

# Check environment variables
pm2 env 0

# Restart server
pm2 restart pharma-dsa
```

### Database connection fails

- Verify MongoDB URI format
- Check IP whitelist in Atlas
- Test connection with MongoDB Compass
- Ensure database user has correct permissions

### 404 on page refresh

Configure server to serve `index.html` for all routes:

```javascript
// In server.js
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
```

## Maintenance

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Rebuild client after updates
cd client && npm run build
```

### Monitoring

```bash
# View logs
pm2 logs

# Check status
pm2 status

# Monitor resources
pm2 monit
```

## Support

For issues or questions:

- Check documentation in `/docs` folder
- Review error logs
- Test in development environment first

---

**Production Status**: Ready for deployment
**Last Updated**: January 2026
