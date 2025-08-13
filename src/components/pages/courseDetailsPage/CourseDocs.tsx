import Image from "next/image";
import React from "react";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton/PrimaryButton";
import course_details_docs_top from "@/assets/images/course_details_docs_top.png";
import course_details_docs_bottom from "@/assets/images/course_details_docs_bottom.png";

const CourseDocs = () => {
  const courseHeading =
    "Learn how to convert concepts into clear, structured designs that lay the groundwork for effective user experiences.";

  const whatYoullLearn = [
    {
      title: "Understanding Wireframes",
      description:
        "Grasp the purpose and types of wireframes used in early-stage product development.",
    },
    {
      title: "User Flow Planning",
      description:
        "Create logical navigation paths that enhance usability and reduce user confusion.",
    },
    {
      title: "Low-Fidelity Wireframes",
      description:
        "Design basic outlines to map out layouts, functionality, and structure before diving into high-fidelity visuals.",
    },
  ];

  const quickHighlights = [
    "Build wireframes with user behavior in mind",
    "Plan clear navigation flows and layout hierarchy",
    "Save time by iterating in low-fidelity before high-fidelity",
    "Encourage early client or stakeholder feedback",
  ];

  return (
    <div className="space-y-4">
      <div>{courseHeading}</div>
      <section>
        <div className="">
          <Image
            src={course_details_docs_top}
            className="w-full"
            alt=""
          ></Image>
        </div>
      </section>
      <section>
        <div className="mx-auto">
          <div className="text-[12px] md:text-[16px] font-bold text-gray-900 mb-2">
            What You&#39;ll Learn:
          </div>
          <ol className="list-decimal list-inside space-y-6 text-lg text-gray-700">
            {whatYoullLearn.map((item, index) => (
              <li className="" key={index}>
                <span className="font-semibold">{item.title}:</span>{" "}
                <div className="">{item.description}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section>
        <div className="">
          <Image src={course_details_docs_bottom} className="w-full" alt=""></Image>
        </div>
      </section>
      <section>
        <div className="mx-auto">
          <h2 className="text-[12px] md:text-[16px] font-bold text-gray-900 mb-2">
            Quick Highlights:
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-700 px-2">
            {quickHighlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section>
        <PrimaryButton label="Next" className="w-full" />
      </section>
    </div>
  );
};

export default CourseDocs;
