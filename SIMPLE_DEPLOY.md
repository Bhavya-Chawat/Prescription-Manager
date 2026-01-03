# 🎯 Simple Deployment Guide - Vercel

**Deploy your Prescription Manager to Vercel (frontend + backend). ~20 minutes.**

⚠️ **IMPORTANT:** This guide uses **Vercel ONLY** (NOT Railway, NOT Netlify). We no longer use `deploy-setup.ps1` - follow this guide exactly.

---

## 📺 What You'll Do

1. **Setup MongoDB** - Cloud database (10 mins)
2. **Deploy to Vercel** - Full-stack app (frontend + backend together) (10 mins)
3. **Seed Database** - Add demo data (2 mins)
4. **Done!** 🎉

---

## 🚀 Step-by-Step Instructions

### STEP 1: Setup MongoDB Atlas (Your Database)

1. **Go to** https://www.mongodb.com/cloud/atlas
2. **Click** "Try Free"
3. **Sign up** with Google or Email
4. **Create a database:**
   - Click **"Build a Database"**
   - Choose **"M0 FREE"** (the free one)
   - Click **"Create"**
5. **Create a database user:**

   - You'll see a popup asking for username/password
   - Username: `pharma_admin` (or anything you want)
   - Click **"Autogenerate Secure Password"**
   - **COPY THE PASSWORD AND SAVE IT SOMEWHERE!**
   - Click **"Create User"**

6. **Allow access:**

   - You'll see "Where would you like to connect from?"
   - Click **"Add My Current IP Address"**
   - Then also click **"Add IP Address"** manually
   - Enter: `0.0.0.0/0`
   - Click **"Add Entry"** → **"Finish and Close"**

7. **Get your connection string:**
   - Click **"Connect"** on your database
   - Choose **"Connect your application"**
   - Copy the connection string (looks like: `mongodb+srv://pharma_admin:...`)
   - **SAVE THIS!**

**✅ MongoDB Setup Done!**

---

### STEP 2: Push to GitHub

1. **Make sure you have a GitHub account** (create one at github.com)

2. **Create a new repository:**

   - Go to github.com
   - Click the **"+"** button (top right)
   - Choose **"New repository"**
   - Name it: `prescription-manager`
   - Click **"Create repository"**

3. **Push your code:**
   ```powershell
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/prescription-manager.git
   git push -u origin main
   ```
   _(Replace YOUR_USERNAME with your GitHub username)_

**✅ Code on GitHub!**

---

### STEP 3: Deploy Full-Stack App (Vercel)

**This deploys both frontend and backend together!**

1. **Go to** https://vercel.com
2. **Click** "Sign Up" → Choose "GitHub"
3. **Authorize Vercel** to access your GitHub

4. **Import your project:**

   - Click **"New Project"**
   - Find and select your `prescription-manager` repo
   - Click **"Import"**

5. **Configure deployment:**

   - Framework: Choose **"Other"**
   - Root Directory: Click **"Edit"** → Set to `server`
   - Build Command: `npm run build` (this builds both frontend and backend)
   - Output Directory: Leave empty
   - Install Command: `npm install`
   - Click **"Continue"**

6. **Add environment variables:**

   - Click **"Add Another"** for each:

   **Required variables:**

   - `MONGODB_URI`: `mongodb+srv://pharma_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prescription_manager?retryWrites=true&w=majority`
     - Replace `YOUR_PASSWORD` with your MongoDB password
     - Replace `/prescription_manager` if you named it differently
   - `JWT_SECRET`: Generate a secure key (see below)
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `CLIENT_URL`: `https://your-app.vercel.app` (add this after deployment)

   **Generate JWT_SECRET:**

   ```powershell
   # In PowerShell
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
   ```

   Or use: https://randomkeygen.com/

7. **Deploy:**

   - Click **"Deploy"**
   - Wait 3-5 minutes (it builds both frontend and backend)

8. **Get your app URL:**

   - Copy the URL (e.g., `https://prescription-manager.vercel.app`)
   - **SAVE IT!**

9. **Update CLIENT_URL:**
   - Go to **Settings** → **Environment Variables**
   - Find `CLIENT_URL`
   - Update value to your actual Vercel URL
   - Click **"Save"**
   - Go to **Deployments** → Click **"..."** → **"Redeploy"**

**✅ Full App Deployed!**

---

### STEP 4: Seed Your Database (REQUIRED FOR DEMO)

This adds dummy data so you can test the app immediately:

**What gets seeded:**

- ✅ 3 test users (admin, pharmacist, viewer)
- ✅ 8 medicines with pricing
- ✅ Multiple medicine batches with stock quantities
- ✅ 3 suppliers
- ✅ 5 sample patients

**For a teacher demo, you MUST seed the database!**

1. **Open PowerShell** in your project folder
2. **Navigate to server:**
   ```powershell
   cd server
   ```
3. **Install dependencies (if not already done):**
   ```powershell
   npm install
   ```
4. **Set MongoDB connection string:**
   ```powershell
   $env:MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
   ```
   _(Replace with your connection string from Step 1)_
5. **Run seed:**
   ```powershell
   npm run seed
   ```
   You should see: ✅ Users seeded, ✅ Medicines seeded, etc.

**✅ Database Seeded! App is ready to demo!**

---

## 🎉 DONE! Test Your App

1. **Visit your Vercel URL** (e.g., `https://prescription-manager.vercel.app`)
2. **Login with dummy credentials from seeding:**
   - Username: `admin` → Password: `admin123` (Admin role)
   - Username: `pharmacist` → Password: `pharma123` (Pharmacist role)
   - Username: `viewer` → Password: `view123` (Viewer role)
3. **You'll see:**
   - Full inventory with 8 medicines
   - Multiple batches for each medicine
   - 5 sample patients
   - Everything ready for demo!

---

## 🆘 Troubleshooting

### "Failed to fetch" or "Network Error"

- Check `VITE_API_URL` matches your backend URL
- Check `CLIENT_URL` is set on backend
- Wait 2-3 minutes for Vercel to redeploy

### "Cannot connect to database"

- Check MongoDB connection string is correct
- Ensure `0.0.0.0/0` is added to Network Access in MongoDB Atlas

### "Login failed"

- Make sure you ran the seed script (Step 6)
- Try username: `admin`, password: `admin123`

---

## 📝 Quick Reference

**Platforms:**

- MongoDB Atlas: https://cloud.mongodb.com
- Vercel Dashboard: https://vercel.com/dashboard

**Your URLs:**

- Backend + Frontend (same URL): `https://your-app.vercel.app`

**Default Login:**

- Username: `admin`
- Password: `admin123` (change after first login!)

---

## 💰 Costs

- **MongoDB Atlas**: FREE forever (512 MB storage)
- **Vercel**: FREE tier (includes both frontend & backend hosting)
- **Total**: FREE!

---

## 🔐 Security

1. **Change admin password** after first login!
2. **Never share** MongoDB connection string
3. **Never commit** `.env` files to GitHub
4. **Keep accounts** secure

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
