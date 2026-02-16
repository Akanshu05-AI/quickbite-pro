# QuickBite Pro 
**Smart Mess Management System with Digital Pass Terminal**

QuickBite Pro is a lightweight, responsive web application designed to streamline university mess operations. It features real-time menu updates, secure QR token generation, and an automated attendance tracking system.

##  Live Demo
https://akanshu05-ai.github.io/quickbite-pro/

##  Key Features
* **Dynamic Menu Engine:** Automatically updates the displayed meal (Breakfast, Lunch, Snacks, Dinner) based on the current system time.
* **Digital Pass Terminal:** Students generate unique QR-coded tokens for meal authorization.
* **Security Session Guard:** Prevents duplicate meal entries by logging roll numbers and flagging "Security Breaches" in real-time.
* **Enterprise Admin Hub:** A hidden dashboard for wardens to monitor crowd density, view attendance logs, and export data.
* **Data Portability:** One-click CSV export for offline attendance records.

##  Technical Stack
* **Frontend:** HTML5, CSS3 (Custom Properties & Flexbox), Vanilla JavaScript.
* **QR Generation:** `qrcode.js` library.
* **Persistence:** LocalStorage for session logging and security tracking.

##  Admin Access
To access the **Enterprise Admin Hub**, triple-click the header title ("QuickBite Pro") and enter the secure passcode. 
*(Default passcode: `admin123`)*
