"use client";

import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import axios, { AxiosError } from "axios";
import logo from "@/assets/images/logo.png";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  instructorDesignation?: string | null;
  courseStartDate: string;
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
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Fetch certificate
        const certRes = await axios.get<{
          success: boolean;
          data: CertificateData;
        }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-certificate/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!certRes.data.success) throw new Error("Certificate not available");
        setCertificate(certRes.data.data);

        // Fetch result (optional)
        try {
          const resultRes = await axios.get<{
            success: boolean;
            data: ResultData;
          }>(
            `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-result/${courseId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (resultRes.data.success) setResult(resultRes.data.data);
        } catch (err) {
          const error = err as AxiosError;
          console.warn(
            "Result not available, continuing without it:",
            error.message
          );
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error fetching data:", error);
        setError("Certificate not for now!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDownloadPDF = () => {
    if (!certificateRef.current || !certificate) return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${certificate.courseTitle} Certificate</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background: #f9fafb;
    }
    .certificate-container { 
      max-width: 768px; 
      margin: 0 auto; 
      padding: 40px; 
      border: 8px solid #d1d5db; 
      border-radius: 24px; 
      background: white; 
      text-align: center; 
    }
    .certificate-container > * { margin: 24px 0; }
    .logo { max-width: 120px; margin: 0 auto; display: block; }
    .title { font-size: 2.25rem; font-weight: bold; color: #1e40af; margin: 0; }
    .subtitle { color: #374151; font-size: 1.125rem; margin-top: 8px; }
    .student-name { font-size: 1.875rem; font-weight: 600; color: #111827; }
    .course-title { font-size: 1.5rem; font-weight: 500; color: #1d4ed8; }
    .details { color: #374151; margin-top: 16px; font-size: 1.125rem; }
    .highlight { font-size: 1.5rem; font-weight: bold; color: #1d4ed8; text-align: center; }
    .congratulations { color: #6b7280; margin-top: 24px; font-size: 0.875rem; }
    @media print { 
      body { margin: 0; padding: 0; } 
      .certificate-container { border: 8px solid #000; } 
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <img class="logo" src="${logo.src}" alt="Logo" />
    <h1 class="title">Certificate of Completion</h1>
    <p class="subtitle">This certificate is proudly presented to</p>
    <h2 class="student-name">${certificate.studentName}</h2>
    <p class="subtitle">for successfully completing the course</p>
    <h3 class="course-title">${certificate.courseTitle}</h3>
    <p class="details">Instructor: ${certificate.instructorName}${
        certificate.instructorDesignation
          ? ` - ${certificate.instructorDesignation}`
          : ""
      }</p>
    <p class="details">Course Start Date: ${new Date(
      certificate.courseStartDate
    ).toLocaleDateString()}</p>
    ${
      result
        ? `<p class="highlight">Final Score: ${result.finalScore}</p>
           <p class="highlight">Overall Percent: ${result.overallPercent}%</p>
           <p class="highlight">Class Position: ${
             result.position
           }${getOrdinalSuffix(result.position)} of ${result.totalStudents}</p>`
        : ""
    }
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

  if (loading)
    return <p className="text-center text-gray-500">Loading certificate...</p>;
  if (error || !certificate)
    return (
      <p className="text-center text-red-500">
        {error || "Certificate not available."}
      </p>
    );

  return (
    <div className="max-w-xl mx-auto">
      <div
        ref={certificateRef}
        className="p-6 border-4 border-gray-300 rounded-2xl bg-white text-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-blue-800">
          Certificate of Completion
        </h1>
        <p className="text-gray-700 text-sm">
          This certificate is proudly presented to
        </p>
        <h2 className="text-2xl font-semibold text-gray-900">
          {certificate.studentName}
        </h2>
        <p className="text-gray-700 text-sm">
          for successfully completing the course
        </p>
        <h3 className="text-xl font-medium text-blue-700">
          {certificate.courseTitle}
        </h3>
        <p className="text-gray-700 mt-2 text-sm">
          Instructor: {certificate.instructorName}{" "}
          {certificate.instructorDesignation
            ? `- ${certificate.instructorDesignation}`
            : ""}
        </p>
        <p className="text-gray-700 text-sm">
          Course Start Date:{" "}
          {new Date(certificate.courseStartDate).toLocaleDateString()}
        </p>
        {result && (
          <>
            <p className="text-blue-600 font-bold text-lg">
              Final Score: {result.finalScore}
            </p>
            <p className="text-blue-600 font-bold text-lg">
              Overall Percent: {result.overallPercent}%
            </p>
            <p className="text-blue-600 font-bold text-lg">
              Class Position: {result.position}
              {getOrdinalSuffix(result.position)} of {result.totalStudents}
            </p>
          </>
        )}
        <p className="text-gray-500 mt-4 text-xs">
          Congratulations on your achievement!
        </p>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
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
