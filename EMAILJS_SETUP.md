# EmailJS Setup Guide

To enable the contact form to send emails to `josephayinde64@gmail.com`, you need to set up EmailJS.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (or log in if you already have one)
3. The free tier allows 200 emails per month

## Step 2: Add an Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. **Note the Service ID** (you'll need this)

## Step 3: Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use the following template variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{message}}` - Message content
   - `{{to_email}}` - Recipient email (josephayinde64@gmail.com)

4. Example template:
   ```
   Subject: New Contact Form Submission from {{from_name}}
   
   You have received a new message from your personal website.
   
   From: {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   ```

5. Set the **To Email** field to: `josephayinde64@gmail.com`
6. **Note the Template ID** (you'll need this)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in the EmailJS dashboard
2. Find your **Public Key**
3. Copy it

## Step 5: Update the Code

Open `src/App.jsx` and replace these values with your actual credentials:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'      // Replace with your Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'   // Replace with your Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'     // Replace with your Public Key
```

## Step 6: Test the Form

1. Run your development server: `npm run dev`
2. Navigate to the Connect page
3. Click "explore more"
4. Fill out and submit the contact form
5. Check your email at `josephayinde64@gmail.com`

## Troubleshooting

- **Form not sending**: Make sure all three credentials are correctly set in `App.jsx`
- **Email not received**: Check your spam folder and verify the template settings
- **Service error**: Verify your email service is properly connected in EmailJS dashboard

## Security Note

The Public Key is safe to expose in client-side code. However, for production, consider using environment variables:

1. Create a `.env` file in the root directory:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

2. Update `App.jsx` to use environment variables:
   ```javascript
   const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
   const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
   const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
   ```

