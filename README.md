# AgriShop – Authentication Module

Authentication module for the AgriShop Website (Agricultural E-Commerce Platform), built as part of Project 02 / Week 01 at HR-SAC.

## Overview

This module handles user authentication and role-based access for the AgriShop platform, covering both Customer and Admin flows.

## Screens Implemented

- Splash Screen – checks for an active session on load and redirects accordingly
- Sign Up – creates a new account (defaults to customer role)
- OTP Verification – emailed verification code required after signup
- Login – single login form; automatically redirects to Customer or Admin dashboard based on role
- Forgot Password – sends a password reset link via email
- Reset Password – set a new password after clicking the reset link
- Logout – available on both dashboards

## Tech Stack

- Frontend: React.js (Vite)
- Backend / Auth / Database: Supabase (PostgreSQL, Supabase Auth)
- Email delivery: Resend (custom SMTP, connected to Supabase)
- Routing: React Router

## Project Structure

src/
  pages/
    Splash.jsx
    SignUp.jsx
    VerifyOtp.jsx
    Login.jsx
    ForgotPassword.jsx
    ResetPassword.jsx
    CustomerDashboard.jsx
    AdminDashboard.jsx
  ProtectedRoute.jsx
  supabaseClient.js
  App.jsx
  index.css

## How Roles Work

Every new signup is inserted into a profiles table with role = 'customer' by default, via a database trigger that fires automatically when a new user is created in Supabase Auth.

To test the Admin flow, manually promote an account using SQL in the Supabase SQL Editor:

update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'your_email@example.com');

Routes are protected via ProtectedRoute.jsx, which checks both session validity and role before allowing access to /customer-dashboard or /admin-dashboard. Logged-out users, or users with the wrong role, are redirected to /login.

## Setup Instructions

1. Clone the repo and install dependencies:
   npm install

2. Create a .env file in the project root with:
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

3. Run the dev server:
   npm run dev

## Known Limitation: Email Delivery Restricted to One Address

Supabase's own default email service is heavily restricted — it only sends a very small number of emails per hour, and only to addresses associated with the project's own team. This makes it unusable for testing signup/OTP/password-reset flows with real, arbitrary user emails. To work around this, this project uses Resend as a custom SMTP provider, connected directly to Supabase's Auth settings.

However, Resend's free tier has its own restriction: until a custom domain is verified with Resend, all outgoing emails can only be sent from Resend's shared testing address (onboarding@resend.dev), and — critically — that testing address is only allowed to deliver mail to the single email address that was used to create the Resend account itself. Any signup attempt using a different email address will fail silently on the backend (visible as a 500 error in Supabase's Auth logs, and a 403 "testing domain restriction" error in Resend's own logs).

Practically, this means: during development and testing, all Sign Up, OTP Verification, and Forgot Password flows must use the exact email address that was used to create the project's Resend account. Using any other email address will not deliver the OTP code or reset link.

To lift this restriction for production use (so any customer can sign up with any email), a real domain needs to be verified in Resend under Domains → Add Domain, which involves adding DNS records (SPF/DKIM) to a domain the team owns. This was outside the scope of this module's initial build and is noted here as a follow-up task for whoever manages deployment.



Note: The Resend account for this project is currently registered under shreyaszcoer@gmail.com. Any testing of Sign Up, OTP Verification, or Forgot Password must use this exact email address to receive the verification code or reset link. (Only the email address is shared here — inbox access is not, so testing requires the original developer to check for and relay the code.)
