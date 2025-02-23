# 🚀 Decentralized Insurance Claim System

This project is a **decentralized insurance claim system** that allows users to buy insurance policies, contribute HBAR, and claim insurance using **Hedera Hashgraph**. The system ensures **secure transactions, claim tracking, and policy management** using **Node.js, Express, MongoDB, and Hedera SDK**.

---

## 🌟 Features

✅ **User Account Management** - Create user profiles and store wallet details  
✅ **Insurance Policies** - Buy policies with predefined sum insured, premium, and validity  
✅ **HBAR Transactions** - Transfer HBAR using Hedera SDK for contributions & claims  
✅ **Claim Tracking** - Maintain a record of claimed amounts and prevent over-claims  
✅ **Automatic Status Updates** - Policies expire or complete upon reaching claim limits  
✅ **Secure & Decentralized** - Powered by Hedera for fast & secure transactions

---

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Blockchain:** Hedera Hashgraph SDK
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** AWS EC2, Docker (optional)

---

## 📂 Project Structure

```plaintext
📦 backend
 ┣ 📂 controllers
 ┃ ┣ 📜 userController.js       # Handles user transactions & claims
 ┣ 📂 models
 ┃ ┣ 📜 User.js                 # User schema with wallet & policies
 ┃ ┣ 📜 Policy.js               # Policy schema with claim tracking
 ┣ 📂 routes
 ┃ ┣ 📜 userRoutes.js           # API routes for users & transactions
 ┣ 📜 server.js                 # Express server setup
 ┣ 📜 config.js                 # Configuration for Hedera & database
 ┣ 📜 .env                      # Environment variables
 ┣ 📜 README.md                 # Documentation
```
