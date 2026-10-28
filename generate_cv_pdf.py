import os

def generate_authentic_cv():
    out1 = r"C:\Users\Ian Kiromo\.gemini\antigravity-ide\scratch\graduation-rsvp\Ian_Kiromo_Githengu_CV.pdf"
    out2 = r"D:\Graduation-RSVP\Ian_Kiromo_Githengu_CV.pdf"

    # Clean multi-page PDF 1.4
    # Page 1: Contact, Education, Skills, Professional Summary, Work Experience (Health Strat), Projects (Phone Repair, Cleanash)
    # Page 2: Projects (Phone Mart POS, Project PhishSim), Certifications, Leadership, Referees

    # PAGE 1 STREAM
    p1_lines = [
        "BT",
        # Top Header (Name)
        "/F2 26 Tf",
        "50 780 Td",
        "(IAN KIROMO) Tj",
        "0 -22 Td",
        "/F1 11 Tf",
        "(B.Sc. in Applied Computer Science | Full-Stack & Cloud Engineer) Tj",
        "0 -16 Td",
        "/F1 9 Tf",
        "(Nairobi, Kenya  |  +254 796059830 / +254 780433596  |  ikiromo9@gmail.com  |  linkedin.com/in/ian-kiromo-2a1239371/) Tj",
        "0 -26 Td",

        # Professional Summary
        "/F2 12 Tf",
        "(PROFESSIONAL SUMMARY) Tj",
        "0 -14 Td",
        "/F1 9.5 Tf",
        "(Applied Computer Science professional with practical experience in full-stack development (React, Flutter, PHP)) Tj",
        "0 -13 Td",
        "(and enterprise networking. Recently completed an intensive attachment at Health Strat, deploying cloud applications) Tj",
        "0 -13 Td",
        "(on Azure and managing network infrastructure. Passionate about cybersecurity, with hands-on training in penetration) Tj",
        "0 -13 Td",
        "(testing and SQL injection analysis. Seeking to leverage technical skills in building secure systems and protecting infrastructure.) Tj",
        "0 -24 Td",

        # Education
        "/F2 12 Tf",
        "(EDUCATION) Tj",
        "0 -15 Td",
        "/F2 10 Tf",
        "(Daystar University - School of Science, Engineering & Health) Tj",
        "0 -13 Td",
        "/F1 9.5 Tf",
        "(Bachelor of Science in Applied Computer Science (May 2023 - September 2026)) Tj",
        "0 -24 Td",

        # Technical Skills
        "/F2 12 Tf",
        "(TECHNICAL SKILLS) Tj",
        "0 -15 Td",
        "/F1 9 Tf",
        "(Programming & Tools: Visual Basic, Flutter, React, Laravel, Kali Linux, VMware, Burp Suite, SQL injection, Articulate, WordPress) Tj",
        "0 -13 Td",
        "(Operating Systems: Windows, Linux (Kali)  |  Backend: XAMPP (PHP backend), MySQL Flexible Server, Nginx) Tj",
        "0 -13 Td",
        "(Generative AI & Cloud: Google Gemini API Integration, Prompt Engineering, Microsoft Azure (Linux Web Apps, Entra ID)) Tj",
        "0 -13 Td",
        "(Physical Security & Hardware: Hikvision Ecosystem, IP Camera Configuration, NVR/DVR Management, Fault Diagnosis) Tj",
        "0 -24 Td",

        # Work Experience
        "/F2 12 Tf",
        "(WORK EXPERIENCE (Attachment)) Tj",
        "0 -15 Td",
        "/F2 10 Tf",
        "(ICT Trainee / Attache - Health Strat | Nairobi, Kenya (Sept 2025 - Dec 2025)) Tj",
        "0 -13 Td",
        "/F1 9 Tf",
        "(- Cloud & Infrastructure: Migrated PhoneMart application from local hosting to Microsoft Azure (Linux Web Apps)) Tj",
        "0 -12 Td",
        "(  and configured MySQL Flexible Servers and Nginx routing for production.) Tj",
        "0 -12 Td",
        "(- Network Security: Secured enterprise networks by configuring MikroTik routers (NAT, DHCP, Firewall rules) and port forwarding.) Tj",
        "0 -12 Td",
        "(- System Administration: Managed Active Directory (AD) user identities synchronized with Azure Entra ID and enforced MFA.) Tj",
        "0 -12 Td",
        "(- Full-Stack Development: Engineered POS backend using PHP, implementing Role-Based Access Control (RBAC).) Tj",
        "0 -12 Td",
        "(- Technical Support: Provided Level 1/2 support for hardware/software issues and developed interactive eLearning modules for NASCOP.) Tj",
        "0 -22 Td",

        # Projects Preview
        "/F2 12 Tf",
        "(PROJECTS) Tj",
        "0 -15 Td",
        "/F2 9.5 Tf",
        "(Phone Repair System (Visual Basic)) Tj",
        "0 -12 Td",
        "/F1 9 Tf",
        "(- Designed and developed a desktop application using Visual Basic to streamline phone repair workflows from intake to completion.) Tj",
        "0 -12 Td",
        "(- Created user-friendly forms for data entry and implemented logic to automate customer status updates and reporting.) Tj",
        "0 -16 Td",
        "/F2 9.5 Tf",
        "(Cleanash Robotics Project) Tj",
        "0 -12 Td",
        "/F1 9 Tf",
        "(- Collaborated in a DITA club project to build a functional cleaning robot, troubleshooting hardware under constrained resources.) Tj",
        "ET"
    ]

    # PAGE 2 STREAM
    p2_lines = [
        "BT",
        "/F2 14 Tf",
        "50 780 Td",
        "(FEATURED PROJECTS (Continued)) Tj",
        "0 -20 Td",
        "/F2 10 Tf",
        "(Phone Mart POS Project (React, Flutter, PHP, Azure, Gemini AI)) Tj",
        "0 -14 Td",
        "/F1 9 Tf",
        "(- Developed a Point of Sale (POS) system called Phone Mart, utilizing React for web interface and Flutter for mobile app development.) Tj",
        "0 -12 Td",
        "(- Built backend functionality using PHP with XAMPP; migrated system to Microsoft Azure cloud hosting with Nginx routing.) Tj",
        "0 -12 Td",
        "(- Integrated Google Gemini AI (LLM) to automatically generate news and content using the Gemini Generative AI API.) Tj",
        "0 -12 Td",
        "(- API Security: Implemented secure server-side key management (Environment Variables) to protect API credentials in production.) Tj",
        "0 -12 Td",
        "(- Data Visualization: Designed an interactive analytics dashboard to visualize sales trends and payment data.) Tj",
        "0 -22 Td",

        "/F2 10 Tf",
        "(Project PhishSim (AI-Driven Cybersecurity Simulation)) Tj",
        "0 -14 Td",
        "/F1 9 Tf",
        "(- AI-Driven Phishing Campaigns: Integrated Cerebras API into a Laravel backend to generate highly realistic localized phishing emails.) Tj",
        "0 -12 Td",
        "(- Organization-Specific SMTP: Configured dynamic SMTP protocols allowing SMEs to link corporate domains to dispatch simulations.) Tj",
        "0 -12 Td",
        "(- Vulnerability Tracking: Built React dashboard capturing real-time metrics, tracking and logging when users click malicious links.) Tj",
        "0 -12 Td",
        "(- Automated Training: Automated training pipeline directing employees who fail simulations to an interactive eLearning module.) Tj",
        "0 -24 Td",

        # Certifications
        "/F2 12 Tf",
        "(CERTIFICATIONS & PROFESSIONAL TRAINING) Tj",
        "0 -16 Td",
        "/F1 9 Tf",
        "(- IBM 10 Weeks Cybersecurity Professional Certificate: Completed (credly.com/users/ian-kiromo)) Tj",
        "0 -13 Td",
        "(- Claude Partner Network: Completed Anthropic learning path, including Agent Skills and MCP courses (May 2026).) Tj",
        "0 -13 Td",
        "(- AI & Agentic Workflows: Completed Agentic AI Hands-on via Cognitive Class / IBM Skills Network (May 2026).) Tj",
        "0 -13 Td",
        "(- TryHackMe Certification: Developing expertise in penetration testing and cybersecurity tooling.) Tj",
        "0 -24 Td",

        # Leadership
        "/F2 12 Tf",
        "(LEADERSHIP & INVOLVEMENT) Tj",
        "0 -16 Td",
        "/F2 9.5 Tf",
        "(Member - Daystar Information Technology Association (DITA)) Tj",
        "0 -13 Td",
        "/F1 9 Tf",
        "(- Engaged in collaborative IT projects, knowledge-sharing sessions, and technical workshops with peers in Applied CS and MIS.) Tj",
        "0 -26 Td",

        # Referees
        "/F2 12 Tf",
        "(ACADEMIC & PROFESSIONAL REFEREES) Tj",
        "0 -16 Td",
        "/F2 9.5 Tf",
        "(Dr. Jane Kimathi) Tj",
        "0 -12 Td",
        "/F1 8.5 Tf",
        "(Lecturer & Dean, School of Science, Engineering & Health | Daystar University | jkimathi@daystar.ac.ke | +254 720 423722) Tj",
        "0 -18 Td",
        "/F2 9.5 Tf",
        "(Eng. Derick Luvembe) Tj",
        "0 -12 Td",
        "/F1 8.5 Tf",
        "(Senior Infrastructure Lead - Health Strat | derekluve@gmail.com | +254 724 753 880) Tj",
        "0 -18 Td",
        "/F2 9.5 Tf",
        "(Mr. Edwin Ragira) Tj",
        "0 -12 Td",
        "/F1 8.5 Tf",
        "(Lecturer, HOD Computer Science Department | Daystar University | eosoro@daystar.ac.ke | +254 712 329618) Tj",
        "0 -18 Td",
        "/F2 9.5 Tf",
        "(Mr. Martine Opio Shikuku) Tj",
        "0 -12 Td",
        "/F1 8.5 Tf",
        "(IT Specialist | martineopiyo7@gmail.com | +254 748 871307) Tj",
        "ET"
    ]

    s1 = "\n".join(p1_lines).encode("latin1")
    s2 = "\n".join(p2_lines).encode("latin1")

    objects = [
        # 1: Catalog
        b"<< /Type /Catalog /Pages 2 0 R >>",
        # 2: Pages
        b"<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>",
        # 3: Page 1
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 5 0 R /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >> >>",
        # 4: Page 2
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 6 0 R /Resources << /Font << /F1 7 0 R /F2 8 0 R >> >> >>",
        # 5: Stream Page 1
        f"<< /Length {len(s1)} >>\nstream\n".encode("latin1") + s1 + b"\nendstream",
        # 6: Stream Page 2
        f"<< /Length {len(s2)} >>\nstream\n".encode("latin1") + s2 + b"\nendstream",
        # 7: Font F1 (Helvetica)
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        # 8: Font F2 (Helvetica-Bold)
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
    ]

    pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    for i, obj in enumerate(objects):
        offsets.append(len(pdf))
        pdf.extend(f"{i+1} 0 obj\n".encode("latin1"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    startxref = len(pdf)
    pdf.extend(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode("latin1"))
    for off in offsets:
        pdf.extend(f"{off:010d} 00000 n \n".encode("latin1"))

    pdf.extend(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{startxref}\n%%EOF".encode("latin1"))

    with open(out1, "wb") as f: f.write(pdf)
    with open(out2, "wb") as f: f.write(pdf)
    print(f"Generated authentic 2-page CV PDF: {len(pdf)} bytes")

if __name__ == "__main__":
    generate_authentic_cv()
