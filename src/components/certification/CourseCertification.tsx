import { Download, FileText, Trophy, Award } from "lucide-react";
import certificate from "@/assets/images/certificate.png";
import Image from "next/image";

export default function CourseCertification() {
  const score = 90;
  const finalScoreText = "90% on UI Design Quiz";
  const ranking = "1st Position";
  const certificationType = "UI Design Certificate";

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
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
            <p className="font-semibold text-gray-900">{finalScoreText}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Class Ranking</p>
            <p className="font-semibold text-gray-900">{ranking}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Certification</p>
            <p className="font-semibold text-gray-900">{certificationType}</p>
          </div>
        </div>
      </div>

      <div>
        <Image src={certificate} alt=""></Image>
      </div>

      <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer">
        <Download className="w-5 h-5" />
        <span>Download</span>
      </button>
    </div>
  );
}
