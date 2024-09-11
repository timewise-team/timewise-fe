import React from "react";

export const LIST_FAQ = [
  {
    question: "How do I get started with Timewise?",
    answer: `You can get
        started with Timewise by signing up for a free account.`,
  },
  {
    question: "What is the difference between the free and paid plans?",
    answer: `The free plan
        allows you to create up to 5 schedules and 5 events per schedule. The paid plan allows you to create unlimited schedules and events.`,
  },
  {
    question: "How do I upgrade to a paid plan?",
    answer: `You can upgrade to a paid plan by going to your account settings and selecting the plan you want.`,
  },
];

const Faq = () => {
  return (
    <div className="container px-5  mx-auto">
      <div className="flex flex-col text-center w-full mb-20">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-blue-600">
          Frequently Asked Questions
        </h1>
      </div>
      <div className="flex flex-wrap -m-4">
        {LIST_FAQ.map((faq, index) => (
          <div key={index} className="p-4 md:w-1/3 sm:w-1/2 w-full">
            <div className="border border-gray-200 p-6 rounded-lg bg-sky-100 cursor-pointer">
              <h2 className="text-lg text-gray-900 font-medium title-font mb-2">
                {faq.question}
              </h2>
              <p className="leading-relaxed text-base">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
