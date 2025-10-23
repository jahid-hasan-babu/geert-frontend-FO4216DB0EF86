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
  courseCompletedDate?: string | null;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          data?: CertificateData;
          message?: string;
        }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/courses/get-certificate/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!certRes.data.success) {
          // Course not completed yet
          setCertificate(null);
          setError(
            certRes.data.message ||
              "Complete the course to generate your certificate."
          );
          return;
        }

        setCertificate(certRes.data.data || null);

        // Fetch result if available
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
          console.warn("Result not available, continuing without it:", err);
        }
      } catch {
        setError("Failed to fetch certificate. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleDownloadPDF = async () => {
    if (!certificate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      canvas.width = 1200;
      canvas.height = 848;

      const templateImg = new Image();
      templateImg.crossOrigin = "anonymous";

      templateImg.onload = () => {
        // Draw template
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#333333";
        ctx.textAlign = "center";

        // Header
        ctx.font = "bold 36px Arial";
        ctx.fillText("Online Cursusvoltooiing", canvas.width / 2, 60);

        ctx.font = "30px Arial";
        ctx.fillText("Uitgegeven op", canvas.width / 2, 330);

        // Student Name
        ctx.font = "bold 40px Arial";
        ctx.fillText(certificate.studentName, canvas.width / 2, 400);

        ctx.font = "italic 28px Arial";
        ctx.fillText("voor het succesvol afronden", canvas.width / 2, 450);

        // Course Title
        ctx.font = "bold 48px Arial";
        ctx.fillText(certificate.courseTitle, canvas.width / 2, 520);

        // Completion Date
        if (certificate.courseCompletedDate) {
          const date = new Date(certificate.courseCompletedDate);
          const day = date.getDate();
          const month = date.toLocaleString("default", { month: "long" });
          const year = date.getFullYear();
          const formattedDate = `${day} - ${month} - ${year}`;

          ctx.font = "18px Arial";
          // ctx.fillText("on", canvas.width / 2, 560);
          ctx.fillText(formattedDate, canvas.width / 3.05, 710);
        }

        // Results (if available)
        if (result) {
          ctx.fillStyle = "#1E40AF";
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

        // Generate PDF
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
        pdf.save(`${certificate.studentName}_Certificate.pdf`);
      };

      templateImg.onerror = () => {
        alert("Failed to load certificate template.");
      };

      templateImg.src = "/certificate_template.png";
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold" data-translate>
        {error}
      </p>
    );

  if (!certificate)
    return (
      <p className="text-center text-gray-700 font-semibold" data-translate>
        Complete the course to generate your certificate.
      </p>
    );

  if (loading)
    return (
      <p className="text-center text-gray-500" data-translate>
        Loading certificate...
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
