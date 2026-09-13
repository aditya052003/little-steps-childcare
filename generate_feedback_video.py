import os
import subprocess
import wave
import shutil
from PIL import Image, ImageDraw, ImageFont

FFMPEG_PATH = r"C:\Users\91766\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build\bin\ffmpeg.exe"

SLIDES = [
    {
        "id": 1,
        "tag": "PROJECT SUBMISSION & FEEDBACK VIDEO",
        "title": "Little Steps – Trusted 24×7 Childcare Platform",
        "subtitle": "Full-Stack Architecture, Live Demonstration & Technical Reflection",
        "author": "Presented by: Aditya | Unified Mentor / Academic Project Submission",
        "points": [
            "Continuous 24x7 Daycare, Crèche & Night-Shift Babysitting Network",
            "Multi-Tenant Experience: Parent, Provider & Administrative Dashboards",
            "Built with React 18, Vite, Tailwind CSS, Node.js & Express REST API",
            "Live URL: https://aditya052003.github.io/little-steps-childcare/"
        ],
        "script": "Hello everyone, my name is Aditya, and welcome to my project demonstration and feedback presentation for Little Steps - Trusted 24x7 Childcare Platform. Today, I am excited to walk you through the problem we solve, our live full-stack application, and my key technical learnings."
    },
    {
        "id": 2,
        "tag": "THE URBAN CRISIS & PROBLEM STATEMENT",
        "title": "Why 24×7 Childcare is an Urgent Necessity",
        "subtitle": "Closing the gap for modern working families and shift-work heroes",
        "author": "Domain: Early Childhood Infrastructure & Healthcare Support",
        "points": [
            "Healthcare & Shift Workers: Doctors, nurses, and IT engineers work night shifts",
            "Rigid Traditional Facilities: Conventional daycares close at 6:00 PM",
            "Trust Deficit: Extreme parental anxiety regarding unverified nighttime caregivers",
            "Inflexible Pricing: Parents forced into full-time contracts without drop-in options"
        ],
        "script": "Millions of modern parents work non-traditional hours, including hospital nurses, emergency doctors, and IT engineers on global night rotations. Traditional daycares rigidly close their doors at 6 PM, leaving families stranded. Little Steps solves this by building a trusted round-the-clock digital network with real-time capacity and verified caregivers."
    },
    {
        "id": 3,
        "tag": "PARENT EXPERIENCE & BOOKING ENGINE",
        "title": "Transparent Discovery & Real-Time Slot Booking",
        "subtitle": "Empowering parents with verified credentials and seamless reservations",
        "author": "Feature: Multi-Faceted Filtering, Infant Snooze Pods & Subscriptions",
        "points": [
            "24x7 Day & Night Toggle: Instant search for continuous care facilities",
            "Detailed Profiles: Pediatric CPR badges, soundproof snooze pods, HEPA filtration",
            "Interactive Booking Wizard: Hourly drop-in, full day, or night shift (7 PM to 7 AM)",
            "Active Subscriptions: Banked monthly care hours applied for zero-dollar checkout"
        ],
        "script": "On the parent portal, parents like Sarah can instantly search accredited facilities and toggle 24x7 Day and Night care. Each daycare showcases pediatric CPR certifications, soundproof snooze pods, and verified caregiver ratios. Parents can book an hourly drop-in or an entire overnight shift, with automatic subscription hour deductions for zero dollar checkouts."
    },
    {
        "id": 4,
        "tag": "PROVIDER OPERATIONS & SAFETY CONTROLS",
        "title": "Anti-Overbooking Guard & Attendance Desk",
        "subtitle": "Digitizing daycare facilities while enforcing statutory caregiver ratios",
        "author": "Feature: Room Capacity Automation & Request Approvals",
        "points": [
            "Strict Ratio Guards: Enforces 1:3 ratio for infants and 1:6 for toddlers",
            "Anti-Overbooking Algorithm: Server-side capacity locks prevent over-crowding",
            "Booking Request Inbox: Review child notes and one-click Accept or Decline",
            "Digital Attendance Desk: Timestamped Check-In and Check-Out security tracking"
        ],
        "script": "On the provider portal, daycare directors like Elena have complete operational control. Our anti-overbooking engine enforces legal caregiver-to-child ratios, such as 1 to 3 for infants, automatically preventing room capacity overflows. Directors can accept incoming reservations and operate a real-time digital attendance desk for child check-ins and check-outs."
    },
    {
        "id": 5,
        "tag": "REGULATORY COMPLIANCE & LEARNINGS",
        "title": "Admin Console & Technical Takeaways",
        "subtitle": "Building for high trust, regulatory compliance, and social impact",
        "author": "Presented by Aditya | Thank You for Watching!",
        "points": [
            "Document Verification Queue: Audit state licenses, fire safety & police records",
            "One-Click Accreditation: Instantly issues platform verified badges",
            "Full-Stack Competencies: Decoupled SPA + REST API, atomic JSON persistence",
            "Personal Reflection: Immense satisfaction creating technology for working parents"
        ],
        "script": "From the admin console, compliance officers audit submitted licenses and police clearances through an interactive document inspection modal before issuing verified badges. Building this platform taught me deep full-stack engineering skills in React, Node.js Express, concurrency controls, and designing for critical real-world social impact. Thank you for your time and evaluation!"
    }
]

TEMP_DIR = "temp_video_build"
os.makedirs(TEMP_DIR, exist_ok=True)

def generate_speech_audio(script_text, output_wav):
    escaped_text = script_text.replace('"', '`"')
    ps_cmd = f"""
    Add-Type -AssemblyName System.Speech;
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer;
    $synth.Rate = 0;
    $synth.SetOutputToWaveFile('{os.path.abspath(output_wav)}');
    $synth.Speak("{escaped_text}");
    $synth.Dispose();
    """
    subprocess.run(["powershell", "-Command", ps_cmd], check=True)

def get_audio_duration(wav_path):
    with wave.open(wav_path, 'rb') as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        return frames / float(rate)

def create_slide_image(slide_info, output_png):
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), color=(15, 23, 42)) # slate-900
    draw = ImageDraw.Draw(img)

    # Gradient top bar
    for y in range(8):
        draw.line([(0, y), (width, y)], fill=(255, 107, 107)) # coral brand

    # Load system fonts
    try:
        font_tag = ImageFont.truetype("arialbd.ttf", 22)
        font_title = ImageFont.truetype("arialbd.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_body = ImageFont.truetype("arial.ttf", 28)
        font_author = ImageFont.truetype("arialbd.ttf", 22)
    except Exception:
        font_tag = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_author = ImageFont.load_default()

    # Draw Tag Pill
    tag_text = slide_info["tag"]
    draw.rectangle([100, 70, 680, 115], fill=(30, 41, 59), outline=(71, 85, 105), width=2)
    draw.text((120, 80), tag_text, fill=(255, 107, 107), font=font_tag)

    # Draw Title & Subtitle
    draw.text((100, 140), slide_info["title"], fill=(255, 255, 255), font=font_title)
    draw.text((100, 205), slide_info["subtitle"], fill=(148, 163, 184), font=font_sub)

    # Draw Content Box
    draw.rectangle([100, 270, 1820, 930], fill=(30, 41, 59), outline=(51, 65, 85), width=2)

    # Draw Bullet Points
    y_offset = 330
    for idx, pt in enumerate(slide_info["points"]):
        # Bullet marker
        draw.ellipse([140, y_offset + 6, 156, y_offset + 22], fill=(16, 185, 129)) # emerald
        draw.text((180, y_offset), pt, fill=(241, 245, 249), font=font_body)
        y_offset += 120

    # Draw Footer Author Bar
    draw.rectangle([100, 950, 1820, 1010], fill=(15, 23, 42), outline=(71, 85, 105), width=1)
    draw.text((130, 968), slide_info["author"], fill=(148, 163, 184), font=font_author)
    draw.text((1600, 968), f"Slide {slide_info['id']} of 5", fill=(255, 107, 107), font=font_author)

    img.save(output_png)

def build_video():
    print("=== Starting Video Generation for Little Steps ===")
    segment_files = []

    for slide in SLIDES:
        sid = slide["id"]
        wav_path = os.path.join(TEMP_DIR, f"audio_{sid}.wav")
        png_path = os.path.join(TEMP_DIR, f"slide_{sid}.png")
        seg_mp4 = os.path.join(TEMP_DIR, f"segment_{sid}.mp4")

        print(f"Generating audio for slide {sid}...")
        generate_speech_audio(slide["script"], wav_path)
        duration = get_audio_duration(wav_path) + 0.8
        print(f"Slide {sid} duration: {duration:.2f} seconds")

        print(f"Rendering slide image {sid}...")
        create_slide_image(slide, png_path)

        print(f"Encoding segment {sid} via FFmpeg...")
        cmd = [
            FFMPEG_PATH,
            "-y",
            "-loop", "1",
            "-i", png_path,
            "-i", wav_path,
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-t", str(duration),
            seg_mp4
        ]
        subprocess.run(cmd, check=True)
        segment_files.append(os.path.abspath(seg_mp4))

    # Concat list file
    concat_list = os.path.join(TEMP_DIR, "concat_list.txt")
    with open(concat_list, "w") as f:
        for seg in segment_files:
            # Escape backslashes for ffmpeg concat
            f.write(f"file '{seg.replace(chr(92), '/')}'\n")

    output_video_docs = os.path.abspath(os.path.join("docs", "videos", "little_steps_feedback_video.mp4"))
    output_video_web = os.path.abspath(os.path.join("frontend", "public", "videos", "little_steps_feedback_video.mp4"))

    print("Concatenating all segments into final video...")
    cmd_concat = [
        FFMPEG_PATH,
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        output_video_docs
    ]
    subprocess.run(cmd_concat, check=True)

    # Copy to public folder for GitHub Pages hosting
    shutil.copy(output_video_docs, output_video_web)
    print(f"SUCCESS! Video written to:\n- {output_video_docs}\n- {output_video_web}")

if __name__ == "__main__":
    build_video()
