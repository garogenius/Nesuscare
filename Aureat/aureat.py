#!/usr/bin/env python3
import requests
import pandas as pd
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
config.read(os.path.expanduser('~/.aureat_config.ini'))  # Config file in home directory

THREAT_FEEDS = {
    "CVE": "https://cve.circl.lu/api/last",
    "Abuse": "https://feodotracker.abuse.ch/downloads/ipblocklist.csv"
}

VERSION = "Aureat Tool v2.2"
MONITORED_DEVICES = []
DEFAULT_SAVE_PATH = os.path.expanduser('~')
REPORTS_PATH = os.path.join(DEFAULT_SAVE_PATH, "aureat_reports")

if not os.path.exists(REPORTS_PATH):
    os.makedirs(REPORTS_PATH)

def display_header():
    print("________________________________________________________________")
    print("|                                                               |")
    print("|                                                               |")
    subprocess.run(["figlet", "             Aureat"])
    print("|        Automated Threat Intelligence Aggregator Tool          |")
    print("|                     Created by Garogenius                     |")
    print("|                                                               |")
    print("|                                                               |")
    print("_________________________________________________________________")

# Load devices from the monitored_devices.txt file
def load_devices(save_path=None):
    save_path = save_path or DEFAULT_SAVE_PATH
    full_path = os.path.join(save_path, "monitored_devices.txt")
    if os.path.exists(full_path):
        with open(full_path, "r") as f:
            for line in f:
                name, ip, device_type = line.strip().split(" - ")
                MONITORED_DEVICES.append({"name": name, "ip": ip, "type": device_type})

def add_device(ip_address, name, device_type):
    MONITORED_DEVICES.append({"ip": ip_address, "name": name, "type": device_type})
    print(f"Device {ip_address} ({name}, {device_type}) added to monitoring list.")
    save_devices()

def remove_device(ip_address):
    global MONITORED_DEVICES
    MONITORED_DEVICES = [d for d in MONITORED_DEVICES if d['ip'] != ip_address]
    print(f"Device {ip_address} removed from monitoring list.")
    save_devices()

def drop_all_devices():
    global MONITORED_DEVICES
    MONITORED_DEVICES = []
    print("All devices have been removed from the monitoring list.")
    save_devices()

def save_devices(save_path=None):
    save_path = save_path or DEFAULT_SAVE_PATH
    full_path = os.path.join(save_path, "monitored_devices.txt")
    with open(full_path, "w") as f:
        for device in MONITORED_DEVICES:
            f.write(f"{device['name']} - {device['ip']} - {device['type']}\n")
    print(f"Monitored devices saved to {full_path}.")

def list_monitored_devices():
    MONITORED_DEVICES.clear()  # Clear the list to reload fresh data from file
    load_devices()  # Load devices from the file
    if MONITORED_DEVICES:
        print("Devices in monitoring list:")
        for device in MONITORED_DEVICES:
            print(f"{device['name']} - {device['ip']} ({device['type']})")
    else:
        print("No devices in the monitoring list.")

def send_email_alert(subject, body, receiver_email):
    sender_email = config['Email']['SenderEmail']
    password = config['Email']['Password']

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.send_message(msg)
        print(f"Email alert sent to {receiver_email}.")
    except Exception as e:
        print(f"Error sending email: {e}")

def fetch_threat_data():
    threat_data = []
    for feed_name, feed_url in THREAT_FEEDS.items():
        try:
            response = requests.get(feed_url)
            if feed_name == "Abuse":
                data = response.text.splitlines()
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
    report_content = "\n".join([f"Device: {t['device']}, Threat: {t['threat']['description']}" for t in correlated_threats])
    report_file = os.path.join(REPORTS_PATH, f"{title.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    with open(report_file, "w") as f:
        f.write(report_content)
    print(f"Report saved to {report_file}.")
    return report_file

def detect_dangerous_threats(threat_data):
    dangerous_threats = [threat for threat in threat_data if "critical" in threat.get('severity', '').lower() or "malware" in threat.get('description', '').lower()]
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
    parser.add_argument('--save', help="Save the list of monitored devices to a specified location or default directory.")
    parser.add_argument('--version', action='store_true', help="Display the tool version.")
    parser.add_argument('--autocheck', help="Enable auto-checking for threats and send alerts periodically to the specified email.")
    parser.add_argument('--report', '-F', nargs=2, metavar=('title', 'content'), help="Send feedback or error report to the developer.")

    args = parser.parse_args()

    if args.version:
        print(VERSION)
    elif args.add and args.name and args.type:
        add_device(args.add, args.name, args.type)
    elif args.remove:
        remove_device(args.remove)
    elif args.drop:
        drop_all_devices()
    elif args.ML:
        list_monitored_devices()
    elif args.fetch:
        threat_data = fetch_threat_data()
        if args.correlate:
            correlated_threats = correlate_threats(threat_data)
            if args.report_title:
                generate_report(correlated_threats, args.report_title)
        if args.dg:
            dangerous_threats = detect_dangerous_threats(threat_data)
            if dangerous_threats:
                report_file = generate_report(dangerous_threats, "Dangerous Threats Report")
                send_email_alert("Dangerous Threats Detected", f"Critical or malware threats have been detected. Report: {report_file}", args.alert)
        if args.alert:
            send_email_alert("Threat Alert", "Check attached threats", args.alert)
    elif args.autocheck:
        auto_checker(receiver_email=args.autocheck)
    elif args.report and args.F:
        send_feedback(args.F[0], args.F[1])

if __name__ == "__main__":
    display_header()
    main()
