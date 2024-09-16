"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { Button } from "@/components/ui/Button";

const Advertise = () => {
  return (
    <motion.div
      initial={"hidden"}
      whileInView={"show"}
      viewport={{ once: true, amount: 0.25 }}
    >
      <section className=" text-gray-700 body-font">
        <div className=" container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <motion.div
            variants={fadeIn({
              direction: "right",
              type: "spring",
              delay: 0.2,
              duration: 1,
            })}
            className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
          >
            <h1 className="title-font sm:text-2xl text-3xl mb-4 font-medium text-gray-900">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor,
              architecto?
              <br className="hidden xl:inline-block" />
              readymade gluten
            </h1>
            <p className="mb-8 leading-relaxed">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum
              doloremque perspiciatis sequi fugiat dolorem necessitatibus
              eveniet perferendis adipisci laborum numquam.
            </p>
            <div className="flex justify-center">
              <Button>Button</Button>
            </div>
          </motion.div>
          <motion.div
            variants={fadeIn({
              direction: "left",
              type: "spring",
              delay: 0.5,
              duration: 1,
            })}
            className="xl:max-w-lg lg:w-full md:w-1/2 w-5/6"
          >
            <Image
              src="/images/calender.png"
              alt="hero"
              width={720}
              height={600}
              quality={100}
            />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Advertise;
