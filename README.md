# Private Equity Target Finder App

This app assists private equity professionals in identifying the top 3 **real** target companies for acquisition based on specific investment criteria.

## User Journey

1. **Sign In**

   - The user opens the app.
   - If not already signed in, the user is prompted to **"Sign in with ZAPT"**.
   - Above the authentication component, the text **"Sign in with ZAPT"** is displayed.
   - A link to the ZAPT marketing site [https://www.zapt.ai](https://www.zapt.ai) is available and opens in a new tab.
   - The user completes the authentication process using one of the available providers: **Google**, **Facebook**, or **Apple**.

2. **Set Investment Criteria**

   - After signing in, the user is presented with a form to enter their investment criteria:
     - **Minimum Purchase Price**: Numeric input for the minimum desired purchase price.
     - **Maximum Purchase Price**: Numeric input for the maximum desired purchase price.
     - **Location**: Text input for the preferred location (city, state, or country).
     - **Growth Target Percentage**: Numeric input for the desired growth target percentage.
     - **Industry**: Text input for the industry of interest.

3. **Find Target Companies**

   - The user clicks the **"Find Target Companies"** button.
   - A loading indicator appears on the button with the text **"Finding Companies..."** to indicate the request is being processed.
   - The button is disabled during the loading state to prevent multiple submissions.

4. **View Results**

   - The app displays the top 3 **real** companies that match the provided investment criteria.
   - For each company, the following information is displayed:
     - **Company Name**
     - **Purchase Price**
     - **Location**
     - **Expected Growth Percentage**
     - **Industry**
   - The company cards are interactive, with a hover effect that slightly scales them for a dynamic user experience.

5. **Sign Out**

   - The user can sign out of the app by clicking the **"Sign Out"** button at the top-right corner.
   - The app updates in real-time, returning the user to the sign-in page without requiring a page refresh.

## Features

- **Responsive Design**: The app is fully responsive and looks great on all screen sizes, from mobile to desktop.
- **User-Friendly Interface**: Clean and intuitive interface with clear labels and input fields.
- **Secure Authentication**: Authentication is handled securely through Supabase with support for social login providers.
- **Real-Time Loading Indicators**: Users receive immediate feedback when their request is being processed.
- **Interactive Elements**: Buttons and company cards have hover effects to enhance user engagement.
- **Prevent Multiple Submissions**: Buttons are disabled during loading to prevent duplicate requests.
- **Real Company Data**: The app provides information on **real** companies that match the user's investment criteria, ensuring accurate and valuable insights.
