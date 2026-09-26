import io
import time
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_child_observational_report(profile: dict, progress: dict, events: list, days: int = 7) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0284c7'),
        alignment=0
    )

    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155')
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#475569')
    )

    elements = []

    # Header Title
    elements.append(Paragraph("INTERACTIVE SKILL ENHANCER", subtitle_style))
    elements.append(Spacer(1, 2))
    elements.append(Paragraph("Child Learning & Interaction Observational Report", title_style))
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("Educational & Observational Support Summary for Parents, Caregivers & Educators", disclaimer_style))
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=12))

    # 1. Child & Profile Information
    elements.append(Paragraph("1. Child & Profile Information", heading_style))
    child_name = profile.get("name") or profile.get("email") or "Learner"
    report_date = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    profile_table_data = [
        [Paragraph("<b>Child Name:</b>", body_style), Paragraph(str(child_name), body_style),
         Paragraph("<b>Report Date:</b>", body_style), Paragraph(str(report_date), body_style)],
        [Paragraph("<b>Age:</b>", body_style), Paragraph(str(profile.get("age", "N/A")), body_style),
         Paragraph("<b>Reporting Period:</b>", body_style), Paragraph(f"Last {days} Days", body_style)],
        [Paragraph("<b>Preferred Language:</b>", body_style), Paragraph(str(profile.get("language", "English")), body_style),
         Paragraph("<b>Support Needs:</b>", body_style), Paragraph(str(profile.get("autismLevel", "User-provided profile")), body_style)],
        [Paragraph("<b>Parent / Guardian:</b>", body_style), Paragraph(str(profile.get("parent", "N/A")), body_style),
         Paragraph("<b>Emergency Contact:</b>", body_style), Paragraph(str(profile.get("contact", "N/A")), body_style)],
    ]

    t_profile = Table(profile_table_data, colWidths=[110, 150, 110, 170])
    t_profile.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_profile)
    elements.append(Spacer(1, 12))

    # 2. Measured Learning Summary
    elements.append(Paragraph("2. Measured Learning Activity Summary", heading_style))
    summary_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Observed Value</b>", body_style)],
        [Paragraph("Completed Activities / Exercises", body_style), Paragraph(str(progress.get("completedActivities", 0)), body_style)],
        [Paragraph("AI Tutor Interaction Sessions", body_style), Paragraph(str(progress.get("aiSessionsCount", 0)), body_style)],
        [Paragraph("Active Learning Time (Minutes)", body_style), Paragraph(f"{progress.get('learningTimeMinutes', 0)} mins", body_style)],
        [Paragraph("Active Days (Streak)", body_style), Paragraph(f"{progress.get('streakDays', 0)} days", body_style)],
        [Paragraph("Total Interaction Events Recorded", body_style), Paragraph(str(progress.get("totalEventsCount", 0)), body_style)],
    ]

    t_summary = Table(summary_data, colWidths=[320, 220])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e0f2fe')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_summary)
    elements.append(Spacer(1, 12))

    # 3. Subject Mastery Breakdown
    elements.append(Paragraph("3. Subject Progress Breakdown", heading_style))
    subjects = progress.get("subjectProgress", [])
    if subjects:
        subj_rows = [[Paragraph("<b>Subject Area</b>", body_style), Paragraph("<b>Estimated Progress %</b>", body_style)]]
        for s in subjects:
            subj_rows.append([Paragraph(s.get("subject", ""), body_style), Paragraph(f"{s.get('progress', 0)}%", body_style)])

        t_subj = Table(subj_rows, colWidths=[320, 220])
        t_subj.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_subj)
    else:
        elements.append(Paragraph("<i>No subject activities recorded during this period.</i>", body_style))

    elements.append(Spacer(1, 12))

    # 4. Affective Cue & Facial Expression Observations
    elements.append(Paragraph("4. Model-Estimated Facial Expression & Affective Cues", heading_style))
    elements.append(Paragraph("<b>Notice:</b> The table below presents automated facial-expression estimates generated by the computer vision model during active sessions. These are observational model estimates and do NOT constitute confirmed internal emotional states or psychological evaluations.", disclaimer_style))
    elements.append(Spacer(1, 6))

    recent_emotions = progress.get("recentEmotions", [])
    if recent_emotions:
        emo_rows = [[Paragraph("<b>Timestamp / Log</b>", body_style), Paragraph("<b>Estimated Expression Category</b>", body_style), Paragraph("<b>Model Confidence</b>", body_style)]]
        for emo in recent_emotions:
            emo_rows.append([
                Paragraph(str(emo.get("time", "Session")), body_style),
                Paragraph(str(emo.get("emotion", "Focused")), body_style),
                Paragraph(f"{emo.get('confidence', 85.0)}%", body_style)
            ])

        t_emo = Table(emo_rows, colWidths=[180, 220, 140])
        t_emo.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#fef3c7')),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(t_emo)
    else:
        elements.append(Paragraph("<i>No camera facial cue observations recorded during this period.</i>", body_style))

    elements.append(Spacer(1, 14))

    # 5. Clinical & Methodological Limitations Disclaimer
    elements.append(Paragraph("5. Methodological Limitations & Disclaimer", heading_style))
    limitation_box_data = [[
        Paragraph(
            "<b>IMPORTANT CLINICAL DISCLAIMER:</b><br/>"
            "1. This document is strictly an <b>educational and observational support report</b> generated from interactive software.<br/>"
            "2. This application <b>does NOT diagnose autism</b>, clinical anxiety, depression, or any medical condition.<br/>"
            "3. Facial expression predictions are machine learning estimates. Accuracy may vary depending on camera position, lighting conditions, facial visibility, and individual neurodivergent expression traits.<br/>"
            "4. All interaction data should be interpreted in context by qualified healthcare professionals, therapists, parents, or certified educators.",
            disclaimer_style
        )
    ]]
    t_limit = Table(limitation_box_data, colWidths=[540])
    t_limit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fff1f2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#f43f5e')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(t_limit)

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
