"use client";

import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import axios, { AxiosError } from "axios";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  instructorDesignation?: string | null;
  courseStartDate: string;
  isCompleted: boolean;
  position: number;
}

interface Props {
  courseId: string;
}

export default function CourseCertification({ courseId }: Props) {
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axios.get<{ success: boolean; data: CertificateData }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-certificate/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError("Certificate not available");
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error fetching certificate:", error);
        setError("Failed to fetch certificate");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId]);

  const handleDownloadPDF = () => {
    if (!certificateRef.current || !data) return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${data.courseTitle} Certificate</title>
          <style>
            body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .certificate-container { max-width: 768px; margin: 0 auto; padding: 40px; border: 8px solid #d1d5db; border-radius: 24px; background: white; text-align: center; }
            .certificate-container > * { margin: 24px 0; }
            .title { font-size: 2.25rem; font-weight: bold; color: #1e40af; margin: 0; }
            .subtitle { color: #374151; font-size: 1.125rem; margin-top: 8px; }
            .student-name { font-size: 1.875rem; font-weight: 600; color: #111827; }
            .course-title { font-size: 1.5rem; font-weight: 500; color: #1d4ed8; }
            .details { color: #374151; margin-top: 16px; }
            .congratulations { color: #6b7280; margin-top: 24px; font-size: 0.875rem; }
            @media print { body { margin: 0; padding: 0; } .certificate-container { border: 8px solid #000; } }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <h1 class="title">Certificate of Completion</h1>
            <p class="subtitle">This certificate is proudly presented to</p>
            <h2 class="student-name">${data.studentName}</h2>
            <p class="subtitle">for successfully completing the course</p>
            <h3 class="course-title">${data.courseTitle}</h3>
            <p class="details">Instructor: ${data.instructorName}${data.instructorDesignation ? ` - ${data.instructorDesignation}` : ""}</p>
            <p class="details">Course Start Date: ${new Date(data.courseStartDate).toLocaleDateString()}</p>
            <p class="details">Class Position: ${data.position}${getOrdinalSuffix(data.position)}</p>
            <p class="congratulations">Congratulations on your achievement!</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading certificate...</p>;
  if (error || !data) return <p className="text-center text-red-500">{error || "Certificate not available."}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <div ref={certificateRef} className="p-10 border-8 border-gray-300 rounded-3xl bg-white text-center space-y-6">
        <h1 className="text-4xl font-bold text-blue-800">Certificate of Completion</h1>
        <p className="text-gray-700 text-lg mt-2">This certificate is proudly presented to</p>
        <h2 className="text-3xl font-semibold text-gray-900">{data.studentName}</h2>
        <p className="text-gray-700 text-lg mt-2">for successfully completing the course</p>
        <h3 className="text-2xl font-medium text-blue-700">{data.courseTitle}</h3>
        <p className="text-gray-700 mt-4">
          Instructor: {data.instructorName} {data.instructorDesignation ? `- ${data.instructorDesignation}` : ""}
        </p>
        <p className="text-gray-700">Course Start Date: {new Date(data.courseStartDate).toLocaleDateString()}</p>
        <p className="text-gray-700">Class Position: {data.position}{getOrdinalSuffix(data.position)}</p>
        <p className="text-gray-500 mt-6 text-sm">Congratulations on your achievement!</p>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="w-full mt-6 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Download PDF</span>
      </button>
    </div>
  );
}

// Helper for ordinal suffix
function getOrdinalSuffix(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "st";
  if (n % 10 === 2 && n % 100 !== 12) return "nd";
  if (n % 10 === 3 && n % 100 !== 13) return "rd";
  return "th";
}
