"""
Shri Selvam Tiles & Granites - Backend Email Server
Python Flask Application with SMTP Email Functionality

Setup Instructions:
1. Install required packages:
   pip install flask flask-cors python-dotenv

2. Create a .env file in the backend folder with:
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   RECIPIENT_EMAIL=info@shriselvamtiles.com

3. Run the server:
   python app.py

4. Server will run on http://localhost:5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USERNAME = os.getenv('SMTP_USERNAME', '')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL', 'info@shriselvamtiles.com')

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'message': 'Shri Selvam Tiles Backend Server',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/send-enquiry', methods=['POST'])
def send_enquiry():
    """
    Handle contact form submissions
    Expected JSON: { name, mobile, email, message }
    """
    try:
        # Get form data
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'mobile', 'email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field.capitalize()} is required'
                }), 400
        
        name = data.get('name')
        mobile = data.get('mobile')
        email = data.get('email')
        message = data.get('message', 'No message provided')
        
        # Create email
        email_sent = send_email(name, mobile, email, message)
        
        if email_sent:
            return jsonify({
                'success': True,
                'message': 'Enquiry sent successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to send enquiry. Please try again.'
            }), 500
            
    except Exception as e:
        print(f"Error processing enquiry: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error. Please contact us directly.'
        }), 500

def send_email(name, mobile, email, message):
    """
    Send email using SMTP
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'New Enquiry from {name} - Shri Selvam Tiles'
        msg['From'] = SMTP_USERNAME
        msg['To'] = RECIPIENT_EMAIL
        
        # Email body (HTML)
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }}
                .content {{ background: #f5f5f5; padding: 20px; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #1a1a1a; }}
                .value {{ color: #555; }}
                .footer {{ background: #1a1a1a; color: #d4af37; padding: 15px; text-align: center; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Customer Enquiry</h2>
                    <p>Shri Selvam Tiles & Granites</p>
                </div>
                <div class="content">
                    <p>You have received a new enquiry from your website:</p>
                    
                    <div class="field">
                        <span class="label">Name:</span>
                        <span class="value">{name}</span>
                    </div>
                    
                    <div class="field">
                        <span class="label">Mobile:</span>
                        <span class="value">{mobile}</span>
                    </div>
                    
                    <div class="field">
                        <span class="label">Email:</span>
                        <span class="value">{email}</span>
                    </div>
                    
                    <div class="field">
                        <span class="label">Message:</span>
                        <div class="value">{message}</div>
                    </div>
                    
                    <div class="field">
                        <span class="label">Received On:</span>
                        <span class="value">{datetime.now().strftime('%d %B %Y at %I:%M %p')}</span>
                    </div>
                </div>
                <div class="footer">
                    <p>This email was sent from the Shri Selvam Tiles website contact form.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Attach HTML body
        msg.attach(MIMEText(html_body, 'html'))
        
        # Send email
        if not SMTP_USERNAME or not SMTP_PASSWORD:
            print("Warning: SMTP credentials not configured. Email not sent.")
            print(f"Enquiry details: Name: {name}, Mobile: {mobile}, Email: {email}")
            return True  # Return True for testing without actual email
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"Email sent successfully to {RECIPIENT_EMAIL}")
        return True
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

# Run the server
if __name__ == '__main__':
    print("\n" + "="*50)
    print("Shri Selvam Tiles & Granites - Backend Server")
    print("="*50)
    print(f"Server running on: http://localhost:5000")
    print(f"SMTP Server: {SMTP_SERVER}")
    print(f"SMTP Username: {SMTP_USERNAME if SMTP_USERNAME else 'Not configured'}")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
