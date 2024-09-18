"use client";
import { dataFaqs } from "@/constants/faq";
import React, { useState } from "react";
import Image from "next/image";
import Collapse from "@/components/collapse";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={"hidden"}
      whileInView={"show"}
      viewport={{ once: true, amount: 0.25 }}
    >
      <section className="dark:bg-sky-200 dark:text-gray-800">
        <motion.h2
          variants={fadeIn({
            direction: "top",
            type: "spring",
            delay: 0.1,
            duration: 0.5,
          })}
          className="mb-12 text-xl font-bold leading-none text-center sm:text-3xl text-sky-500"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          variants={fadeIn({
            direction: "right",
            type: "tween",
            delay: 0.5,
            duration: 1,
          })}
          className="container flex lg:flex-row flex-col justify-center p-4 mx-auto md:p-8"
        >
          <Image
            className="rounded-lg lg:h-fit h-auto"
            src="/images/1.jpg"
            alt="faq"
            width={720}
            height={600}
            quality={100}
          />
          <div className="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 dark:divide-gray-300">
            {dataFaqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-left focus:outline-none"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <span>
                    {openIndex === index ? (
                      <Image
                        src="/images/arrow-up.svg"
                        alt="arrow-down"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <Image
                        src="/images/arrow-down.svg"
                        alt="arrow-down"
                        width={24}
                        height={24}
                      />
                    )}
                  </span>
                </button>
                <Collapse isActive={openIndex === index}>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </Collapse>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Faq;
