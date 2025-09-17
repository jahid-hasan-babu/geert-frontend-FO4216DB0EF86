"use client";

import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  instructorDesignation?: string | null;
  courseCompletedDate: string | null;
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

const mockCertificateData: CertificateData = {
  studentName: "John Doe",
  courseTitle: "Advanced Web Development",
  instructorName: "Jane Smith",
  instructorDesignation: "Senior Developer",
  courseCompletedDate: "2024-01-15",
};

const mockResultData: ResultData = {
  finalScore: 95,
  overallPercent: 92,
  position: 3,
  totalStudents: 25,
};

export default function CourseCertification({ courseId }: Props) {
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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
          console.warn("Result not available, continuing without it:", err);
        }
      } catch {
        console.log("API not available, using mock data");
        setCertificate(mockCertificateData);
        setResult(mockResultData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDownloadPDF = async () => {
    console.log("[v1] Starting PDF download process");
    if (!certificate || !canvasRef.current) {
      console.log("[v1] Missing certificate or canvas ref");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("[v1] Failed to get canvas context");
      return;
    }

    try {
      console.log("[v1] Setting canvas dimensions");
      // Landscape A4 proportions
      canvas.width = 1200;
      canvas.height = 848;

      const templateImg = new Image();
      templateImg.crossOrigin = "anonymous";

      templateImg.onload = () => {
        console.log("[v1] Template image loaded successfully");
        try {
          // Draw template
          ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

          // Set text styles
          ctx.fillStyle = "#333333";
          ctx.textAlign = "center";

          // Header at top
          ctx.font = "bold 36px Arial";
          ctx.fillText("Online Cursusvoltooinng", canvas.width / 2, 60);

          ctx.font = "30px Arial";
          ctx.fillText("Uitgegeven op", canvas.width / 2, 330);

          // Student Name
          ctx.font = "bold 40px Arial";
          ctx.fillText(certificate.studentName, canvas.width / 2, 400);

          //Statci Text
          ctx.font = "italic 28px Arial";
          ctx.fillText("vur het succesvol afronden", canvas.width / 2, 450);

          // Course Name + "on" + Completion Date
          ctx.font = "bold 48px Arial";
          ctx.fillText(certificate.courseTitle, canvas.width / 2, 520);

          if (certificate.courseCompletedDate) {
            const date = new Date(certificate.courseCompletedDate);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "long" }); // Full month name
            const year = date.getFullYear();
            const formattedDate = `${day} ${month}, ${year}`;

            ctx.font = "30px Arial";
            ctx.fillText("on", canvas.width / 2, 560);
            ctx.fillText(formattedDate, canvas.width / 2, 600);
          }

          // Results (if available)
          if (result) {
            ctx.fillStyle = "#1E40AF"; // blue color
            ctx.font = "bold 24px Arial";
            ctx.fillText(
              `Final Score: ${result.finalScore}`,
              canvas.width / 2,
              650
            );
            ctx.fillText(
              `Overall Percent: ${result.overallPercent}%`,
              canvas.width / 2,
              690
            );
            ctx.fillText(
              `Class Position: ${result.position}${getOrdinalSuffix(
                result.position
              )} of ${result.totalStudents}`,
              canvas.width / 2,
              730
            );
          }

          // Convert to PDF
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("landscape", "mm", "a4");
          pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
          const fileName = `${certificate.studentName}_Certificate.pdf`;
          pdf.save(fileName);
          console.log("[v1] PDF download complete:", fileName);
        } catch (err) {
          console.error("[v1] Error generating PDF:", err);
          alert("Failed to generate PDF. Please try again.");
        }
      };

      templateImg.onerror = (err) => {
        console.error("[v1] Failed to load certificate template:", err);
        alert("Failed to load certificate template.");
      };

      console.log("[v1] Loading template image:", "/certificate_template.png");
      templateImg.src = "/certificate_template.png";
    } catch (err) {
      console.error("[v1] Error in handleDownloadPDF:", err);
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
      <div className="p-6 border-4 border-gray-300 rounded-2xl bg-white text-center space-y-4">
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
          Course Complete Date:{" "}
          {certificate.courseCompletedDate
            ? new Date(certificate.courseCompletedDate).toLocaleDateString()
            : "Not Available"}
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

      {/* Hidden canvas for PDF generation */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={1200}
        height={848}
      />
    </div>
  );
}

function getOrdinalSuffix(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "st";
  if (n % 10 === 2 && n % 100 !== 12) return "nd";
  if (n % 10 === 3 && n % 100 !== 13) return "rd";
  return "th";
}
