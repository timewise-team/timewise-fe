import { Apple } from "lucide-react";

export function createMarkup(data: string) {
  return { __html: data };
}
const Overviews = [
  {
    backgroundColor: "#41B2D6",
    icon: <Apple className="w-10 h-10" />,
    title: "AI </br>at the Core",
    description:
      "Leveraging technology, guarantees secure and private health data handling, giving users full control over their health information",
  },
  {
    backgroundColor: "#5685FF",

    icon: <Apple className="w-10 h-10" />,
    title: "asd <br/> Wellness",
    description:
      "Leveraging technology, guarantees secure and private health data handling, giving users full control over their health information",
  },
  {
    backgroundColor: "#3EC6C5",
    icon: <Apple className="w-10 h-10" />,
    title: "Comprehensive<br/> Wellness Ecosystem",
    description:
      "Leveraging technology, guarantees secure and private health data handling, giving users full control over their health information",
  },
  {
    backgroundColor: "#459DE6",
    icon: <Apple className="w-10 h-10" />,
    title: "Mission <br/>Statement",
    description:
      "Leveraging technology, guarantees secure and private health data handling, giving users full control over their health information",
  },
];

const FeaturesAndBenefits = [
  {
    backgroundColor: "#5685FF",
    icon: <Apple className="w-20 h-20" />,
    title: "Features",
    description: "HealthFi Protocol, AI Integration, and DePIN Technology",
  },
  {
    backgroundColor: "#459DE6",
    icon: <Apple className="w-20 h-20" />,
    title: "User benefits",
    description: "Personalized health insights and token rewards",
  },
  {
    backgroundColor: "#41B2D6",
    icon: <Apple className="w-20 h-20" />,
    title: "Merchant benefits",
    description: "Market access and increased sales opportunities",
  },
  {
    backgroundColor: "#3EC6C5",
    icon: <Apple className="w-20 h-20" />,
    title: "Community benefits",
    description: "Health and wellness education and community engagement",
  },
];
const Overview = () => {
  return (
    <>
      <div className="max-w-screen-xl py-10">
        <h2 className="text-gray-950 text-center text-lg font-bold leading-6 tracking-[1px] uppercase">
          Overview of TIMIWISE as an AI-powered schedule platform
          <br /> Dive into the Timewise: schedule management while enhancing
          productivity.
        </h2>
        <p className="text-gray-950 text-center text-base leading-6 tracking-[0.14px] mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. At odio
          iusto, maiores debitis sed quis aut nihil repellat doloremque error!
        </p>

        {/* sm display grid and grid per col 1 in md display flex over flow x auto and in lg display grid and gridtemplate per collumn 4  */}

        <div className="mt-7 md:grid md:grid-cols-4 gap-5 h-72 mb-10 overflow-x-auto ">
          {Overviews.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer bg-sky-50 rounded-lg p-5 flex flex-col items-center space-y-4 hover:shadow-md hover:bg-gray-100 hover:text-white"
            >
              {item.icon}
              <div
                className={
                  "text-gray-950 text-center text-lg font-bold h-13 tracking-[0.2px] normal-case flex items-center flex-grow-1 "
                }
                dangerouslySetInnerHTML={createMarkup(item.title)}
              />
              <p className="text-gray-950 text-center leading-5 tracking-[0.14px] flex flex-grow-1">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto lg:p-0 p-4">
        <h2 className="text-gray-950 text-center text-lg font-bold leading-6 tracking-[1px] uppercase">
          Features & Benefits
        </h2>
        <p className="text-gray-950 text-center text-base leading-6 tracking-[0.14px] mt-3">
          Overview of Timewise as an AI-powered schedule platform Dive into the
        </p>
        <div className="mt-7 grid grid-cols-1 gap-5 h-72 mb-10 sm:flex sm:flex-wrap sm:justify-center lg:grid lg:grid-cols-4">
          {FeaturesAndBenefits.map((item, index) => (
            <div
              key={index}
              style={{ backgroundColor: item.backgroundColor }}
              className="w-full h-30 p-5 flex items-center justify-center gap-6 box-border rounded-xl"
            >
              {item.icon}
              <div className="max-w-50 flex flex-col gap-2 text-white flex-grow">
                <p className="text-lg font-semibold leading-6 tracking-[0.14px]">
                  {item.title}
                </p>
                <p className={"tracking-[0.14px] leading-6"}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview;
