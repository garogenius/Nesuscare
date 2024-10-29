#!/usr/bin/env python

import requests
import smtplib
import os
import argparse
import json
import netifaces as ni
from scapy.all import ARP, Ether, srp 
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import subprocess
import time
import argparse
from rich.console import Console
from rich.table import Table
import webbrowser
#import geoip2.database
import socket
#from geoip2.database import Reader
from tqdm import tqdm
from colorama import Fore, Style

import nmap
import scapy.all as scapy  # Scapy for packet sniffing and manipulation
import threading
import re
#.....................................
import sys
import time
import itertools
import threading
import random
from scapy.all import ARP, Ether, srp, conf
import netifaces as ni

import colorama
from colorama import Fore, Style, init
#......................................
colorama.init(autoreset=True)

# Email Configuration
SENDER_EMAIL = "aureat.tool@gmail.com"
PASSWORD = "Aureat@4991!"
RECEIVER_EMAIL = None  
GEOIP_DB_PATH = "/path/to/GeoLite2-City.mmdb"  # Path to the GeoLite2 database file
# Threat Feeds
THREAT_FEEDS = {
    "CVE": "https://cve.circl.lu/api/last",
    "Abuse": "https://feodotracker.abuse.ch/downloads/ipblocklist.csv",
    "Malware": "https://malwaredatabase.com/api/latest"  # Hypothetical API
}



VERSION = "Aureat Tool v2.1"
MONITORED_DEVICES = []
WORKING_DIR = os.getcwd()
REPORTS_PATH = os.path.join(WORKING_DIR, "aureat_reports")
DEVICES_FILE = os.path.join(WORKING_DIR, "aureat_reports/monitored_devices.txt")
VIRUSTOTAL_API_KEY = '294fe74dca4a62cbacbb348703fce0189a87b1ae307d91e67810f2f66c320a3a'

threat_data = [
    {"severity": "critical", "info": "Critical malware detected", "target_ip": "192.168.1.1", "attacker_info": {"ip": "203.0.113.5", "type": "malware"}},
    {"severity": "high", "info": "High risk IP detected", "target_ip": "192.168.1.10", "attacker_info": {"ip": "198.51.100.22", "type": "botnet"}},
    {"severity": "medium", "info": "Medium risk domain", "target_ip": "192.168.1.15", "attacker_info": {"ip": "192.0.2.45", "type": "phishing"}},
] 



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
                 #   print("_________________________________________________________________")
                  ## print("|________________________________________________________________|")
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
        
def open_documentation():
    print("Opening documentation in 3 seconds...")
    time.sleep(3)  # Delay for 3 seconds
    webbrowser.open('file:/aureat-doc/index.html')  # Replace with your HTML file path
    print("Documentation opened in your browser.")

def drop_all_devices():
    global MONITORED_DEVICES
    MONITORED_DEVICES = []
    print("All devices have been removed from the monitoring list.")
    save_devices()



console = Console()

def list_monitored_devices():
    load_devices()
    if MONITORED_DEVICES:
        # Create a table with columns for name, IP, and type
        table = Table(title="Devices in Monitoring List")
        table.add_column("Name", justify="left", style="cyan", no_wrap=True)
        table.add_column("IP Address", style="magenta")
        table.add_column("Type", justify="right", style="green")

        # Add each device to the table
        for device in MONITORED_DEVICES:
            table.add_row(device['name'], device['ip'], device['type'])

        # Print the table to the console
        console.print(table)
    else:
        console.print("No devices in the monitoring list.", style="bold red")



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
                        continue 
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






def print_radar(loading_indicator):
    radar_size = 70  # Length of the radar
    index = 0

    print("Scanning Vulnerability..: ", end='')
    print("Starting automatic detection of threats...")
    while True:
        # Create radar line
        radar_line = '-' * radar_size
        # Place the loading indicator
        radar_line = radar_line[:index] + loading_indicator[index % len(loading_indicator)] + radar_line[index + 1:]

        print(f"\r\033[92m{radar_line}\033[0m", end='') 

        index = (index + 1) % radar_size  
        time.sleep(0.3)  

def scan_device_for_vulns(ip_address, device_type):
    print(f"Starting vulnerability scan for {ip_address} ({device_type})...")
    nm = nmap.PortScanner()
    
    
    loading_indicator = ['-', '\\', '|', '/']  # Loader characters
    radar_thread = threading.Thread(target=print_radar, args=(loading_indicator,))
    radar_thread.daemon = True  
    radar_thread.start()

    try:
        nm.scan(ip_address, arguments='-sC -sV --script vuln')

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
                    
                    # Check for vulnerabilities
                    if 'script' in nm[host][proto][port]:
                        for script in nm[host][proto][port]['script']:
                            vulnerability_output = f"Vulnerability: {script} -> {nm[host][proto][port]['script'][script]}"
                            scan_output.append(vulnerability_output)
                            print(vulnerability_output)

        print("\nScan completed.")  # End of scan
        return "\n".join(scan_output)

    except Exception as e:
        print(f"Error during scan: {e}")



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





def block_ip(ip_address):
    try:
        subprocess.run(["iptables", "-A", "INPUT", "-s", ip_address, "-j", "DROP"], check=True)
        print(f"IP {ip_address} blocked successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to block IP {ip_address}: {e}")

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
    
    
def send_feedback(title, content):
    feedback_subject = f"Feedback: {title}"
    send_email_alert(feedback_subject, content)
    print(f"Feedback sent to the developer: {feedback_subject}")




def detect_dangerous_threats(threat_data):
    dangerous_threats = []
    with tqdm(total=len(threat_data), bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} MB {rate_fmt} eta {remaining}") as pbar:
        for threat in threat_data:
            if isinstance(threat, dict):
                severity = threat.get("severity", "").lower()
                if "critical" in severity:
                    dangerous_threats.append(threat)
                    print(Fore.RED + "ALERT: Critical Threat Detected!" + Style.RESET_ALL)
                    print(Fore.RED + f"Details: {threat}" + Style.RESET_ALL)
                elif "high" in severity:
                    dangerous_threats.append(threat)
                    print(Fore.YELLOW + "WARNING: High Threat Detected!" + Style.RESET_ALL)
                    print(Fore.YELLOW + f"Details: {threat}" + Style.RESET_ALL)
                elif "medium" in severity:
                    print(Fore.LIGHTYELLOW_EX + "Notice: Medium Threat Detected. Monitor closely." + Style.RESET_ALL)
                else:
                    print(Fore.GREEN + "Info: No significant threats detected." + Style.RESET_ALL)
                
                pbar.update(1)
                time.sleep(0.1)
                
    if dangerous_threats:
        print(Fore.RED + f"\nTotal Dangerous Threats Detected: {len(dangerous_threats)}" + Style.RESET_ALL)
    else:
        print(Fore.GREEN + "No Dangerous Threats Detected." + Style.RESET_ALL)

    return dangerous_threats



def sniff_traffic(interface):
    # Function to check if the interface exists
    def check_interface(interface):
        if interface in scapy.get_if_list():
            return True
        return False
    
    # Callback function for processing each packet
    def packet_callback(packet):
        if packet.haslayer(scapy.IP):
            ip_layer = packet.getlayer(scapy.IP)
            src_ip = ip_layer.src
            dest_ip = ip_layer.dst
            print(f"Packet detected: {src_ip} -> {dest_ip}")
            
            # Check if traffic is malicious
            if is_malicious_traffic(src_ip, dest_ip):
                print(f"Malicious traffic detected from {src_ip} to {dest_ip}.")
                send_email_alert("Malicious Traffic Detected", f"Suspicious traffic detected: {src_ip} -> {dest_ip}")
    
    # Check if the interface exists
    if not check_interface(interface):
        print(f"Error: Interface {interface} not found.")
        return
    
    # Ensure you are running with root privileges for sniffing
    if os.geteuid() != 0:
        print("Error: Please run the script as root to sniff network traffic.")
        return

    print(f"Starting traffic sniffing on interface {interface}...")
    try:
        scapy.sniff(iface=interface, prn=packet_callback, store=False)
    except Exception as e:
        print(f"An error occurred while sniffing traffic: {e}")



# Example list of known malicious IP addresses
known_malicious_ips = {
    "192.168.1.100",  # Example malicious IP
    "203.0.113.45",   # Another example
    "198.51.100.5"    # Yet another
}

def is_port_scanning(src_ip):
    """
    Hypothetical function to determine if the source IP is scanning ports.
    
    Parameters:
        src_ip (str): Source IP address.
        
    Returns:
        bool: True if port scanning behavior is detected, False otherwise.
    """
    # Placeholder for actual port scan detection logic
    connection_attempts = {
        "192.168.1.100": 50,  # Hypothetical number of connections
        "203.0.113.45": 5,
        "198.51.100.5": 3
    }
    
    return connection_attempts.get(src_ip, 0) > 20  # Example threshold

def is_malicious_traffic(src_ip, dest_ip):
    """
    Determine if the traffic from src_ip to dest_ip is malicious.
    
    Parameters:
        src_ip (str): Source IP address.
        dest_ip (str): Destination IP address.
        
    Returns:
        bool: True if the traffic is malicious, False otherwise.
    """
    # Check if source IP is in known malicious IPs
    if src_ip in MONITORED_DEVICES:
        print(f"Malicious source detected: {src_ip}")
        return True

    # Check against VirusTotal for IP reputation
    try:
        response = requests.get(f"https://www.virustotal.com/api/v3/ip_addresses/{src_ip}", 
                                headers={"x-apikey": VIRUSTOTAL_API_KEY})
        if response.status_code == 200:
            data = response.json()
            # Check if the IP has been reported as malicious
            if data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {}).get("malicious", 0) > 0:
                print(f"Malicious traffic detected from VirusTotal for IP: {src_ip}")
                return True
    except Exception as e:
        print(f"Error checking threat intelligence: {e}")

    # Check for port scanning behavior
    if is_port_scanning(src_ip):
        print(f"Possible port scanning detected from: {src_ip}")
        return True

    # Check for unusually high traffic volume
    traffic_volume = {
        ("192.168.1.100", "10.0.0.5"): 5000,  # Hypothetical traffic volume
        ("203.0.113.45", "10.0.0.6"): 200,
    }

    if traffic_volume.get((src_ip, dest_ip), 0) > 4000:  # Example threshold
        print(f"Unusually high traffic volume detected from {src_ip} to {dest_ip}.")
        return True

    return False  # No malicious activity detected






def print_radar(threat_detected):
    radar_size = 70  # Length of the radar
    loading_indicator = ['-', '\\', '|', '/']  # Loader characters
    index = 0

    print("Scanning & Monitoring")
     # Print the header only once
    while True:
        # Create radar line
        radar_line = '-' * radar_size
        # Place the loading indicator
        radar_line = radar_line[:index] + loading_indicator[index % len(loading_indicator)] + radar_line[index + 1:]

        # Replace with red dot if threat is detected
        if threat_detected:
            radar_line = radar_line.replace(loading_indicator[index % len(loading_indicator)], '•', 1)  # Red dot
            print(f"\r\033[91m{radar_line}\033[0m", end='')  # Red color for dots
        else:
            print(f"\r\033[92m{radar_line}\033[0m", end='')  # Green color for scanning line
        
        index = (index + 1) % radar_size  # Move the loading indicator
        time.sleep(0.3)  # Adjusted sleep for a smooth loading effect
        
        

def run_auto_detection():
    threat_detected = False
     
    # Display the header at the start
    #display_header()

    # Start the radar display in a separate thread
    radar_thread = threading.Thread(target=print_radar, args=(threat_detected,))
    radar_thread.daemon = True  # Allow the thread to exit when the main program does
    radar_thread.start()

    

    while True:
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        report_file = generate_report(correlated_threats, "Auto Threat Report")

       
        if correlated_threats:
            threat_detected = True
            send_email_alert("Correlated Threats Found", f"Threats were found. Report saved to {report_file}")

        dangerous_threats = detect_dangerous_threats(threat_data)
        if dangerous_threats:
            threat_detected = True
            send_email_alert("Dangerous Threats Detected", "Critical threats found! Immediate action is recommended.")

        time.sleep(600)  # Sleep for 10 minutes between checks
        
        
        
        
        

import nmap  # Ensure you have the python-nmap library installed

DEVICE_TYPES = {
    "Mobile": ["Apple", "Samsung", "Huawei"],
    "IoT": ["Raspberry", "Arduino", "Nest"],
    "Computer": ["Dell", "HP", "Lenovo", "Apple"],
    "Traffic Systems": ["Siemens", "Schneider"],
    "Bluetooth": ["BT", "HC-05", "JBL"]
}

# Helper function to map MAC addresses to device types
def identify_device_type(mac_address):
    for device_type, prefixes in DEVICE_TYPES.items():
        if any(prefix in mac_address for prefix in prefixes):
            return device_type
    return "Unknown"

def scan_local_network():
    """
    Scans the local network and returns a list of connected devices with their details.
    """
    nm = nmap.PortScanner()
    network_scan_output = nm.scan(hosts='192.168.1.0/24', arguments='-sn')  # Adjust network range as needed
    devices = []

    for host in nm.all_hosts():
        if 'mac' in nm[host]['addresses']:
            mac = nm[host]['addresses']['mac']
            device_type = identify_device_type(mac)
            device_info = {
                "name": nm[host]['hostnames'][0] if nm[host]['hostnames'] else "Unknown",
                "ip": nm[host]['addresses'].get('ipv4', 'Unknown'),
                "mac": mac,
                "device_type": device_type,
                "open_ports": nm[host].get('tcp', {}),
                "os": nm[host]['osclass'][0]['osfamily'] if 'osclass' in nm[host] else "Unknown"
            }
            devices.append(device_info)
    
    return devices






def scan_device_details(device_name):
    """
    Scans detailed information for a specific device by its name or IP, including potential vulnerabilities.
    """
    nm = nmap.PortScanner()
    print(f"Scanning {device_name} |", end="")

    try:
        # Start scanning with OS detection and vulnerability scan
        nm.scan(hosts=device_name, arguments='-O --script vuln')  # Using `vuln` script for vulnerability detection
        host_data = nm[device_name]
        
        # Collect detailed device information
        device_info = {
            "Name": device_name,
            "IP": host_data['addresses'].get('ipv4', 'Unknown'),
            "MAC": host_data.get('addresses', {}).get('mac', 'Unknown'),
            "Device Type": identify_device_type(host_data.get('addresses', {}).get('mac', '')),
            "Open Ports": {port: details for port, details in host_data.get('tcp', {}).items()},
            "Operating System": host_data['osclass'][0]['osfamily'] if 'osclass' in host_data and host_data['osclass'] else "Unknown"
        }

        # Vulnerability analysis
        vulnerabilities = []
        if 'hostscript' in host_data:
            for script in host_data['hostscript']:
                vulnerabilities.append({
                    "Vulnerability": script['id'],
                    "Description": script['output']
                })
        
        device_info["Vulnerabilities"] = vulnerabilities if vulnerabilities else "No known vulnerabilities found"
        
        # Display progress indicator and return the structured data
        print(" Progress: |=======================| ETA: 0h00m03s")
        return device_info
    except Exception as e:
        print(f" Error: Unable to scan device {device_name}. Details: {e}")
        return None


def search_devices_in_network():
    """
    Scans and displays all devices in the network with detailed information, including potential vulnerabilities.
    """
    devices = scan_local_network()
    print("Starting network scan...\n")
    
    for index, device in enumerate(devices, start=1):
        print(f"Device {index}/{len(devices)} - {device['name']}:")
        device_info = scan_device_details(device['name'])
        if device_info:
            print(json.dumps(device_info, indent=4))
            print("\n")
        else:
            print(" No data found for this device.\n")

    print("Network scan complete.")
    return devices






# A simple mapping of MAC address prefixes to device types
mac_vendor_map = {
    "00:1A:2B": "Router",
    "00:1C:4D": "Computer",
    "00:1E:58": "Smartphone",
    "00:11:22": "IoT Device",
    "00:14:51": "Camera",
    "4E:57:42": "Unknown Vendor",  # Adding your specific MAC as a placeholder
    # Add more MAC prefixes and device types as needed
}

def get_device_type(mac_address):
    """Determines the device type based on the MAC address."""
    prefix = mac_address.upper()[:8]  # Get the first 8 characters (e.g., "00:1A:2B")
    return mac_vendor_map.get(prefix, "Unknown")  # Default to "Unknown" if not found




def get_mac_vendor(mac_address):
    """Fetch the vendor of the given MAC address from an API or fallback to local mapping."""
    mac_prefix = mac_address[:8].upper()  # First 8 characters (including colons)
    try:
        response = requests.get(f'https://api.macvendors.com/{mac_prefix}', timeout=5)
        if response.status_code == 200:
            return response.text.strip()
        elif response.status_code == 404:  # Not Found
            print(f"Vendor for MAC {mac_address} not found in API.")
    except Exception as e:
        print(f"Error fetching vendor for MAC {mac_address}: {e}")

    # Fallback to local mapping if API fails or returns not found
    return mac_vendor_map.get(mac_prefix, "Unknown")





import random

def get_active_interface():
    """
    Attempts to find the active network interface automatically.
    """
    # Find an interface with an IPv4 address
    for interface in ni.interfaces():
        addresses = ni.ifaddresses(interface)
        if ni.AF_INET in addresses:
            ipv4_info = addresses[ni.AF_INET][0]
            if 'addr' in ipv4_info and not ipv4_info['addr'].startswith('127.'):
                return interface
    return "wlan0"  # Fallback interface if no active interface is detected

def progress_bar(preset_name, progress, width=30):
    """Displays a progress bar with different visual presets."""
    bar = "[" + "=" * int(width * progress) + " " * (width - int(width * progress)) + "]"
    percentage = int(progress * 100)
    eta = "null"  # Placeholder ETA, as we don't have real-time estimates here
    print(f"{preset_name}: {bar} {percentage}% | ETA: {eta} | {int(progress * 200)}/200", end="\r")
    time.sleep(0.05)  # Simulate a time delay for visual effect

def scan_local_network():
    """
    Scans the local network using ARP and displays detected devices with loading presets.
    """
    interface = get_active_interface()
    print(f"Starting ARP scan on interface {interface}...\n")

    # Get the IP address of the active interface
    ip_info = ni.ifaddresses(interface)[ni.AF_INET][0]
    ip_address = ip_info['addr']
    ip_prefix = '.'.join(ip_address.split('.')[:-1]) + '.0/24'  # Assuming /24 subnet

    # Create ARP request and broadcast packet
    arp_request = ARP(pdst=ip_prefix)
    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request

    # Run ARP scan
    conf.verb = 0  # Disable Scapy verbose output for cleaner logs
    answered_list = srp(arp_request_broadcast, timeout=3, iface=interface, retry=3)[0]

    devices = []
    presets = ["legacy", "shades_classic", "shades_grey", "rect"]
    
    print("Scanning in progress...\n")
    for i, element in enumerate(answered_list):
        progress = (i + 1) / len(answered_list)
        preset_name = random.choice(presets)
        progress_bar(preset_name, progress)
        
        device_info = {
            'ip': element[1].psrc,
            'mac': element[1].hwsrc,
            'device_type': get_mac_vendor(element[1].hwsrc)  # Fetch vendor dynamically
        }
        devices.append(device_info)
    
    # Clear the final progress bar line
    print("\n" + " " * 80, end="\r")
    
    # Display scan results
    if not devices:
        print("No devices found on the network.")
    else:
        print("Devices found on the network:\n")
        print(json.dumps(devices, indent=4))

    return devices








def scan_device_for_vulns(ip, device_type):
    """Perform vulnerability scanning logic for the specified device."""
    vulnerabilities = {
        'ip': ip,
        'device_type': device_type,
        'vulnerabilities': []
    }

    # Example: Check for open ports (common ports)
    common_ports = [22, 23, 80, 443, 3306]  # SSH, Telnet, HTTP, HTTPS, MySQL
    for port in common_ports:
        if check_port(ip, port):
            vulnerabilities['vulnerabilities'].append(f"Port {port} is open.")

    # You can add more checks based on device type
    if device_type == "Router":
        vulnerabilities['vulnerabilities'].append("Check for default credentials on the router.")

    return vulnerabilities

def check_port(ip, port):
    """Check if a specific port is open on a given IP address."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)  # Timeout for connection attempt
    result = sock.connect_ex((ip, port))  # Try to connect
    sock.close()
    return result == 0  # Port is open if result is 0

def scan_network():
    """
    Scans the entire network for connected devices and generates a report with vulnerabilities.
    """
    print("Scanning local network for vulnerabilities...")
    devices = scan_local_network()  # Ensure this function works correctly

    if not devices:
        print("No devices found on the network.")
    else:
        for device in devices:
            print(f"Scanning {device['ip']} for vulnerabilities...")
            vulnerabilities = scan_device_for_vulns(device['ip'], device['device_type'])
            print(json.dumps(vulnerabilities, indent=4))  # Better output formatting

    return devices









def main():
   
    display_header()
    device_info = None
   
    parser = argparse.ArgumentParser(description="Aureat: Automated Threat Intelligence Aggregator Tool")
    
    parser.add_argument('--add-device', nargs=3, metavar=('ip_address', 'name', 'type'), help="Add a device to monitoring list")
    parser.add_argument('--remove-device', metavar='ip_address', help="Remove a device from monitoring list")
    parser.add_argument('--drop-all', action='store_true', help="Remove all devices from the monitoring list")
    parser.add_argument('--list-devices', action='store_true', help="List all monitored devices")
    parser.add_argument('--add-email', metavar='email_address', help="Specify the email to receive alerts")
    parser.add_argument('--detect-malware', action='store_true', help="Run malware detection on monitored devices")
    parser.add_argument('--block-ip', metavar='ip_address', help="Block a specific IP address from accessing the network")
    parser.add_argument('--version', action='store_true', help="Show the tool version")
    parser.add_argument('--start-auto-detection', action='store_true', help="Start automatic threat detection every 10 minutes")
    parser.add_argument('--sniff', metavar='interface', help="Start sniffing network traffic for malicious activity")
    parser.add_argument('--open-doc', action='store_true', help='Open the HTML documentation in the browser')
    
    parser.add_argument('--email-report', action='store_true', help='Email the generated report')

    parser.add_argument('--report', action='store_true', help='Generate a threat report for monitored devices')
    parser.add_argument('--feedback', nargs=2, help='Send feedback: <title> <content>')
    parser.add_argument("--detect-dg-threats", action="store_true", help="Detect dangerous threats in provided threat data")
    parser.add_argument('--scan-device', metavar='device_name', help="Scan a specific device for vulnerabilities")
    parser.add_argument('--scan-network', action='store_true', help="Scan the local network for all connected devices and their vulnerabilities")
    parser.add_argument("--fetch", action='store_true', help="Fetch latest threat data from feeds.")
    parser.add_argument("--correlate", action='store_true', help="Correlate fetched threats with monitored devices.")
    parser.add_argument('--search-devices', action='store_true', help="Search for devices (mobile phones, IoT, traffic systems, Bluetooth) within the network")
    
    args = parser.parse_args()
    
    if args.version:
        print(VERSION)
    
    if args.add_device:
        ip_address, name, device_type = args.add_device
        add_device(ip_address, name, device_type)
    
    if args.remove_device:
        remove_device(args.remove_device)
    
    if args.drop_all:
        drop_all_devices()
    
    if args.list_devices:
        list_monitored_devices()
        
    if args.open_doc:
        open_documentation()
        return  # Exit after opening documentation
        
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
        
    if args.feedback:
        title, content = args.feedback
        send_feedback(title, content)

        
    if args.detect_dg_threats:
        # Sample data to simulate threat detection
        threat_data = [
            {"severity": "critical", "info": "Critical malware detected"},
            {"severity": "high", "info": "High risk IP detected"},
            {"severity": "medium", "info": "Medium risk domain"},
        ]
        detect_dangerous_threats(threat_data)

    
    if args.add_email:
        global RECEIVER_EMAIL
        RECEIVER_EMAIL = args.add_email
        print(f"Alerts will be sent to {RECEIVER_EMAIL}")
    
    if args.block_ip:
        block_ip(args.block_ip)
    
    if args.detect_malware:
        print("Running malware detection on monitored devices...")
        threat_data = fetch_threat_data()
        correlated_threats = correlate_threats(threat_data)
        report_file = generate_report(correlated_threats, "Malware Detection Report")
        send_email_alert("Malware Detection Complete", f"Report saved to {report_file}")
    
    if args.sniff:
        print(f"Starting traffic sniffing on interface {args.sniff}...")
        sniff_traffic(args.sniff)
        
    if args.scan_device:
        device_info = scan_device_details(args.scan_device)

    if device_info:  # This will check if device_info is not None
        print(json.dumps(device_info, indent=4))
    else:
        print("")
    if args.fetch:
        threat_data = fetch_threat_data()

    if args.correlate:
        correlated_threats = correlate_threats(fetch_threat_data())
        generate_report(correlated_threats)

    
    
    if args.scan_network:
        print(f"Starting Network Scanning....")
        devices = scan_network()

    if args.search_devices:
        print(f"Searching for Devices....")
        search_devices_in_network()
    
    if args.start_auto_detection:
        detection_thread = threading.Thread(target=run_auto_detection)
        detection_thread.start()
        
   
        

if __name__ == "__main__":
    main()
