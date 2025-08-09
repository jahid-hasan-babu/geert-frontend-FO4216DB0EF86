import React from "react";
import { Container } from "@/components/ui-library/container";
import Hero from "./Hero/Hero";
import HomeCourse from "./HomeCourse/HomeCourse";
import Need from "./Need/Need";
import Testimonial from "./Testimonial/Testimonial";
import WhyUs from "./WhyUs/WhyUs";
import Promotion from "../../shared/Promotion/Promotion";

const HomeComponent = () => {
  return (
    <Container>
      <Hero/>
      <Need/>
      <HomeCourse/>
      <Testimonial/>
      <WhyUs/>
      <Promotion/>
    </Container> 
  );
};

export default HomeComponent;
