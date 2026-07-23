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

## Email Delivery

Email delivery (OTP verification, password reset) is handled via Gmail SMTP using an App Password. This allows the app to send emails to any user's address — no restrictions on which email addresses can sign up or receive codes.