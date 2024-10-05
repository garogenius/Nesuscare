#!/usr/bin/env python3
import requests
import smtplib
import configparser
import os
import argparse
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import subprocess
import time
import sys

# Configuration
config = configparser.ConfigParser()
config.read(os.path.expanduser('~/.config.ini'))  # Config file in home directory

THREAT_FEEDS = {
    "CVE": "https://cve.circl.lu/api/last",
    "Abuse": "https://feodotracker.abuse.ch/downloads/ipblocklist.csv"
}

VERSION = "Aureat Tool v2.2"
MONITORED_DEVICES = []
WORKING_DIR = os.getcwd()  # Get the current working directory
REPORTS_PATH = os.path.join(WORKING_DIR, "aureat_reports")
DEVICES_FILE = os.path.join(WORKING_DIR, "monitored_devices.txt")

# Create directories if they don't exist
if not os.path.exists(REPORTS_PATH):
    os.makedirs(REPORTS_PATH)

def display_header():
    print("___________________________________________________________")
    print("|                                                          |")
    subprocess.run(["figlet", "            Aureat"])
    print("|   Automated Threat Intelligence Aggregator Tool          |")
    print("|                Created by Garogenius                     |")
    print("|                                                          |")
    print("|__________________________________________________________|")

def load_devices():
    """Load devices from the file into the MONITORED_DEVICES list."""
    global MONITORED_DEVICES
    MONITORED_DEVICES = []
    if os.path.exists(DEVICES_FILE):
        with open(DEVICES_FILE, "r") as f:
            for line in f:
                name, ip, device_type = line.strip().split(" - ")
                MONITORED_DEVICES.append({"ip": ip, "name": name, "type": device_type})
    else:
        print(f"No device file found at {DEVICES_FILE}. Starting fresh...")

def save_devices():
    """Save the MONITORED_DEVICES list to the file."""
    with open(DEVICES_FILE, "w") as f:
        for device in MONITORED_DEVICES:
            f.write(f"{device['name']} - {device['ip']} - {device['type']}\n")
    print(f"Monitored devices saved to {DEVICES_FILE}.")

def add_device(ip_address, name, device_type):
    load_devices()  # Always load the latest devices before adding
    MONITORED_DEVICES.append({"ip": ip_address, "name": name, "type": device_type})
    print(f"Device {ip_address} ({name}, {device_type}) added to monitoring list.")
    save_devices()

def remove_device(ip_address):
    load_devices()  # Load the latest devices before removing
    global MONITORED_DEVICES
    # Fix: Only remove the device that matches the given IP address
    device_found = False
    for device in MONITORED_DEVICES:
        if device['ip'] == ip_address:
            MONITORED_DEVICES.remove(device)
            device_found = True
            print(f"Device {ip_address} removed from monitoring list.")
            save_devices()
            break
    if not device_found:
        print(f"Device with IP {ip_address} not found.")

def drop_all_devices():
    global MONITORED_DEVICES
    MONITORED_DEVICES = []
    print("All devices have been removed from the monitoring list.")
    save_devices()

def list_monitored_devices():
    load_devices()  # Always load the latest devices before listing
    if MONITORED_DEVICES:
        print("Devices in monitoring list:")
        for device in MONITORED_DEVICES:
            print(f"{device['name']} - {device['ip']} ({device['type']})")
    else:
        print("No devices in the monitoring list.")

def send_email_alert(subject, body, receiver_email):
    try:
        # Ensure the 'Email' section is present
        if 'Email' not in config:
            print("Error: 'Email' section is missing in config.ini.")
            return

        senderEmail = config['Email'].get('SenderEmail')
        password = config['Email'].get('Password')

        # Ensure both email and password are provided
        if not senderEmail or not password:
            print("Error: Missing SenderEmail or Password in config.ini.")
            return

        msg = MIMEMultipart()
        msg['From'] = senderEmail
        msg['To'] = receiver_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(senderEmail, password)
                server.send_message(msg)
            print(f"Email alert sent to {receiver_email}.")
        except Exception as e:
            print(f"Error sending email: {e}")
    
    except KeyError as e:
        print(f"KeyError: Missing email configuration for {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

def fetch_threat_data():
    threat_data = []
    for feed_name, feed_url in THREAT_FEEDS.items():
        try:
            response = requests.get(feed_url)
            if feed_name == "Abuse":
                data = response.text.splitlines()
                threat_data.extend([{"ip": line.split(',')[0], "description": line} for line in data])  # Adjust structure as needed
            else:
                data = response.json()
                threat_data.extend(data)
            print(f"Fetched {len(data)} records from {feed_name}.")
        except requests.RequestException as e:
            print(f"Error fetching data from {feed_name}: {e}")
    return threat_data

def correlate_threats(threat_data):
    correlated_threats = []
    for threat in threat_data:
        for device in MONITORED_DEVICES:
            if 'ip' in threat and threat['ip'] == device['ip']:
                correlated_threats.append({
                    "device": device['name'],
                    "threat": threat
                })
    return correlated_threats

def generate_report(correlated_threats, title="Threat Report"):
    if not correlated_threats:
        print("No correlated threats to report.")
        return

    report_content = "\n".join([f"Device: {t['device']}, Threat: {t['threat'].get('description', 'No description available')}" for t in correlated_threats])
    report_file = os.path.join(REPORTS_PATH, f"{title.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    with open(report_file, "w") as f:
        f.write(report_content)
    print(f"Report saved to {report_file}.")
    return report_file

def detect_dangerous_threats(threat_data):
    # Fix: Make sure threat_data contains dictionaries, not strings
    dangerous_threats = [threat for threat in threat_data if isinstance(threat, dict) and (
        "critical" in threat.get('severity', '').lower() or "malware" in threat.get('description', '').lower())]
    return dangerous_threats

def send_feedback(title, content):
    feedback_email = "aureat.tool@gmail.com"
    feedback_subject = f"Feedback: {title}"
    send_email_alert(feedback_subject, content, feedback_email)
    print(f"Feedback sent to the developer: {feedback_subject}")

def auto_checker(interval=3600, receiver_email=""):
    while True:
        print("Running auto-check for new threats...")
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        if correlated_threats:
            report_file = generate_report(correlated_threats)
            send_email_alert("New Threats Detected", f"Threat report generated: {report_file}", receiver_email)
        else:
            print("No new correlated threats.")
        print(f"Waiting {interval} seconds before next check...")
        time.sleep(interval)

# Command-line Interface
def main():
    parser = argparse.ArgumentParser(description="Aureat - Automated Threat Intelligence Aggregator by Garogenius")
    parser.add_argument('--add', '-d', help="Add device to the monitoring list. Example: aureat --add <IP> -n 'name' --type 'device_type'")
    parser.add_argument('--name', '-n', help="Specify device name when adding to the monitoring list.")
    parser.add_argument('--type', help="Specify device type when adding to the monitoring list.")
    parser.add_argument('--remove', '-D', help="Remove device from the monitoring list by IP address.")
    parser.add_argument('--drop', '-ML', action='store_true', help="Remove all devices from the monitoring list.")
    parser.add_argument('--ML', '-l', action='store_true', help="List all devices in the monitoring list.")
    parser.add_argument('--fetch', action='store_true', help="Fetch latest threat data from feeds.")
    parser.add_argument('--correlate', action='store_true', help="Correlate fetched threats with monitored devices.")
    parser.add_argument('--report-title', help="Generate a report of correlated threats.")
    parser.add_argument('--dg', action='store_true', help="Detect dangerous threats and send alert.")
    parser.add_argument('--feedback', '-F', help="Send feedback to the developer with title and content.")
    parser.add_argument('--receiver', help="Email to receive alert notifications.")
    parser.add_argument('--version', action='version', version=VERSION, help="Show version information.")
    parser.add_argument('--auto-check', action='store_true', help="Run auto-check for new threats.")
    args = parser.parse_args()

    display_header()

    if args.add and args.name and args.type:
        print(f"Attempting to add device: {args.add}, Name: {args.name}, Type: {args.type}")
        add_device(args.add, args.name, args.type)
    elif args.remove:
        print(f"Attempting to remove device with IP: {args.remove}")
        remove_device(args.remove)
    elif args.drop:
        print("Dropping all devices from monitoring list.")
        drop_all_devices()
    elif args.ML:
        print("Listing all monitored devices.")
        list_monitored_devices()
    elif args.fetch:
        print("Fetching latest threat data.")
        threat_data = fetch_threat_data()
    elif args.correlate:
        print("Correlating fetched threats with monitored devices.")
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        if correlated_threats:
            report_file = generate_report(correlated_threats, args.report_title)
            send_email_alert("Threat Report", f"Report generated: {report_file}", args.receiver)
    elif args.dg:
        print("Detecting dangerous threats.")
        threat_data = fetch_threat_data()
        dangerous_threats = detect_dangerous_threats(threat_data)
        if dangerous_threats:
            send_email_alert("Dangerous Threats Detected", f"Found dangerous threats: {dangerous_threats}", args.receiver)
    elif args.feedback:
        print("Sending feedback.")
        title, content = args.feedback.split(', ', 1)
        send_feedback(title, content)
    elif args.auto_check:
        receiver_email = args.receiver if args.receiver else config['Email'].get('ReceiverEmail', '')
        print(f"Starting auto-check with receiver email: {receiver_email}")
        auto_checker(receiver_email=receiver_email)
    else:
        parser.print_help()

if __name__ == '__main__':
    load_devices()
    main()
