export interface SchoolFile {
  id: string;
  name: string;
  fileType: "txt" | "log" | "pdf" | "img" | "conf" | "roster";
  size: string;
  timestamp: string; // AM/PM format
  caseId?: number; // 1 to 5
  checklistId?: string; // Links to ECHO checklist item
  expectedVerdict?: "verified_true" | "flagged_hallucination" | "irrelevant";
  title: string;
  author: string;
  sourceDevice: string;
  content: string;
  revealCodeHint?: string; // Subtle clue for the 4-digit code embedded in text
}

export interface RoomFolder {
  id: string;
  folderName: string;
  icon?: string;
  files: SchoolFile[];
}

export interface RoomDirectory {
  roomId: string;
  roomName: string;
  description: string;
  folders: RoomFolder[];
}

export const ROOM_DIRECTORIES: Record<string, RoomDirectory> = {
  classroom: {
    roomId: "classroom",
    roomName: "Classroom 3-B",
    description: "Senior homeroom. Contains notice board clippings, student desks, and teacher drawers.",
    folders: [
      {
        id: "cr-bulletin",
        folderName: "notice_board_clippings",
        files: [
          {
            id: "file-cr-screenshot",
            name: "emergency_lockdown_forward.png.txt",
            fileType: "img",
            size: "1.8 MB",
            timestamp: "04:20 PM",
            caseId: 1,
            checklistId: "c1-item-1",
            expectedVerdict: "flagged_hallucination",
            title: "Viral Mobile Screenshot: 'Emergency Campus Lockdown'",
            author: "Forwarded via Student Group Chat (Unknown Origin)",
            sourceDevice: "Captured Mobile Device Display",
            content: `[DOCUMENT VIEWER: IMAGE ARTIFACT ANALYSIS]
TITLE: URGENT PRINCIPAL BROADCAST - CAMPUS LOCKDOWN
POSTED: Today, 04:15 PM (Claimed)

BODY TEXT:
"URGENT ALERT TO ALL HOMEROOMS:
Due to catastrophic cybersecurity intrusion into school servers, the Principal's Office has commanded an immediate and total campus lockdown beginning at 04:15 PM. Passcode: LOCKDOWN. All doors will lock indefinitely."

[TECHNICAL FORENSIC INSPECTION]:
- Font face on timestamp '04:15 PM' is Arial 12pt; body font is Helvetica Neue 10pt.
- Inconsistent anti-aliasing pixels detected around the fake word 'LOCKDOWN'.
- Image metadata reveals file was saved using a mobile photo editor app at 04:20 PM.
- School administrative cryptographic signature: MISSING.`,
          },
          {
            id: "file-cr-chat-rumor",
            name: "unverified_chat_evacuation_claim.txt",
            fileType: "txt",
            size: "1.5 KB",
            timestamp: "04:18 PM",
            caseId: 1,
            checklistId: "c1-item-4",
            expectedVerdict: "flagged_hallucination",
            title: "Anonymous Social Post: 'Evacuation Protocol 1615'",
            author: "Anonymous Student Account (@campus_leaks)",
            sourceDevice: "Web Cache",
            content: `UNVERIFIED CHAT POST:
"Heard Principal announced lockdown code LOCKDOWN over the speakers! Get out now!"

TECHNICAL NOTE:
No audio broadcast occurred with this text. Administrative signatures missing. This is a forwarded student rumor that cited the false LOCKDOWN passcode.`,
          },
          {
            id: "file-cr-clubs",
            name: "weekly_club_meetings.txt",
            fileType: "txt",
            size: "2.1 KB",
            timestamp: "08:30 AM",
            caseId: 1,
            checklistId: "c1-item-3",
            expectedVerdict: "irrelevant",
            title: "Senior High Weekly Club Schedule",
            author: "Student Affairs Coordinator",
            sourceDevice: "Homeroom Notice Terminal",
            content: `HOMEROOM 3-B CLUB SCHEDULE:
- Monday 04:00 PM: Robotics Club (Physics Lab)
- Tuesday 03:30 PM: Track & Field Practice (Athletics Field)
- Wednesday 04:30 PM: Debate Society (Library Seminar Room)
- Thursday 04:00 PM: Chess Club (Room 2-A)
- Friday 03:45 PM: Student Council Weekly Briefing (Council Office)

Reminder: All students must submit club activity permits to homeroom adviser before 05:00 PM.`,
          },
          {
            id: "file-cr-guidelines",
            name: "classroom_rules_2026.txt",
            fileType: "txt",
            size: "1.4 KB",
            timestamp: "September 01",
            expectedVerdict: "irrelevant",
            title: "Classroom Code of Conduct",
            author: "Homeroom Advisory Committee",
            sourceDevice: "Administrative Archive",
            content: `CLASSROOM CODE OF CONDUCT:
1. Mobile devices must remain silenced inside backpacks during instructional hours.
2. Food and drinks are strictly prohibited near lab computers and classroom electronics.
3. Cleanliness duty is assigned by weekly seating rows.
4. Hallway passes must be worn visibly when leaving the room during class periods.`,
          },
        ],
      },
      {
        id: "cr-desk-drawer",
        folderName: "teacher_desk_drawers",
        files: [
          {
            id: "file-cr-printer",
            name: "printer_alignment_diag.log",
            fileType: "log",
            size: "3.2 KB",
            timestamp: "Yesterday, 11:20 AM",
            caseId: 1,
            checklistId: "c1-item-3",
            expectedVerdict: "irrelevant",
            title: "Network Printer Self-Diagnostic & Color Test",
            author: "Classroom HP LaserJet Pro Daemon",
            sourceDevice: "Local Printer Firmware v4.11",
            content: `[HARDWARE DIAGNOSTIC REPORT]
DEVICE: Classroom-3B-Printer-01 (IP: 192.168.10.84)
TIMESTAMP: Yesterday, 11:20 AM

COLOR CALIBRATION TEST:
- Cyan: 100% OK
- Magenta: 100% OK
- Yellow: 100% OK
- Black: 100% OK
Printhead alignment deviation: 0.02 mm (Pass)
Total page count: 1,420 pages printed.
Fuser temperature: 185 C (Normal).
Paper tray capacity: 65% remaining.
Diagnostic status: ALL SYSTEMS HEALTHY.`,
          },
          {
            id: "file-cr-attendance",
            name: "homeroom_rollcall_oct26.txt",
            fileType: "roster",
            size: "4.8 KB",
            timestamp: "08:15 AM",
            expectedVerdict: "irrelevant",
            title: "Homeroom Attendance Roster (32 Students)",
            author: "Ms. Eleanor Vance (Homeroom Adviser)",
            sourceDevice: "Teacher Desk Workstation",
            content: `HOMEROOM 3-B MORNING ROLL CALL:
Total Enrolled: 32 | Present: 31 | Excused Absence: 1 (Medical)

Present:
- Alvarez, Marcus [Present]
- Chen, Kimberly [Present]
- Garcia, Diego [Present]
- Morales, Samantha [Present]
- Rivera, Alex [Present - Track Team Dismissal at 03:15 PM]
- Santos, Lea [Present]
- Tan, Joshua [Present]
... (24 additional students marked present).
Adviser Signature: E. Vance`,
          },
        ],
      },
    ],
  },

  student_council: {
    roomId: "student_council",
    roomName: "Student Council Office",
    description: "Campus governance hub. Holds official broadcast logs, club budgets, and council files.",
    folders: [
      {
        id: "sc-broadcasts",
        folderName: "broadcast_transcripts",
        files: [
          {
            id: "file-sc-official-log",
            name: "official_broadcast_log_oct26.txt",
            fileType: "txt",
            size: "5.4 KB",
            timestamp: "03:45 PM",
            caseId: 1,
            checklistId: "c1-item-2",
            expectedVerdict: "verified_true",
            title: "Certified Public Broadcast Audio Transcript",
            author: "Student Council Secretary & Faculty Moderator",
            sourceDevice: "Council Master Public Address Console",
            content: `CAMPUS PUBLIC ADDRESS & BROADCAST AUDIT
LOG ENTRY IDENTIFIER: #0345
TRANSMISSION TIME: Today, exactly 03:45 PM
FACULTY APPROVAL CODE: SC-AUTH-0345

TRANSCRIPT:
"Good afternoon, faculty and students. This is a reminder from the Student Council that all Senior High research drafts and project portfolios must be submitted by 05:00 PM today before the weekend archive cycle. Please ensure your PROJECT work is saved properly."

SECURITY STATUS:
- Security breaches reported: NONE.
- Emergency lockdowns authorized: NONE.
- System integrity: 100% VERIFIED BY SCHOOL SEAL.

CERTIFIED OFFICIAL ENTRY:
All announcements require this official council certification. The scheduled campus event is the Senior PROJECT submission.`,
            revealCodeHint: "PROJECT",
          },
          {
            id: "file-sc-president-agenda",
            name: "president_desk_announcement_schedule.txt",
            fileType: "txt",
            size: "2.8 KB",
            timestamp: "03:45 PM",
            caseId: 1,
            checklistId: "c1-item-3",
            expectedVerdict: "verified_true",
            title: "Council President Daily Speech Schedule",
            author: "Council President (Maya)",
            sourceDevice: "Desk Agenda Notebook",
            content: `DAILY PRESIDENTIAL AGENDA - OCT 26:
- 08:30 AM: Morning flag ceremony.
- 11:30 AM: Budget review with treasurer.
- 03:45 PM: OFFICIAL PA BROADCAST (Senior PROJECT Submission Reminder).
  * Emphasize: No extensions past 05:00 PM for the PROJECT drafts.
  * Verified: No emergency announcements authorized today.

Note: Intercom speech scheduled strictly for the PROJECT event.`,
            revealCodeHint: "PROJECT",
          },
          {
            id: "file-sc-meeting",
            name: "council_meeting_minutes.txt",
            fileType: "txt",
            size: "3.7 KB",
            timestamp: "01:30 PM",
            expectedVerdict: "irrelevant",
            title: "Student Council Executive Session Minutes",
            author: "Council Vice President",
            sourceDevice: "Council Laptop",
            content: `STUDENT COUNCIL EXECUTIVE COMMITTEE MINUTES:
Item 1: Review of Campus Clean-Up Drive scheduled for next Saturday.
Item 2: Cafeteria suggestion box review: Requests for more vegetarian meal options.
Item 3: Approval of 5,000 PHP budget for sports fest award ribbons.
Adjourned at 02:15 PM.`,
          },
        ],
      },
      {
        id: "sc-budget",
        folderName: "financial_and_passes",
        files: [
          {
            id: "file-sc-fund",
            name: "quarterly_budget_allocation.csv",
            fileType: "conf",
            size: "6.1 KB",
            timestamp: "10:00 AM",
            expectedVerdict: "irrelevant",
            title: "Q4 Student Organization Budget Summary",
            author: "Student Council Treasurer",
            sourceDevice: "Office Desktop",
            content: `Club,Allocated Budget,Disbursed,Remaining Balance
Science Club,12000,8500,3500
Robotics Team,25000,21000,4000
Athletics Club,18000,16500,1500
Debate Union,8000,5200,2800
Arts & Drama,15000,11000,4000`,
          },
        ],
      },
    ],
  },

  computer_lab: {
    roomId: "computer_lab",
    roomName: "Computer Laboratory",
    description: "Central network core. Contains server racks, automated cron scripts, and workstation terminals.",
    folders: [
      {
        id: "comp-server-logs",
        folderName: "server_automation_logs",
        files: [
          {
            id: "file-comp-cron",
            name: "cron_daily_maintenance.log",
            fileType: "log",
            size: "8.9 KB",
            timestamp: "02:48 PM",
            caseId: 2,
            checklistId: "c2-item-1",
            expectedVerdict: "verified_true",
            title: "Automated System Archival & Relocation Journal",
            author: "Campus Network Cron Daemon (Automated Process)",
            sourceDevice: "Central Server Rack 01 (sys-core-01)",
            content: `CAMPUS NETWORK CORE - SYSTEM MAINTENANCE LOG
TASK EXECUTION ID: AUTOMATED CRON RELOCATION SCRIPT
TIMESTAMP: Today, 02:48 PM
USER: root (Automated Cron Job)

COMMAND:
/usr/local/bin/archive_sensitive.sh --target /shared/exams/

EXECUTION TRACE:
- Locating flagged unreleased test documents...
- Target found: 'Confidential_Biology_Exam_Draft.pdf' (Size: 1.4 MB).
- ACTION: Automated encryption applied (AES-256).
- RELOCATION: Moved file from public network cache to secure vault partition named 'ARCHIVE'.
- STATUS: COMPLETED SUCCESSFULLY. No unauthorized external access.
- File was safely stored inside the sanctuary partition: ARCHIVE.`,
            revealCodeHint: "ARCHIVE",
          },
          {
            id: "file-comp-vault-index",
            name: "vault_sector_2048_partition_table.log",
            fileType: "log",
            size: "5.1 KB",
            timestamp: "02:48 PM",
            caseId: 2,
            checklistId: "c2-item-3",
            expectedVerdict: "verified_true",
            title: "Secure Storage Partition Sector #2048 Index",
            author: "Storage Area Network (SAN) Controller",
            sourceDevice: "Encrypted Vault Controller",
            content: `SAN PARTITION SECTOR ALLOCATION TABLE:
VAULT PARTITION: ARCHIVE
MOUNT POINT: /vault/sector/ARCHIVE/
ENCRYPTION: AES-XTS 256-bit
LAST MODIFIED: 02:48 PM
STORED ARTIFACT: Confidential_Biology_Exam_Draft.pdf.enc

STATUS: Sealed and secure. Document was relocated automatically under routine maintenance into partition ARCHIVE. Zero data theft occurred.`,
            revealCodeHint: "ARCHIVE",
          },
          {
            id: "file-comp-traffic-alert",
            name: "network_traffic_bandwidth_anomaly.log",
            fileType: "log",
            size: "7.2 KB",
            timestamp: "02:50 PM",
            caseId: 2,
            checklistId: "c2-item-4",
            expectedVerdict: "flagged_hallucination",
            title: "Internal Cache Sync Bandwidth Alert",
            author: "Intrusion Detection System (IDS)",
            sourceDevice: "Local Switch Port 12",
            content: `TRAFFIC ALERT: High throughput burst on subnet 192.168.10.0/24.
ANALYSIS: Automated internal backup process syncing /shared to vault ARCHIVE.
DESTINATION: Local loopback (127.0.0.1).
CONCLUSION: False alarm! Traffic was local system maintenance, not external BREACH.`,
          },
          {
            id: "file-comp-firewall",
            name: "firewall_drop_traffic.log",
            fileType: "log",
            size: "14.2 KB",
            timestamp: "03:15 PM",
            expectedVerdict: "irrelevant",
            title: "Perimeter Firewall Packet Drop Summary",
            author: "PfSense Hardware Appliance",
            sourceDevice: "Gateway Router",
            content: `FIREWALL PACKET DROP JOURNAL:
03:00:12 DROP TCP 185.220.101.5:443 -> WAN:443 (Known botnet scanner)
03:05:48 DROP UDP 194.26.29.112:53 -> WAN:53 (Malformed DNS request)
03:12:04 DROP ICMP 45.154.255.8 -> WAN (Ping flood suppression)
All border drops handled automatically. Internal LAN untouched.`,
          },
        ],
      },
      {
        id: "comp-terminal-history",
        folderName: "workstation_device_audits",
        files: [
          {
            id: "file-comp-usb-audit",
            name: "usb_hardware_bus_query.log",
            fileType: "log",
            size: "4.1 KB",
            timestamp: "03:10 PM",
            caseId: 2,
            checklistId: "c2-item-2",
            expectedVerdict: "flagged_hallucination",
            title: "Workstation 04 USB Subsystem Hardware Audit",
            author: "Linux Kernel udev Device Manager",
            sourceDevice: "Workstation Terminal 04 (WS-LAB-04)",
            content: `HARDWARE BUS AUDIT: USB CONTROLLER 00:14.0
TIMESTAMP: Today, 03:10 PM

QUERY PARAMETER: Device Serial 'USB-STORAGE-9942'
SCANNING KERNEL DEVICE REGISTRY:
- Port 1: HP USB Optical Mouse (Vendor ID: 03f0, Product ID: 094a) [Active]
- Port 2: Dell QuietKey Keyboard (Vendor ID: 413c, Product ID: 2107) [Active]
- Port 3: Empty [Disconnected]
- Port 4: Empty [Disconnected]

QUERY RESULT:
ZERO MATCHES FOUND. No physical flash storage device bearing serial number 9942 has ever interfaced with this terminal or any lab machine.

CONCLUSION:
ECHO's citation of an external USB exfiltration and proposed passcode 'BREACH' is completely unsubstantiated by physical hardware logs.`,
          },
          {
            id: "file-comp-python",
            name: "student_homework_fibonacci.py",
            fileType: "txt",
            size: "1.2 KB",
            timestamp: "01:45 PM",
            expectedVerdict: "irrelevant",
            title: "Introductory Python Assignment: Recursion",
            author: "Student Workstation Cache",
            sourceDevice: "Workstation Terminal 09",
            content: `def fibonacci(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(f"Fib({i}) = {fibonacci(i)}")`,
          },
        ],
      },
    ],
  },

  library: {
    roomId: "library",
    roomName: "School Library",
    description: "Repository of archives, research periodicals, and catalog computers.",
    folders: [
      {
        id: "lib-circulation",
        folderName: "catalog_and_loans",
        files: [
          {
            id: "file-lib-loans",
            name: "daily_circulation_log_oct26.csv",
            fileType: "log",
            size: "5.8 KB",
            timestamp: "03:00 PM",
            caseId: 2,
            checklistId: "c2-item-3",
            expectedVerdict: "irrelevant",
            title: "Library Book Loan & Return Log",
            author: "Head Librarian Desk",
            sourceDevice: "Circulation PC",
            content: `ISBN,Book Title,Borrower,Due Date
978-0131103627,The C Programming Language,Marcus Vance,Nov 02
978-0201896831,The Art of Computer Programming,Prof. Santos,Nov 09
978-0321573513,Algorithms 4th Edition,Samantha Morales,Nov 02
978-0132350884,Clean Code,Alex Rivera,Nov 05`,
          },
          {
            id: "file-lib-history",
            name: "school_centennial_chronicle.txt",
            fileType: "txt",
            size: "12.4 KB",
            timestamp: "Archived 2026",
            expectedVerdict: "irrelevant",
            title: "Centennial History of Saint Jude Academy",
            author: "Campus Historical Society",
            sourceDevice: "Digital Archive Repository",
            content: `Founded in 1926 as a premier secondary science institution, the academy began with just three wooden classrooms and twenty-five students. Over a century of academic excellence, the school expanded to modern laboratory wings, digital computer centers, and competitive athletics.`,
          },
        ],
      },
    ],
  },

  faculty_room: {
    roomId: "faculty_room",
    roomName: "Faculty Room",
    description: "Teacher office. Contains physical sign-in rosters, staff chore boards, and lesson plans.",
    folders: [
      {
        id: "fac-attendance",
        folderName: "physical_attendance_records",
        files: [
          {
            id: "file-fac-track-sheet",
            name: "senior_athletics_sign_in_sheet.txt",
            fileType: "roster",
            size: "4.3 KB",
            timestamp: "03:30 PM",
            caseId: 3,
            checklistId: "c3-item-1",
            expectedVerdict: "verified_true",
            title: "Varsity Athletics In-Person Roll-Call Ledger",
            author: "Coach Gregory Miller (Head Track Coach)",
            sourceDevice: "Physical Paper Binder (Hand-Signed)",
            content: `PHYSICAL EDUCATION & ATHLETICS ROLL CALL
DEPARTMENT: Senior Varsity Track & Field
DATE: Today, October 26
LOCATION: Sports Gymnasium & Running Track

MANDATORY PRACTICE COMMENCEMENT: Exactly 03:30 PM
STUDENT ROSTER & PHYSICAL VERIFICATION:
- Martinez, Carlos [Present - 03:25 PM]
- Rivera, Alex (Student Badge #5510) [PRESENT IN PERSON AT 03:30 PM]
  * Note by Coach Miller: Alex arrived at track locker room at 03:25 PM and was physically running SPRINT drills under my direct observation from 03:30 PM until 05:00 PM.
- Zhao, Kevin [Present - 03:28 PM]

COACH CERTIFICATION:
I hereby certify with my personal signature that Student Alex Rivera was physically present on the athletics field practicing varsity SPRINT events.`,
            revealCodeHint: "SPRINT",
          },
          {
            id: "file-fac-gym-checkout",
            name: "gym_equipment_loan_slip.txt",
            fileType: "roster",
            size: "3.1 KB",
            timestamp: "03:30 PM",
            caseId: 3,
            checklistId: "c3-item-3",
            expectedVerdict: "verified_true",
            title: "Varsity Athletics Equipment Checkout Slip",
            author: "Athletics Equipment Room Custodian",
            sourceDevice: "Locker Room Clipboard",
            content: `EQUIPMENT ISSUE SLIP:
DATE: Today, 03:30 PM
BORROWER: Alex Rivera (Track Team Captain)
ITEMS ISSUED: 2x Electronic Stopwatches, 1x SPRINT Spikes & Baton Set.
PHYSICAL SIGNATURE: Alex Rivera (Signed in person at athletics counter for SPRINT practice).

VERIFIED ALIBI:
Student was physically at the athletics counter for SPRINT equipment checkout.`,
            revealCodeHint: "SPRINT",
          },
          {
            id: "file-fac-chores",
            name: "faculty_kitchen_chore_chart.txt",
            fileType: "txt",
            size: "2.1 KB",
            timestamp: "Monday, 09:00 AM",
            caseId: 3,
            checklistId: "c3-item-5",
            expectedVerdict: "irrelevant",
            title: "Faculty Staff Kitchen & Coffee Machine Duty",
            author: "Faculty Welfare Committee",
            sourceDevice: "Staff Room Whiteboard",
            content: `WEEKLY STAFF ROOM DUTY ROSTER:
- Monday: Mr. Santos (Chemistry) - Empty coffee grounds & wipe counters.
- Tuesday: Ms. Vance (History) - Restock milk and sugar supplies.
- Wednesday: Dr. Thorne (Physics) - Clean microwave interior.
- Thursday: Coach Miller (PE) - Water indoor plants.
- Friday: Nurse Gallagher (Clinic) - Disinfect refrigerator door handle.`,
          },
        ],
      },
    ],
  },

  security_office: {
    roomId: "security_office",
    roomName: "Security Office",
    description: "Guard command post. Features door access logs, CCTV feeds, and lost property reports.",
    folders: [
      {
        id: "sec-keycard-audit",
        folderName: "access_card_incident_logs",
        files: [
          {
            id: "file-sec-lost-card",
            name: "lost_card_report_badge_5510.txt",
            fileType: "log",
            size: "3.9 KB",
            timestamp: "3 Days Ago, 08:15 AM",
            caseId: 3,
            checklistId: "c3-item-2",
            expectedVerdict: "flagged_hallucination",
            title: "Security Incident Report: Lost NFC Badge #5510",
            author: "Officer Ramirez (Campus Security Guard)",
            sourceDevice: "Security Master Terminal (SEC-DESK-01)",
            content: `CAMPUS SECURITY INCIDENT REPORT #882
DATE OF FILING: 3 Days Ago, 08:15 AM
SUBJECT: Reported Stolen / Missing NFC Keycard

DETAILS:
Student Alex Rivera reported that his school ID keycard (#5510) slipped out of his gym bag and was lost somewhere near the campus grandstand 3 days ago.
A temporary paper pass was issued to Alex.
The physical card #5510 was marked for system deactivation.

SECURITY ANOMALY DETECTED TODAY AT 03:40 PM:
An electronic door sensor at the Faculty Room recorded a swipe from card #5510. However, CCTV camera #02 recorded a different unidentified individual swiping the lost card!

ECHO'S FLAWED INFERENCE:
ECHO concluded Alex Rivera was an unauthorized 'INTRUDER' solely based on the electronic card swipe #5510, failing to recognize that the card had been reported lost 3 days earlier!`,
          },
          {
            id: "file-sec-stranger-cctv",
            name: "camera_02_card_swipe_audit.log",
            fileType: "log",
            size: "4.5 KB",
            timestamp: "03:40 PM",
            caseId: 3,
            checklistId: "c3-item-4",
            expectedVerdict: "flagged_hallucination",
            title: "Camera 02 Faculty Door NFC Swipe Review",
            author: "Surveillance Audit Subsystem",
            sourceDevice: "CCTV NVR Server",
            content: `EVENT AUDIT: Card #5510 swiped at Faculty Room at 03:40 PM.
VIDEO STILL CORRELATION:
Camera 02 captured a tall hooded figure swiping the card, NOT the cardholder Alex Rivera (who is 5'7" and was on the track oval).
CONCLUSION:
The card was swiped by an unknown individual using the lost card reported missing 3 days ago. ECHO's attribution to Alex Rivera is a hallucination.`,
          },
          {
            id: "file-sec-cctv",
            name: "hallway_cctv_motion_events.log",
            fileType: "log",
            size: "8.5 KB",
            timestamp: "04:10 PM",
            expectedVerdict: "irrelevant",
            title: "CCTV Camera Motion Sensor Journal",
            author: "Automated NVR Surveillance Server",
            sourceDevice: "Security CCTV Matrix",
            content: `SURVEILLANCE RECORDER MOTION DETECTIONS:
- 03:15:22 Cam-01 (Main Lobby): 2 students walking toward Library.
- 03:32:10 Cam-04 (Athletics Gate): Track team sprinting on oval.
- 03:45:00 Cam-02 (Central Hallway): Public address speakers activating.
- 04:02:18 Cam-03 (Clinic Door): Student entering Clinic with limp.`,
          },
        ],
      },
    ],
  },

  canteen: {
    roomId: "canteen",
    roomName: "School Canteen",
    description: "Cafeteria dining hall. Contains register logs, receipt journals, and daily meal menus.",
    folders: [
      {
        id: "cant-registers",
        folderName: "pos_transaction_journals",
        files: [
          {
            id: "file-cant-pos-drift",
            name: "cashier_register_01_journal.txt",
            fileType: "log",
            size: "5.2 KB",
            timestamp: "04:30 PM (DESYNCHRONIZED)",
            caseId: 4,
            checklistId: "c4-item-1",
            expectedVerdict: "flagged_hallucination",
            title: "Cafeteria POS Cashier Journal #4300",
            author: "POS Terminal #01 Hardware Firmware",
            sourceDevice: "Register #01 (Offline Standalone Cash Register)",
            content: `CAMPUS CANTEEN TRANSACTION JOURNAL
REGISTER ID: CASHIER-01
TRANSACTION SEQ: #4300
SYSTEM CLOCK TIMESTAMP: 04:30 PM (UNVERIFIED)

ITEMS PURCHASED:
1x Fresh Orange Juice (35 PHP)
1x Toasted Cheese Sandwich (45 PHP)
TOTAL PAID: 80 PHP (Cash)

[CRITICAL HARDWARE SYSTEM WARNING]:
** RTC CMOS CLOCK BATTERY EXPIRED **
INTERNAL HARDWARE CLOCK DRIFT: +25 MINUTES 00 SECONDS.
Terminal is running standalone without network NTP server synchronization.
ACTUAL REAL-WORLD TIME OF TRANSACTION: Exactly 04:05 PM!

ECHO'S FLAWED PREMISE:
ECHO relied on this drifting POS clock to allege that a sudden emergency 'CRISIS' escalated at 04:30 PM, completely failing to inspect the hardware clock error warning!`,
          },
          {
            id: "file-cant-wall-clock",
            name: "cafeteria_analog_clock_inspection.txt",
            fileType: "txt",
            size: "2.1 KB",
            timestamp: "04:30 PM (DRIFT)",
            caseId: 4,
            checklistId: "c4-item-4",
            expectedVerdict: "flagged_hallucination",
            title: "Cafeteria Wall Clock Maintenance Note",
            author: "Cafeteria Supervisor",
            sourceDevice: "Maintenance Sticky Note",
            content: `NOTE ON DINING HALL WALL CLOCK:
Battery was replaced with an old rechargeable AA cell last month.
Clock was observed skipping ticks and drifting +25 minutes fast compared to cell phones.
Do not rely on this clock for class bell timing!`,
          },
          {
            id: "file-cant-menu",
            name: "cafeteria_weekly_menu.txt",
            fileType: "txt",
            size: "2.4 KB",
            timestamp: "07:00 AM",
            caseId: 4,
            checklistId: "c4-item-5",
            expectedVerdict: "irrelevant",
            title: "Weekly Healthy School Meal Menu",
            author: "Head Cafeteria Chef",
            sourceDevice: "Cafeteria Notice Board",
            content: `DAILY LUNCH SPECIALS:
- Monday: Chicken Teriyaki with Steamed Rice (65 PHP)
- Tuesday: Beef Bolognese Pasta with Garlic Toast (70 PHP)
- Wednesday: Grilled Fish Fillet with Mashed Potatoes (75 PHP)
- Thursday: Roast Pork with Vegetables (70 PHP)
- Friday: Vegetable Curry with Tofu (60 PHP)`,
          },
        ],
      },
    ],
  },

  clinic: {
    roomId: "clinic",
    roomName: "School Clinic",
    description: "Medical office. Houses patient intake sheets, medical supplies, and atomic-synced logs.",
    folders: [
      {
        id: "clinic-patient-records",
        folderName: "medical_intake_journals",
        files: [
          {
            id: "file-clinic-ntp-log",
            name: "patient_intake_atomic_ntp.log",
            fileType: "log",
            size: "4.7 KB",
            timestamp: "04:05 PM",
            caseId: 4,
            checklistId: "c4-item-2",
            expectedVerdict: "verified_true",
            title: "Clinic Atomic-Synchronized Patient Intake Log",
            author: "Nurse Gallagher (RN) & National NTP Time Service",
            sourceDevice: "Clinic Healthcare Terminal (NTP-SYNC-01)",
            content: `SCHOOL HEALTH CLINIC - CERTIFIED PATIENT INTAKE
LOG ENTRY NUMBER: #0405
TIMESTAMP: Today, exactly 04:05 PM
TIME SYNCHRONIZATION: Direct Atomic Clock Feed (pool.ntp.org)
CLOCK ACCURACY: Synchronized within 0.001 seconds.

PATIENT RECORD:
- Student: Carlos Martinez (Senior Track Team)
- Chief Complaint: Mild right ankle sprain sustained during practice.
- Treatment: Cold ice compress applied, elevation, soothing herbal REMEDY bandage.
- Accompanied by: Team student who bought juice from canteen at 04:05 PM.

AUTHENTICATION SUMMARY:
This certified atomic intake confirms the true time of the canteen purchase was 04:05 PM. The medical treatment provided to relieve pain was an herbal REMEDY.`,
            revealCodeHint: "REMEDY",
          },
          {
            id: "file-clinic-dispensary-stamp",
            name: "dispensary_treatment_stamp.txt",
            fileType: "log",
            size: "3.4 KB",
            timestamp: "04:05 PM",
            caseId: 4,
            checklistId: "c4-item-3",
            expectedVerdict: "verified_true",
            title: "Dispensary Certified Medication Stamp",
            author: "Clinic Healthcare Assistant",
            sourceDevice: "Pharmacy Sign-out Desk",
            content: `MEDICATION DISPENSATION RECORD:
PATIENT INTAKE: #0405
TIMESTAMP: Today, 04:05 PM (NTP Atomic Synchronized)
MEDICATION: Ibuprofen 200mg, Soothing Herbal REMEDY Cold Compress.
NURSE SIGNATURE: Gallagher (RN).

CONFIRMATION:
Medical intake confirms authorized administration of restorative REMEDY.`,
            revealCodeHint: "REMEDY",
          },
          {
            id: "file-clinic-first-aid",
            name: "medical_inventory_supplies.csv",
            fileType: "conf",
            size: "3.1 KB",
            timestamp: "09:00 AM",
            expectedVerdict: "irrelevant",
            title: "Clinic Emergency First Aid Supplies Inventory",
            author: "Nurse Gallagher (RN)",
            sourceDevice: "Clinic Desktop",
            content: `Item Name,Current Stock,Minimum Threshold,Unit
Elastic Bandages 3-inch,24,10,Rolls
Sterile Gauze Pads 4x4,150,50,Pads
Antiseptic Povidone Iodine,8,3,Bottles
Adhesive Bandage Strips,200,100,Pieces
Ice Cold Packs,18,6,Packs`,
          },
        ],
      },
    ],
  },

  science_lab: {
    roomId: "science_lab",
    roomName: "Science Laboratory",
    description: "Laboratory wing. Features chemical hoods, particulate sensors, and safety binders.",
    folders: [
      {
        id: "sci-telemetry",
        folderName: "environmental_sensor_telemetry",
        files: [
          {
            id: "file-sci-particulate",
            name: "air_quality_particulate_spike.log",
            fileType: "log",
            size: "6.3 KB",
            timestamp: "04:22 PM",
            caseId: 5,
            checklistId: "c5-item-2",
            expectedVerdict: "flagged_hallucination",
            title: "Environmental Gas & Particulate Sensor Node #04",
            author: "Lab Atmospheric Monitor Hardware Firmware",
            sourceDevice: "Science Lab Ceiling Sensor Unit",
            content: `ATMOSPHERIC MONITORING JOURNAL: LAB ROOM 07
TIMESTAMP: Today, 04:22 PM

TELEMETRY SENSOR READINGS:
- Oxygen (O2): 20.9% [Normal]
- Carbon Monoxide (CO): 0.1 ppm [Normal]
- Hazardous Volatile Organics (VOC): 0.00 ppm [NO CHEMICAL THREAT]
- Particulate Matter (PM10): 420 ug/m3 [SPIKE DETECTED]
  * Chemical Spectrometry: Non-toxic mineral fiberglass & cellulose dust.

ANALYSIS:
The particulate spike was purely harmless physical dust blown into the lab room when the central HVAC vent filter was vacuumed during maintenance.

ECHO'S FLAWED ALARM:
ECHO misinterpreted harmless HVAC dust as intentional chemical 'SABOTAGE', generating a false emergency lockdown passcode!`,
          },
          {
            id: "file-sci-alarm-trigger",
            name: "automated_alarm_trigger_sensor9110.log",
            fileType: "log",
            size: "4.9 KB",
            timestamp: "04:22 PM",
            caseId: 5,
            checklistId: "c5-item-4",
            expectedVerdict: "flagged_hallucination",
            title: "Sensor 9110 Threshold Trigger Trace",
            author: "Automated Life Safety System",
            sourceDevice: "Ceiling Alarm Node 9110",
            content: `ALARM NODE 9110 EVENT TRACE:
Reading: 420 ug/m3 particulate matter.
Trigger Code: SABOTAGE (Threshold Exceeded).
ANALYSIS OF SENSOR ERROR:
The optical sensor was uncalibrated for humidity and interpreted airborne cellulose dust from duct vacuuming as a hazardous substance. Spectrometry confirmed NO toxic chemicals.
ECHO's claim of SABOTAGE was based on this faulty alarm trigger.`,
          },
          {
            id: "file-sci-safety-manual",
            name: "chemical_hygiene_guidelines.pdf",
            fileType: "pdf",
            size: "18.2 KB",
            timestamp: "Term Start",
            caseId: 5,
            checklistId: "c5-item-5",
            expectedVerdict: "irrelevant",
            title: "Laboratory Chemical Safety & Eyewash Protocol",
            author: "National Science Educators Association",
            sourceDevice: "Wall Binder",
            content: `LABORATORY HYGIENE & SAFETY PROTOCOLS:
1. Approved splash goggles must be worn during all acid-base titration experiments.
2. In the event of skin contact with reagents, immediately flush the affected area with water for 15 minutes.
3. Dispose of organic solvents in designated red waste carboys under the fume hood.
4. Chemical storage cabinets must remain locked when instructors are not present.`,
          },
        ],
      },
    ],
  },

  principals_office: {
    roomId: "principals_office",
    roomName: "Principal's Office",
    description: "Executive executive suite. Holds facility maintenance tickets, contracts, and campus safe.",
    folders: [
      {
        id: "pr-facilities",
        folderName: "facility_maintenance_contracts",
        files: [
          {
            id: "file-pr-hvac-ticket",
            name: "hvac_work_order_ticket_4200.txt",
            fileType: "txt",
            size: "5.1 KB",
            timestamp: "04:20 PM",
            caseId: 5,
            checklistId: "c5-item-1",
            expectedVerdict: "verified_true",
            title: "Authorized Campus Infrastructure Work Order #4200",
            author: "Vice Principal for Campus Facilities & Metro Air Services",
            sourceDevice: "Administrative Work Order Filing System",
            content: `CAMPUS INFRASTRUCTURE & MAINTENANCE WORK ORDER
WORK ORDER NUMBER: #4200
DATE: Today, October 26
AUTHORIZED START TIME: Exactly 04:20 PM

CONTRACTOR DETAILS:
- Vendor: Metro Air & Ventilation Maintenance Corp.
- Lead Technician: Robert Hayes (Contractor ID: HVAC-77)
- SCOPE OF WORK: Quarterly high-powered vacuuming and FILTER replacement for the Science Wing ventilation shafts.
- TECHNICIAN NOTE (04:20 PM): Commencing intake FILTER cleaning in science lab duct sector. Harmless cellulose dust discharge anticipated for 10 minutes.

ADMINISTRATIVE APPROVAL:
Signed and stamped by Vice Principal for Campus Operations.
The service performed under this contract is authorized air FILTER maintenance.`,
            revealCodeHint: "FILTER",
          },
          {
            id: "file-pr-contractor-pass",
            name: "facility_contractor_entry_pass.txt",
            fileType: "txt",
            size: "3.8 KB",
            timestamp: "04:20 PM",
            caseId: 5,
            checklistId: "c5-item-3",
            expectedVerdict: "verified_true",
            title: "Facility Gate Pass: Metro Air Maintenance",
            author: "Campus Gate Security & Facilities Office",
            sourceDevice: "Visitor Reception Desk",
            content: `CAMPUS CONTRACTOR ENTRY PASS:
TICKET: Work Order #4200
CONTRACTOR: Metro Air Services (Robert Hayes)
ENTRY TIME: Today, 04:20 PM
PURPOSE: Duct vacuum and intake ventilation FILTER replacement in Science Wing.
APPROVED PASS STATUS: Validated.

CONFIRMATION:
Routine maintenance for HVAC unit FILTER began at 04:20 PM.`,
            revealCodeHint: "FILTER",
          },
          {
            id: "file-pr-board",
            name: "board_of_trustees_resolution.pdf",
            fileType: "pdf",
            size: "8.9 KB",
            timestamp: "September 15",
            expectedVerdict: "irrelevant",
            title: "Board of Trustees Resolution: Campus Renovation",
            author: "Board Secretariat",
            sourceDevice: "Principal Executive Safe",
            content: `RESOLUTION NO. 2026-08:
Be it resolved that the Academy approves the phase 2 renovation of the student athletic grandstand, allocating funds from the campus infrastructure endowment fund.`,
          },
        ],
      },
    ],
  },
};
