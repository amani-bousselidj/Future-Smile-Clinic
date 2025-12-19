from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from django.http import HttpResponse
from django.utils import timezone
from .models import Appointment, Patient
import io


def generate_appointment_report_pdf(appointment_id):
    """Generate PDF report for a single appointment"""
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return None

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=inch, leftMargin=inch,
                           topMargin=inch, bottomMargin=inch)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom RTL style for Arabic
    rtl_style = ParagraphStyle(
        'RTL',
        parent=styles['Normal'],
        alignment=TA_RIGHT,
        fontSize=12,
    )
    
    title_style = ParagraphStyle(
        'RTLTitle',
        parent=styles['Title'],
        alignment=TA_CENTER,
        fontSize=18,
        fontName='Helvetica-Bold',
    )
    
    # Title
    elements.append(Paragraph("Future Smile Clinic - Appointment Report", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Appointment Details Table
    data = [
        ['Appointment Details', ''],
        ['Patient Name:', appointment.patient.full_name],
        ['Phone:', appointment.patient.phone],
        ['Email:', appointment.patient.email or 'N/A'],
        ['Service:', appointment.service.name if appointment.service else 'N/A'],
        ['Date:', str(appointment.appointment_date)],
        ['Time:', str(appointment.appointment_time)],
        ['Status:', appointment.get_status_display()],
        ['Notes:', appointment.notes or 'None'],
    ]
    
    table = Table(data, colWidths=[2.5*inch, 4*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_text = f"Generated on: {timezone.now().strftime('%Y-%m-%d %H:%M')}"
    elements.append(Paragraph(footer_text, styles['Normal']))
    
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    
    return pdf


def generate_patient_report_pdf(patient_id):
    """Generate PDF report for a patient with appointment history"""
    try:
        patient = Patient.objects.get(id=patient_id)
    except Patient.DoesNotExist:
        return None

    appointments = Appointment.objects.filter(patient=patient).order_by('-appointment_date')
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=inch, leftMargin=inch,
                           topMargin=inch, bottomMargin=inch)
    
    elements = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'RTLTitle',
        parent=styles['Title'],
        alignment=TA_CENTER,
        fontSize=18,
        fontName='Helvetica-Bold',
    )
    
    # Title
    elements.append(Paragraph("Future Smile Clinic - Patient Report", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Patient Details Table
    patient_data = [
        ['Patient Information', ''],
        ['Full Name:', patient.full_name],
        ['Phone:', patient.phone],
        ['Email:', patient.email or 'N/A'],
        ['Date of Birth:', str(patient.date_of_birth) if patient.date_of_birth else 'N/A'],
        ['Address:', patient.address or 'N/A'],
    ]
    
    patient_table = Table(patient_data, colWidths=[2.5*inch, 4*inch])
    patient_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(patient_table)
    elements.append(Spacer(1, 0.4*inch))
    
    # Medical History
    if patient.medical_history:
        elements.append(Paragraph("<b>Medical History:</b>", styles['Heading2']))
        elements.append(Paragraph(patient.medical_history, styles['Normal']))
        elements.append(Spacer(1, 0.3*inch))
    
    # Appointments History
    if appointments.exists():
        elements.append(Paragraph("<b>Appointment History:</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.2*inch))
        
        appointment_data = [['Date', 'Time', 'Service', 'Status']]
        for apt in appointments:
            appointment_data.append([
                str(apt.appointment_date),
                str(apt.appointment_time),
                apt.service.name if apt.service else 'N/A',
                apt.get_status_display()
            ])
        
        apt_table = Table(appointment_data, colWidths=[1.5*inch, 1.2*inch, 2.3*inch, 1.5*inch])
        apt_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        
        elements.append(apt_table)
    else:
        elements.append(Paragraph("No appointment history available.", styles['Normal']))
    
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_text = f"Generated on: {timezone.now().strftime('%Y-%m-%d %H:%M')}"
    elements.append(Paragraph(footer_text, styles['Normal']))
    
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    
    return pdf
