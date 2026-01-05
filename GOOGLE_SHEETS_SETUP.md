# Google Sheets Integration Setup Guide

This guide explains how to set up Google Sheets integration to automatically log all form submissions (leads and booking requests) from your General Equipments website.

## Overview

When a user submits a form (contact, product inquiry, or booking request), the data is:
1. Stored in Supabase database (primary storage)
2. Sent to Google Sheets via webhook (backup/CRM)

## Setup Steps

### 1. Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "General Equipments - Leads"
4. Create two sheets (tabs): "Leads" and "Bookings"

### 2. Set Up Sheet Headers

**For "Leads" sheet:**
```
Row 1 (Headers):
| Timestamp | Type | Name | Email | Phone | Company | Inquiry Type | Source Page | Message | Product ID |
```

**For "Bookings" sheet:**
```
Row 1 (Headers):
| Timestamp | Name | Email | Phone | Company | Preferred Date | Preferred Time | Topic | Message |
```

### 3. Create Apps Script Webhook

#### Step 1: Open Script Editor
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code

#### Step 2: Add the Webhook Code

Copy and paste this code:

```javascript
/**
 * General Equipments - Form Submissions Webhook
 * This script receives POST requests and logs them to the appropriate sheet
 */

function doPost(e) {
  try {
    // Parse incoming data
    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Determine which sheet to use based on submission type
    var sheetName = data.type === 'booking' ? 'Bookings' : 'Leads';
    var sheet = spreadsheet.getSheetByName(sheetName);

    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);

      // Add headers
      if (sheetName === 'Bookings') {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Company', 'Preferred Date', 'Preferred Time', 'Topic', 'Message']);
      } else {
        sheet.appendRow(['Timestamp', 'Type', 'Name', 'Email', 'Phone', 'Company', 'Inquiry Type', 'Source Page', 'Message', 'Product ID']);
      }
    }

    // Append the data
    if (sheetName === 'Bookings') {
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.phone || '',
        data.company || '',
        data.preferred_date || '',
        data.preferred_time || '',
        data.topic || '',
        data.message || ''
      ]);
    } else {
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.inquiry_type || 'general',
        data.name || '',
        data.email || '',
        data.phone || '',
        data.company || '',
        data.inquiry_type || '',
        data.source_page || '',
        data.message || '',
        data.product_id || ''
      ]);
    }

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Data logged successfully'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - you can run this to verify the script works
 */
function testWebhook() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        type: 'lead',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1 555 123 4567',
        company: 'Test Company',
        inquiry_type: 'General Inquiry',
        source_page: '/contact',
        message: 'This is a test submission'
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

#### Step 3: Save and Deploy

1. Click the **floppy disk icon** or **File → Save** to save your script
2. Name the project "General Equipments Webhook"
3. Click **Deploy** → **New deployment**
4. Click the gear icon next to "Select type" and choose **Web app**
5. Configure the deployment:
   - **Description**: "Production webhook for form submissions"
   - **Execute as**: Select **Me (your email)**
   - **Who has access**: Select **Anyone**
6. Click **Deploy**
7. **Authorize** the app (you'll need to grant permissions)
8. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
   ```

### 4. Test the Webhook

1. In Apps Script, click on `testWebhook` function
2. Click **Run**
3. Check your "Leads" sheet - you should see a test row added
4. If successful, proceed to the next step

### 5. Configure Supabase Environment Variable

**IMPORTANT:** The webhook URL needs to be added as an environment variable in your Supabase project.

#### Contact Information

To set up the environment variable, you'll need access to Supabase project settings:

1. Navigate to your Supabase Dashboard
2. Go to **Project Settings** → **Edge Functions**
3. Add a new secret:
   - **Name**: `GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value**: Your Google Sheets Apps Script web app URL

Example:
```
Name: GOOGLE_SHEETS_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbyXXXXXXXXXXX/exec
```

4. Save the secret
5. Redeploy the edge functions (if needed)

### 6. Verify Integration

1. Go to your website
2. Submit a test form (contact form, product inquiry, or booking)
3. Check your Google Sheet - the data should appear within seconds
4. Check Supabase database - data should also be there

## Spreadsheet Features

### Auto-Formatting (Optional)

You can enhance your spreadsheet with:

1. **Conditional Formatting**:
   - Highlight new leads (based on timestamp)
   - Color-code inquiry types
   - Mark high-priority companies

2. **Data Validation**:
   - Add dropdown menus for status tracking
   - Create follow-up date columns

3. **Formulas**:
   - Count leads per day: `=COUNTIF(A:A, TODAY())`
   - Calculate conversion rates
   - Track response times

### Example Enhanced Sheet Structure

```
| Timestamp | Status | Name | Email | Phone | Company | Inquiry Type | Source | Message | Assigned To | Follow-Up Date | Notes |
```

## Troubleshooting

### Issue: Data not appearing in Google Sheets

**Solution:**
1. Check that the webhook URL is correctly configured in Supabase
2. Verify the Apps Script deployment is set to "Anyone" can access
3. Check Apps Script execution logs: **Executions** button in Apps Script Editor
4. Ensure the sheet names match exactly ("Leads" and "Bookings")

### Issue: "Authorization Required" error

**Solution:**
1. Re-deploy the Apps Script
2. Make sure you authorized the script
3. Check if your Google account has permission to access the spreadsheet

### Issue: Some fields are empty

**Solution:**
1. Check the field names in the edge function match the Apps Script expectations
2. Verify the data is being sent from the frontend correctly
3. Add logging to the Apps Script to see what data is received

## Security Considerations

### Is this secure?

Yes, for the following reasons:
1. The webhook URL is kept secret (not exposed in frontend code)
2. Only Supabase Edge Functions know the URL (stored in environment variables)
3. The webhook only accepts POST requests
4. Data is validated before being logged
5. Google Apps Script runs in a secure Google environment

### Best Practices

1. **Don't share the webhook URL publicly**
2. **Periodically rotate the deployment** (create new deployment, update Supabase)
3. **Monitor the Apps Script execution logs** for suspicious activity
4. **Limit access to the Google Sheet** to only necessary team members
5. **Create backups** of your sheet regularly

## Data Retention

### Archiving Old Data

To keep your active sheet manageable:

1. Create an "Archive" sheet
2. Periodically (monthly/quarterly) move old data:
   ```javascript
   // Add this function to your Apps Script
   function archiveOldLeads() {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
     var archiveSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Archive');
     var cutoffDate = new Date();
     cutoffDate.setMonth(cutoffDate.getMonth() - 3); // 3 months ago

     var data = sheet.getDataRange().getValues();
     var rowsToArchive = [];

     for (var i = data.length - 1; i > 0; i--) {
       var rowDate = new Date(data[i][0]);
       if (rowDate < cutoffDate) {
         rowsToArchive.push(data[i]);
         sheet.deleteRow(i + 1);
       }
     }

     if (rowsToArchive.length > 0) {
       archiveSheet.getRange(archiveSheet.getLastRow() + 1, 1, rowsToArchive.length, rowsToArchive[0].length)
         .setValues(rowsToArchive);
     }
   }
   ```

## CRM Integration (Advanced)

This Google Sheets setup can serve as a lightweight CRM, or you can integrate it with:

- **HubSpot**: Use Zapier to sync Google Sheets → HubSpot
- **Salesforce**: Use Google Sheets API to push data
- **Pipedrive**: Use Zapier or direct API integration
- **Custom CRM**: Use Google Sheets API to pull data

## Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify the webhook URL is correct in Supabase
3. Test with the `testWebhook()` function
4. Review the error logs in Supabase Edge Function logs

---

**Setup Complete!** Your Google Sheets integration is now ready to automatically log all form submissions.
