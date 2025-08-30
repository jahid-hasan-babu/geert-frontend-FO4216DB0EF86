"use client";

import { useEffect, useState, useRef } from "react";
import { Download, FileText, Trophy, Award } from "lucide-react";
import Image from "next/image";
import certificate from "@/assets/images/certificate.png";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  instructorDesignation?: string | null;
  courseStartDate: string;
  isCompleted: boolean;
  position: number;
}

interface ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CertificateData;
}

interface Props {
  courseId: string;
}

export default function CourseCertification({ courseId }: Props) {
  const score = 90;
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `/courses/get-certificate/${courseId}`
        );
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    const element = certificateRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = 210;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${data?.courseTitle}-Certificate.pdf`);
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading certificate...</p>;
  if (!data)
    return (
      <p className="text-center text-red-500">Certificate not available.</p>
    );

  return (
    <div className="max-w-md mx-auto">
      <div
        ref={certificateRef}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        {/* Certificate Image */}
        <div className="flex justify-center">
          <Image src={certificate} alt="Certificate" className="rounded-xl" />
        </div>

        {/* Score Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#f3f4f6"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#22c55e"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{score}%</span>
              <span className="text-sm text-gray-500">Score</span>
            </div>
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Final Score</p>
              <p className="font-semibold text-gray-900">
                {score}% on {data.courseTitle} Quiz
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Class Ranking</p>
              <p className="font-semibold text-gray-900">
                {data.position}
                {getOrdinalSuffix(data.position)} Position
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Certification</p>
              <p className="font-semibold text-gray-900">
                {data.courseTitle} Certificate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPDF}
        className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
      >
        <Download className="w-5 h-5" />
        <span>Download PDF</span>
      </button>
    </div>
  );
}

// Helper to get 1st, 2nd, 3rd, etc.
function getOrdinalSuffix(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return "st";
  if (n % 10 === 2 && n % 100 !== 12) return "nd";
  if (n % 10 === 3 && n % 100 !== 13) return "rd";
  return "th";
}
