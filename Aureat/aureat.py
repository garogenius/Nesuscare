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
import nmap

# Configuration
config = configparser.ConfigParser()
config.read(os.path.expanduser('config.ini'))  # Config file in home directory

THREAT_FEEDS = {
    "CVE": "https://cve.circl.lu/api/last",
    "Abuse": "https://feodotracker.abuse.ch/downloads/ipblocklist.csv",
    "Malware": "https://malwaredatabase.com/api/latest"  # Hypothetical API
}

VERSION = "Aureat Tool v2.4"
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
    """Add device and check for vulnerabilities."""
    load_devices()  # Always load the latest devices before adding
    MONITORED_DEVICES.append({"ip": ip_address, "name": name, "type": device_type})
    print(f"Device {ip_address} ({name}, {device_type}) added to monitoring list.")
    # Perform an advanced vulnerability scan
    scan_device_for_vulns(ip_address, device_type)
    save_devices()

def remove_device(ip_address):
    load_devices()  # Load the latest devices before removing
    global MONITORED_DEVICES
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
    """Send email alert to the configured receiver."""
    try:
        if 'Email' not in config:
            print("Error: 'Email' section is missing in config.ini.")
            return

        sender_email = config['Email'].get('SenderEmail')
        password = config['Email'].get('Password')

        if not sender_email or not password:
            print("Error: Missing SenderEmail or Password in config.ini.")
            return

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = receiver_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.send_message(msg)
        print(f"Email alert sent to {receiver_email}.")
        
    except smtplib.SMTPAuthenticationError:
        print("Error: Authentication failed. Check your credentials or enable App Passwords.")
    except Exception as e:
        print(f"Unexpected error: {e}")

def fetch_threat_data():
    """Fetch threat data from various threat feeds."""
    threat_data = []
    for feed_name, feed_url in THREAT_FEEDS.items():
        try:
            response = requests.get(feed_url)
            if feed_name == "Abuse":
                data = response.text.splitlines()
                for line in data:
                    try:
                        threat_data.append({"ip": line.split(',')[0], "description": line})
                    except IndexError:
                        continue  # Skip malformed lines
            else:
                data = response.json()
                threat_data.extend(data)
            print(f"Fetched {len(data)} records from {feed_name}.")
        except requests.RequestException as e:
            print(f"Error fetching data from {feed_name}: {e}")
    return threat_data

def scan_device_for_vulns(ip_address, device_type):
    """Perform an advanced scan to detect vulnerabilities on the device."""
    print(f"Starting vulnerability scan for {ip_address} ({device_type})...")

    nm = nmap.PortScanner()
    nm.scan(ip_address, arguments='-sV --script vuln')

    for host in nm.all_hosts():
        print(f"Scan results for {host}:")
        for proto in nm[host].all_protocols():
            for port in nm[host][proto]:
                state = nm[host][proto][port]['state']
                service = nm[host][proto][port]['name']
                print(f"Port {port}: {service} is {state}")
                
                # Log detected vulnerabilities (if any)
                if 'script' in nm[host][proto][port]:
                    for script in nm[host][proto][port]['script']:
                        print(f"Vulnerability: {script} -> {nm[host][proto][port]['script'][script]}")

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
    report_content = "\n".join([f"Device: {t['device']}, Threat: {t['threat']['description']}" for t in correlated_threats])
    report_file = os.path.join(REPORTS_PATH, f"{title.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    with open(report_file, "w") as f:
        f.write(report_content)
    print(f"Report saved to {report_file}.")
    return report_file

def detect_dangerous_threats(threat_data):
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
    parser.add_argument('--add', '-d', help="Add device to the monitoring list. Example: aureat --add -d <IP> -n 'name' --type 'device_type'")
    parser.add_argument('--name', '-n', help="Specify device name when adding to the monitoring list.")
    parser.add_argument('--type', help="Specify device type when adding to the monitoring list.")
    parser.add_argument('--remove', '-D', help="Remove device from the monitoring list by IP address.")
    parser.add_argument('--drop', '-ML', action='store_true', help="Remove all devices from the monitoring list.")
    parser.add_argument('--ML', '-l', action='store_true', help="List all devices in the monitoring list.")
    parser.add_argument('--fetch', action='store_true', help="Fetch latest threat data from feeds.")
    parser.add_argument('--correlate', action='store_true', help="Correlate fetched threats with monitored devices.")
    parser.add_argument('--report-title', help="Generate a report of correlated threats.")
    parser.add_argument('--alert', help="Send email alerts for detected threats to the specified email.")
    parser.add_argument('--dg', action='store_true', help="Detect dangerous threats like malware or critical threats and send email alert.")
    parser.add_argument('--save', help="Specify location to save the report.")
    parser.add_argument('--feedback', '-F', nargs=2, help="Send feedback to the developer with title and content.")
    parser.add_argument('--version', action='version', version=VERSION)
    parser.add_argument('--auto', action='store_true', help="Start the auto checker for new threats.")

    args = parser.parse_args()

    display_header()
    load_devices()

    if args.add and args.name and args.type:
        add_device(args.add, args.name, args.type)
    elif args.remove:
        remove_device(args.remove)
    elif args.drop:
        drop_all_devices()
    elif args.ML:
        list_monitored_devices()
    elif args.fetch:
        fetch_threat_data()
    elif args.correlate:
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        print(correlated_threats)
    elif args.report_title:
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        generate_report(correlated_threats, args.report_title)
    elif args.alert:
        send_email_alert("Threat Alert", "New threats detected.", args.alert)
    elif args.dg:
        threat_data = fetch_threat_data()
        dangerous_threats = detect_dangerous_threats(threat_data)
        if dangerous_threats:
            generate_report(dangerous_threats, "Dangerous Threat Report")
            send_email_alert("Dangerous Threat Detected", "Check the dangerous threat report.", args.alert)
    elif args.feedback:
        send_feedback(args.feedback[0], args.feedback[1])
    elif args.auto:
        receiver_email = config['Email'].get('ReceiverEmail') if 'Email' in config and 'ReceiverEmail' in config['Email'] else ""
        auto_checker(receiver_email=receiver_email)
    else:
        print("No valid command provided. Use --help for more information.")

if __name__ == "__main__":
    main()
