# Production Deployment Checklist ✅

Complete this checklist before deploying PharmaDSA to production.

## 🔐 Security

- [ ] **Change default user passwords**

  - Admin: admin / admin123 → **Change immediately!**
  - Pharmacist: pharmacist / pharma123 → **Change immediately!**
  - Viewer: viewer / view123 → **Change immediately!**

- [ ] **Set strong JWT_SECRET**

  - Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - Or: `openssl rand -hex 32`
  - Min 32 characters, completely random

- [ ] **Configure MongoDB Atlas**

  - Create production database
  - Set strong database user password
  - Configure IP whitelist (only your server IPs)
  - Enable backup automation
  - Set up monitoring alerts

- [ ] **Environment Variables**

  - Copy `.env.example` to `.env`
  - Update all production values
  - Never commit `.env` to version control
  - Set `NODE_ENV=production`

- [ ] **HTTPS/SSL**
  - Install SSL certificate (Let's Encrypt recommended)
  - Force HTTPS redirects
  - Update CORS_ORIGIN to production domain
  - Enable HSTS headers

## 🏗️ Build & Deploy

- [ ] **Build Frontend**

  ```bash
  cd server
  npm run build
  ```

  - Verify `client/dist/` folder created
  - Check for build errors
  - Test built files locally

- [ ] **Install Dependencies**

  ```bash
  cd server
  npm install --production
  ```

  - Only installs production dependencies
  - Reduces deployment size

- [ ] **Database Seeding**

  ```bash
  npm run seed
  ```

  - Run only once on fresh database
  - Creates initial users and sample data
  - **Remember to change passwords!**

- [ ] **Test Production Build Locally**
  ```bash
  NODE_ENV=production npm start
  ```
  - Visit http://localhost:5000
  - Test all features
  - Check browser console for errors
  - Verify API calls work

## 🚀 Deployment Platform

Choose one deployment option and complete its checklist:

### Option A: VPS/Cloud Server (DigitalOcean, AWS EC2, etc.)

- [ ] Server provisioned (Ubuntu 20.04+ recommended)
- [ ] Node.js v18+ installed
- [ ] PM2 installed globally: `npm install -g pm2`
- [ ] Nginx installed and configured
- [ ] Firewall configured (allow ports 80, 443)
- [ ] Domain DNS pointed to server IP
- [ ] SSL certificate installed (certbot)
- [ ] Application files uploaded to server
- [ ] Environment variables configured
- [ ] PM2 process started: `pm2 start server.js --name pharma-dsa`
- [ ] PM2 startup configured: `pm2 startup && pm2 save`
- [ ] Nginx reverse proxy configured
- [ ] Application accessible via domain

### Option B: Platform as a Service (Heroku, Railway, Render)

- [ ] Account created on platform
- [ ] New application created
- [ ] GitHub repository connected (optional)
- [ ] Environment variables set in dashboard
- [ ] Build command configured: `npm run build`
- [ ] Start command configured: `npm start`
- [ ] Domain configured (if custom)
- [ ] Application deployed successfully
- [ ] Application accessible via URL

### Option C: Docker Container

- [ ] Dockerfile created
- [ ] Docker image built
- [ ] Docker image tested locally
- [ ] Image pushed to registry (Docker Hub, etc.)
- [ ] Container deployed to hosting platform
- [ ] Environment variables configured
- [ ] Persistent volume mounted (if needed)
- [ ] Application accessible

## 🧪 Testing

- [ ] **Functional Testing**

  - Login with all three roles works
  - Dashboard loads and shows stats
  - Inventory management works
  - Queue operations work
  - Prescription dispensing works
  - Audit history displays
  - DSA modals open and display correctly

- [ ] **API Testing**

  - All endpoints respond correctly
  - Authentication works
  - Authorization (RBAC) enforced
  - Error responses are appropriate
  - Rate limiting works (if enabled)

- [ ] **Performance Testing**

  - Page load times acceptable
  - API response times fast
  - Database queries optimized
  - No memory leaks
  - Handles concurrent users

- [ ] **Security Testing**

  - SQL injection protection (N/A - using MongoDB)
  - XSS protection enabled
  - CSRF protection (if needed)
  - JWT tokens secure
  - Passwords hashed
  - HTTPS enforced

- [ ] **Browser Testing**

  - Chrome/Edge - works
  - Firefox - works
  - Safari - works
  - Mobile browsers - works

- [ ] **Mobile Responsiveness**
  - Layout adapts to mobile
  - Touch interactions work
  - Text readable without zooming
  - No horizontal scroll

## 📊 Monitoring & Maintenance

- [ ] **Error Monitoring**

  - Error tracking service set up (Sentry, etc.)
  - Alerts configured for critical errors
  - Error logs accessible

- [ ] **Uptime Monitoring**

  - Uptime monitoring service configured (UptimeRobot, etc.)
  - Alerts for downtime
  - Response time tracking

- [ ] **Database Backups**

  - Automated backups enabled
  - Backup retention policy set
  - Restore process tested
  - Backup alerts configured

- [ ] **Performance Monitoring**

  - APM tool configured (New Relic, etc.)
  - Key metrics tracked
  - Performance alerts set up

- [ ] **Log Management**
  - Log rotation configured
  - Logs accessible for debugging
  - Log retention policy set

## 📖 Documentation

- [ ] **Update Documentation**

  - Production URL in README.md
  - Deployment instructions accurate
  - Environment variables documented
  - API documentation current

- [ ] **User Documentation**
  - User guide accessible
  - Login credentials documented (for initial setup)
  - Help resources available
  - Contact information provided

## 🎯 Post-Deployment

- [ ] **Verify Production Access**

  - Application accessible via production URL
  - All pages load correctly
  - No console errors
  - HTTPS working

- [ ] **Create Admin Account**

  - Login with default admin
  - Change admin password
  - Create production admin user (optional)
  - Disable or delete default users (optional)

- [ ] **Announce Launch**

  - Notify stakeholders
  - Share access instructions
  - Provide user documentation
  - Set up support channels

- [ ] **Monitor Initial Usage**
  - Watch error logs
  - Monitor performance
  - Collect user feedback
  - Fix critical issues quickly

## 🔄 Ongoing Maintenance

- [ ] **Regular Updates**

  - Keep dependencies updated
  - Apply security patches
  - Update documentation
  - Improve based on feedback

- [ ] **Security Audits**

  - Run `npm audit` regularly
  - Fix security vulnerabilities
  - Review access logs
  - Update passwords periodically

- [ ] **Performance Optimization**

  - Monitor database performance
  - Optimize slow queries
  - Review server resources
  - Scale as needed

- [ ] **Backup Verification**
  - Test restores monthly
  - Verify backup integrity
  - Update backup strategy
  - Document restore procedures

## ✅ Final Verification

Before marking deployment complete:

- [ ] Application is live and accessible
- [ ] All default passwords changed
- [ ] Environment properly configured
- [ ] Monitoring and alerts active
- [ ] Backups automated and tested
- [ ] Documentation updated
- [ ] Team/users notified
- [ ] Support plan in place

---

## 🆘 Emergency Contacts

**Database Issues:**

- MongoDB Atlas Support: https://support.mongodb.com

**Server Issues:**

- Platform support (check your hosting provider)

**Application Issues:**

- Check logs: `pm2 logs pharma-dsa` (if using PM2)
- Review error monitoring dashboard
- Check MongoDB Atlas metrics

## 📞 Support Resources

- **Documentation**: `/docs` folder
- **User Guide**: `/docs/USER_GUIDE.md`
- **Deployment Guide**: `/docs/PRODUCTION_DEPLOYMENT.md`
- **System Flow**: `/docs/SYSTEM_FLOW_DOCUMENTATION.md`

---

**Deployment Date**: ******\_\_\_******
**Deployed By**: ******\_\_\_******
**Production URL**: ******\_\_\_******
**MongoDB Cluster**: ******\_\_\_******

**Status**: ⬜ Ready for Deployment | ⬜ Deployment Complete | ⬜ Production Verified
