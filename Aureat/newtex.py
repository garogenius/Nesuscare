#!/usr/bin/env python3
import requests
import smtplib
import os
import argparse
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import subprocess
import time
import socket
import nmap
import scapy.all as scapy  # Scapy for packet sniffing and manipulation
import threading

# Email Configuration
SENDER_EMAIL = "aureat.tool@gmail.com"
PASSWORD = "Aureat@4991!"
RECEIVER_EMAIL = None  # Will be set via CLI

# Threat Feeds
THREAT_FEEDS = {
    "CVE": "https://cve.circl.lu/api/last",
    "Abuse": "https://feodotracker.abuse.ch/downloads/ipblocklist.csv",
    "Malware": "https://malwaredatabase.com/api/latest"  # Hypothetical API
}

VERSION = "Aureat Tool v2.5"
MONITORED_DEVICES = []
WORKING_DIR = os.getcwd()
REPORTS_PATH = os.path.join(WORKING_DIR, "aureat_reports")
DEVICES_FILE = os.path.join(WORKING_DIR, "aureat_reports/monitored_devices.txt")

# Create directories if they don't exist
if not os.path.exists(REPORTS_PATH):
    os.makedirs(REPORTS_PATH)

def display_header():
    print("___________________________________________________________")
    print("|                                                          |")
    subprocess.run(["figlet", "           Aureat"])
    print("|   Automated Threat Intelligence Aggregator Tool          |")
    print("|                Created by Garogenius                     |")
    print("|               Powered By 3MTT Program                    |")
    print("|__________________________________________________________|")

def load_devices():
    global MONITORED_DEVICES
    MONITORED_DEVICES = []
    if os.path.exists(DEVICES_FILE):
        with open(DEVICES_FILE, "r") as f:
            for line in f:
                try:
                    name, ip, device_type = line.strip().split(" - ")
                    print("_________________________________________________________________")
                    print("|             Devices and Network Monitored List                 |")
                    print("|________________________________________________________________|")
                    MONITORED_DEVICES.append({"ip": ip, "name": name, "type": device_type})
                
                except ValueError:
                    print(f"Invalid device format in line: {line}")
    else:
        print(f"No device file found at {DEVICES_FILE}. Starting fresh...")

def save_devices():
    with open(DEVICES_FILE, "w") as f:
        for device in MONITORED_DEVICES:
            f.write(f"{device['name']} - {device['ip']} - {device['type']}\n")
            print("Result Found")
    print(f"Monitored devices saved to {DEVICES_FILE}.")

def add_device(ip_address, name, device_type):
    load_devices()
    if ip_address.count('.') != 3:
        print("Invalid IP address format.")
        return
    MONITORED_DEVICES.append({"ip": ip_address, "name": name, "type": device_type})
    print(f"Device {ip_address} ({name}, {device_type}) added to monitoring list.")
    scan_output = scan_device_for_vulns(ip_address, device_type)
    save_devices()
    print(scan_output)
    return scan_output

def remove_device(ip_address):
    load_devices()
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
    load_devices()
    if MONITORED_DEVICES:
        print("Devices in monitoring list:")
        for device in MONITORED_DEVICES:
            print(f"{device['name']} - {device['ip']} ({device['type']})")
    else:
        print("No devices in the monitoring list.")

def send_email_alert(subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, PASSWORD)
            server.send_message(msg)
        print(f"Email alert sent to {RECEIVER_EMAIL}.")
        
    except smtplib.SMTPAuthenticationError:
        print("Error: Authentication failed. Check your credentials or enable App Passwords.")
    except Exception as e:
        print(f"Unexpected error: {e}")

def fetch_threat_data():
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
    print(f"Starting vulnerability scan for {ip_address} ({device_type})...")
    nm = nmap.PortScanner()
    try:
        nm.scan(ip_address, arguments='-sV --script vuln')

        scan_output = []
        for host in nm.all_hosts():
            scan_output.append(f"Scan results for {host}:")
            for proto in nm[host].all_protocols():
                for port in nm[host][proto]:
                    state = nm[host][proto][port]['state']
                    service = nm[host][proto][port]['name']
                    output = f"Port {port}: {service} is {state}"
                    scan_output.append(output)
                    print("|__________________________________________________________|")
                    print(output)
                    print("|__________________________________________________________|")
                    
                    if 'script' in nm[host][proto][port]:
                        for script in nm[host][proto][port]['script']:
                            vulnerability_output = f"Vulnerability: {script} -> {nm[host][proto][port]['script'][script]}"
                            scan_output.append(vulnerability_output)
                            print(vulnerability_output)
                        else:
                            print("No Any Vulnerability Found in The Network/Device")

        return "\n".join(scan_output)

    except Exception as e:
        print(f"Error during scan: {e}")

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
        print("No detected threats.")
        report_file = os.path.join(REPORTS_PATH, f"{title.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
        with open(report_file, "w") as f:
            f.write("No detected threats at this time. the detection is automatic, the momen we find the threat you will inform")
        print(f"Report saved to {report_file}.")
        print("No detected threats at this time. the detection is automatic, the momen we find the threat you will inform")
        return report_file

    report_content = "\n".join([f"Device: {t['device']}, Threat: {t['threat']['description']}" for t in correlated_threats])
    report_file = os.path.join(REPORTS_PATH, f"{title.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    with open(report_file, "w") as f:
        f.write(report_content)
        print("Report")
        print(report_content)
    print(f"Report saved to {report_file}.")
    return report_file

def detect_dangerous_threats(threat_data):
    dangerous_threats = [threat for threat in threat_data if isinstance(threat, dict) and (
        "critical" in threat.get('severity', '').lower() or "malware" in threat.get('description', '').lower())]
    return dangerous_threats

def sniff_traffic():
    def packet_callback(packet):
        # Analyzing packets for malicious content (e.g., suspicious IPs, unusual protocols)
        if packet.haslayer(scapy.IP):
            ip_src = packet[scapy.IP].src
            ip_dst = packet[scapy.IP].dst
            protocol = packet[scapy.IP].proto
            
            print(f"Packet from {ip_src} to {ip_dst}, Protocol: {protocol}")

            # Check for known malicious IP addresses (You can populate this with real data)
            malicious_ips = ["192.168.1.100", "10.0.0.5"]  # Example malicious IPs
            if ip_src in malicious_ips:
                alert = f"Alert: Suspicious traffic from malicious source IP: {ip_src}"
                print(alert)
                send_email_alert("Malicious Traffic Detected", alert)

            # Check for unusual protocols
            if protocol not in [1, 6, 17]:  # 1: ICMP, 6: TCP, 17: UDP
                alert = f"Alert: Unusual protocol detected: {protocol} from {ip_src} to {ip_dst}"
                print(alert)
                send_email_alert("Unusual Protocol Detected", alert)

            # Analyze payload for patterns (this can be improved based on your needs)
            if packet.haslayer(scapy.Raw):
                payload = packet[scapy.Raw].load
                # Example: Check for SQL injection patterns
                if b"SELECT" in payload or b"DROP" in payload:
                    alert = f"Alert: Potential SQL injection attempt detected from {ip_src}"
                    print(alert)
                    send_email_alert("SQL Injection Attempt Detected", alert)

    print("Starting traffic sniffing...")
    scapy.sniff(prn=packet_callback, store=0)


def alert_on_threats(threat_data):
    dangerous_threats = detect_dangerous_threats(threat_data)
    if dangerous_threats:
        for threat in dangerous_threats:
            subject = f"Alert: Dangerous Threat Detected for {threat['ip']}"
            body = f"Details: {threat['description']}"
            send_email_alert(subject, body)

def start_automatic_check(interval=600):
    while True:
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        generate_report(correlated_threats)
        alert_on_threats(threat_data)
        time.sleep(interval)

def main():
    global RECEIVER_EMAIL
    display_header()
    
    parser = argparse.ArgumentParser(description="Aureat - Automated Threat Intelligence Aggregator")
    parser.add_argument("--set-email", metavar='EMAIL', help="Set the receiver email for alerts.")
    parser.add_argument("--detect-malware", metavar='IP', help="Detect malware or ransomware for a specific device by IP.")
    parser.add_argument("--block-ip", metavar='IP', help="Block a suspicious IP address.")
    parser.add_argument("--sniff-traffic", action='store_true', help="Start sniffing network traffic for threats.")
    parser.add_argument("--add-device", nargs=3, metavar=('IP', 'NAME', 'TYPE'), help="Add a device to the monitoring list.")
    parser.add_argument("--remove-device", metavar='IP', help="Remove a device from the monitoring list.")
    parser.add_argument("--drop-all-devices", action='store_true', help="Drop all devices from monitoring list.")
    parser.add_argument("--list-devices", action='store_true', help="List all monitored devices.")
    parser.add_argument("--start-checks", action='store_true', help="Start automatic threat checks every 10 minutes.")
    parser.add_argument("--fetch", action='store_true', help="Fetch latest threat data from feeds.")
    parser.add_argument("--correlate", action='store_true', help="Correlate fetched threats with monitored devices.")
    parser.add_argument("--dg", action='store_true', help="Detect dangerous threats and alert.")
    args = parser.parse_args()

    if args.set_email:
        RECEIVER_EMAIL = args.set_email
        print(f"Receiver email set to: {RECEIVER_EMAIL}")

    if args.add_device:
        ip, name, device_type = args.add_device
        add_device(ip, name, device_type)

    if args.remove_device:
        remove_device(args.remove_device)

    if args.drop_all_devices:
        drop_all_devices()

    if args.list_devices:
        list_monitored_devices()

    if args.start_checks:
        # Start automatic checks in a separate thread to avoid blocking
        thread = threading.Thread(target=start_automatic_check, args=(600,))
        thread.start()
    
    if args.sniff_traffic:
        sniff_traffic()

    if args.detect_malware:
        scan_output = scan_device_for_vulns(args.detect_malware, "unknown")
        print(scan_output)

    if args.fetch:
        threat_data = fetch_threat_data()

    if args.correlate:
        correlated_threats = correlate_threats(fetch_threat_data())
        generate_report(correlated_threats)

    if args.dg:
        dangerous_threats = detect_dangerous_threats(fetch_threat_data())
        alert_on_threats(dangerous_threats)

if __name__ == "__main__":
    main()
