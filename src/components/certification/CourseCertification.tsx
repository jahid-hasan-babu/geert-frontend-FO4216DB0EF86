"use client";

import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import axios, { type AxiosError } from "axios";
import { TranslateInitializer } from "@/lib/language-translate/LanguageSwitcher";
import logo from "@/assets/images/logo.png";
import instructor_signature from "@/assets/images/instructor_signature.png";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  instructorDesignation?: string | null;
  courseCompletedDate: string;
}

interface ResultData {
  finalScore: number;
  overallPercent: number;
  position: number;
  totalStudents: number;
}

interface Props {
  courseId: string;
}

export default function CourseCertification({ courseId }: Props) {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const certificateRef = useRef<HTMLDivElement>(null);

  const convertLogoToBase64 = async () => {
    try {
      const response = await fetch(logo.src);
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting logo to base64:", error);
      return "";
    }
  };

  const convertSignatureToBase64 = async () => {
    try {
      const response = await fetch(instructor_signature.src);
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting logo to base64:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const logoBase64 = await convertLogoToBase64();
        setLogoDataUrl(logoBase64);

        const instructorSignatureBase64 = await convertSignatureToBase64();
        setSignatureDataUrl(instructorSignatureBase64);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const certRes = await axios.get<{
          success: boolean;
          data: CertificateData;
        }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-certificate/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!certRes.data.success) throw new Error("Certificate not available");
        setCertificate(certRes.data.data);

        try {
          const resultRes = await axios.get<{
            success: boolean;
            data: ResultData;
          }>(
            `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-result/${courseId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (resultRes.data.success) setResult(resultRes.data.data);
        } catch (err) {
          console.warn(
            "Result not available, continuing without it:",
            (err as AxiosError).message
          );
        }
      } catch {
        setError("Certificate not available.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDownloadPDF = () => {
    if (
      !certificateRef.current ||
      !certificate ||
      !logoDataUrl ||
      !signatureDataUrl
    )
      return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

      const texts = {
        en: {
          certificateTitle: "Certificate",
          presentedTo: "This certificate is proudly presented to",
          forCourse: "for successfully completing the course",
          instructor: "Instructor",
          courseCompleteDate: "Course Completed Date",
          finalScore: "Final Score",
          overallPercent: "Overall Percent",
          classPosition: "Class Position",
          congratulations: "Congratulations on your achievement!",
        },
        nl: {
          certificateTitle: "Certificaat",
          presentedTo: "Dit certificaat wordt met trots uitgereikt aan",
          forCourse: "voor het succesvol voltooien van de cursus",
          instructor: "Instructeur",
          courseCompletedDate: "Startdatum van de cursus",
          finalScore: "Eindscore",
          overallPercent: "Totaalpercentage",
          classPosition: "Klaspositie",
          congratulations: "Gefeliciteerd met uw prestatie!",
        },
      };

      const t = selectedLanguage === "nl" ? texts.nl : texts.en;

      const htmlContent = `<!DOCTYPE html>
<html lang="${selectedLanguage}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VMTA ${t.certificateTitle}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
    margin: 0 !important;
    padding: 0 !important;
}

        
        .certificate {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    box-shadow: none !important;
}
        
        .background-pattern {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.05;
            background-image: radial-gradient(circle, #666 1px, transparent 1px);
            background-size: 15px 15px;
        }
        
        .left-design {
            position: absolute;
            left: 0;
            top: 0;
            width: 200px;
            height: 100%;
            background: linear-gradient(135deg, #00bfff 0%, #ff7f50 100%);
            clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
        }
        
        .logo {
      max-width: 120px;
      height: auto;
      margin: 60px auto 30px auto;
      display: block;
    }
        
        
        .certificate-title {
            font-size: 48px;
            font-weight: 800;
            color: #333;
            letter-spacing: 3px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .certificate-header {
  font-size: 28px;       /* Adjust size */
  color: #333;           /* Correct property */
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  display: block;        /* Make sure it displays */
}
        
        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 100px;
            margin-top: 40px;
            }
        
        .presented-to {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }
        
        .student-name {
            font-size: 36px;
            font-weight: 700;
            color: #00bfff;
            margin-bottom: 20px;
            border-bottom: 2px solid #00bfff;
            display: inline-block;
            padding-bottom: 5px;
        }
        
        .course-completion {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .course-title {
            font-size: 28px;
            font-weight: 600;
            color: #333;
            margin-bottom: 30px;
        }
        
        .details-section {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
            padding: 0 50px;
        }
        
        .detail-item {
            text-align: center;
        }
        
        .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }
        
        .result-info {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .result-item {
            font-size: 14px;
            color: #00bfff;
            font-weight: 600;
        }
        
        .footer {
            position: absolute;
            bottom: 40px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 60px;
        }
        
        .certificate-seal {
            text-align: center;
            flex: 0 0 270px;
        }
        
        .seal-circle {
            width: 80px;
            height: 80px;
            border: 3px solid #00bfff;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            position: relative;
        }
        
        .seal-circle:before {
            content: '';
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border: 2px solid #00bfff;
            border-radius: 50%;
        }
        
        .seal-text {
            font-size: 10px;
            font-weight: 600;
            color: #00bfff;
            text-align: center;
            line-height: 1.2;
        }
        
        .stars {
            color: #00bfff;
            font-size: 12px;
            margin: 2px 0;
        }
        
        .signature-section {
            text-align: right;
        }
        
        .signature-line {
            width: 200px;
            height: 1px;
            background: #ccc;
            margin-bottom: 5px;
        }
        
        .signature-title {
            font-size: 14px;
            color: #333;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .contact-info {
            text-align: right;
            font-size: 12px;
            color: #666;
            line-height: 1.4;
        }
        
        .contact-info strong {
            color: #333;
        }
        
        .congratulations {
            font-size: 14px;
            color: #666;
            font-style: italic;
            margin-top: 20px;
        }

        .cursus-signature {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center
        }
        
        @media print {
    body {
        padding: 0 !important;      /* Remove body padding */
        margin: 0 !important;       /* Remove body margin */
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .certificate {
        width: 100% !important;     /* Full width */
        height: 100% !important;    /* Full height */
        box-shadow: none !important;
        margin: 0 !important;       /* Remove auto margins */
    }

    .left-design {
        background: linear-gradient(135deg, #00bfff 0%, #ff7f50 100%) !important;
    }

    .background-pattern {
        opacity: 0.05 !important;
    }

    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    @page { 
    size: A4 landscape;  
    margin: 0; 
}

}

    </style>
</head>
<body>
    <div class="certificate">
        <div class="background-pattern"></div>
        <div class="left-design"></div>
        
        <div class="content">
            <div class="certificate-header">Online cursusvoltooiing</div>
            <img class="logo" src="${logoDataUrl}" alt="Logo" />
            <p class="presented-to">${t.presentedTo}</p>
            <h2 class="student-name">${certificate.studentName}</h2>
            <p class="course-completion">${t.forCourse}</p>
            <h3 class="course-title">${certificate.courseTitle}</h3>
        
        <div class="footer">
            <div class="certificate-seal">
                <div class="seal-circle">
                    <div class="seal-text">CERTIFICAAT</div>
                    <div class="stars">★★★★★</div>
                </div>
            </div>

            <div class="cursus-signature">
                <div class="signature-line"></div>
                <h4 class="signature-title">Datum van de cursus</h4>
                <h6 class="signature-title">Geldig tot 1 jaar na afgifte</h6>
            </div>

            <div>
            <img class="instructor-signature" src="${signatureDataUrl}" alt="Logo" />
                <div class="signature-line"></div>
                <h4 class="signature-title">Handtekening instructeur</h4>
            </div>
            
            <div class="signature-section">
                
                <div class="contact-info">
                    <strong>Meander 19</strong><br>
                    9231DB Surhuisterveen<br><br>
                    
                    <strong>Telefoon</strong> &nbsp;&nbsp;&nbsp; 0512-36 12 28<br>
                    <strong>Mobiel</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 06-150 87 817<br>
                    <strong>E-mail</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; info@vmta.nl<br>
                    <strong>Internet</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; www.vmta.nl
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      const checkFontsAndPrint = () => {
        if (printWindow.document.fonts && printWindow.document.fonts.ready) {
          printWindow.document.fonts.ready.then(() => {
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 200);
          });
        } else {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 1500);
        }
      };

      setTimeout(checkFontsAndPrint, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500" data-translate>
        Loading certificate...
      </p>
    );
  if (error || !certificate)
    return (
      <p className="text-center text-red-500" data-translate>
        {error || "Certificate not available."}
      </p>
    );

  return (
    <div className="max-w-xl mx-auto">
      <TranslateInitializer />
      <div
        ref={certificateRef}
        className="p-6 border-4 border-gray-300 rounded-2xl bg-white text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-blue-800" data-translate>
          Certificate of Completion
        </h1>
        <p className="text-gray-700 text-sm" data-translate>
          This certificate is proudly presented to
        </p>
        <h2 className="text-2xl font-semibold text-gray-900">
          {certificate.studentName}
        </h2>
        <p className="text-gray-700 text-sm" data-translate>
          for successfully completing the course
        </p>
        <h3 className="text-xl font-medium text-blue-700">
          {certificate.courseTitle}
        </h3>
        <p className="text-gray-700 mt-2 text-sm" data-translate>
          Instructor: {certificate.instructorName}{" "}
          {certificate.instructorDesignation
            ? `- ${certificate.instructorDesignation}`
            : ""}
        </p>
        <p className="text-gray-700 text-sm" data-translate>
          Course Course Date:{" "}
          {new Date(certificate.courseCompletedDate).toLocaleDateString()}
        </p>
        {result && (
          <>
            <p className="text-blue-600 font-bold text-lg" data-translate>
              Final Score: {result.finalScore}
            </p>
            <p className="text-blue-600 font-bold text-lg" data-translate>
              Overall Percent: {result.overallPercent}%
            </p>
            <p className="text-blue-600 font-bold text-lg" data-translate>
              Class Position: {result.position}
              {getOrdinalSuffix(result.position)} of {result.totalStudents}
            </p>
          </>
        )}
        <p className="text-gray-500 mt-4 text-xs" data-translate>
          Congratulations on your achievement!
        </p>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
        data-translate
      >
        <Download className="w-5 h-5" />
        <span>Download PDF</span>
      </button>
    </div>
  );
}

function getOrdinalSuffix(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "st";
  if (n % 10 === 2 && n % 100 !== 12) return "nd";
  if (n % 10 === 3 && n % 100 !== 13) return "rd";
  return "th";
}
