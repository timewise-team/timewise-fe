"use client";
import useDeviceDetect from "@/utils/DeviceDetect";
import { useEffect } from "react";
import { createMarkup } from "./Overview";
import style from "@/styles/landingpage/feature-benefit.module.scss";

const DESCRIPTION_BLOCK_HEIGHT_DESKTOP = 400;
const DESCRIPTION_BLOCK_HEIGHT_TABLET = 330;
const START_BLOCK_INDEX = 1500;
const START_BLOCK_TABLET = 2200;
const START_BLOCK_MOBILE = 2500;

const MAX_SCALE_RATIOS = [0.1, 0.05, 0.025];

export const BENEFITS = [
  {
    image: "/images/banner/1.webp",
    type: "User Benefits",
    title: "Empowering User-Controlled<br/> Data with Timewise",
    items: [
      "User Data Sovereignty",
      "Anonymous Data Sharing Rewards",
      "Contributing to Research",
    ],
    bgColor: "#FFCDB2",
  },

  {
    image: "/images/banner/2.webp",
    type: "User Benefits",
    title: "Comprehensive Sleep Monitoring<br/> with Timewise",
    items: [
      "Advanced Sleep Tracking",
      "Personalized Sleep Insights",
      "Smart Environment Control",
    ],
    bgColor: "#E5989B",
  },
  {
    image: "/images/banner/3.webp",
    type: "User Benefits",
    title: "Heart Rate Monitoring<br/> for Holistic Wellness",
    items: [
      "Continuous Heart Rate Tracking",
      "AI-Driven Analysis",
      "Actionable Health Insights",
    ],
    bgColor: "##B5838D",
  },
];

const Benefit = () => {
  const { isTablet, isDesktop } = useDeviceDetect();
  const START_BLOCK = isDesktop
    ? START_BLOCK_INDEX
    : isTablet
    ? START_BLOCK_TABLET
    : START_BLOCK_MOBILE;

  const DESCRIPTION_BLOCK_HEIGHT = isDesktop
    ? DESCRIPTION_BLOCK_HEIGHT_DESKTOP
    : DESCRIPTION_BLOCK_HEIGHT_TABLET;

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isTablet, isDesktop]);

  const onScroll = () => {
    if (window !== undefined) {
      BENEFITS.forEach((_, index) => {
        const des = document.getElementById(`description-${index}`);
        const image = document.getElementById(`image-${index}`);
        const entrance = START_BLOCK + DESCRIPTION_BLOCK_HEIGHT;
        const startIndex = START_BLOCK + index * DESCRIPTION_BLOCK_HEIGHT;
        const nextIndex = START_BLOCK + (index + 1) * DESCRIPTION_BLOCK_HEIGHT;
        if (des && index < BENEFITS.length - 1) {
          if (window.scrollY >= entrance) {
            const scaleRatio =
              (((window.scrollY - entrance) / DESCRIPTION_BLOCK_HEIGHT) * 0.1) /
              (index + 1);

            if (!(scaleRatio > MAX_SCALE_RATIOS[index]))
              des.style.transform = `translate3d(0px, 0px, 0px) scale3d(${
                1 - scaleRatio
              }, ${
                1 - scaleRatio
              }, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)`;
          }
          if (
            window.scrollY >=
            nextIndex + DESCRIPTION_BLOCK_HEIGHT / ((index + 1) * 2)
          ) {
            des.style.backgroundColor = "#F9F9F9";
          } else {
            des.style.backgroundColor = "#fff";
          }
        }
        if (image) {
          if (
            (index === 0 && window.scrollY < startIndex) ||
            (index === BENEFITS.length - 1 && window.scrollY >= startIndex) ||
            (window.scrollY > startIndex && window.scrollY < nextIndex)
          ) {
            image.style.opacity = "1";
            if (des) {
              des.style.backgroundColor = "#ebf0fe";
            }
          } else {
            image.style.opacity = "0";
            if (des) {
              des.style.backgroundColor = "#fff";
            }
          }
        }
      });
    }
  };
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.benefits}>
          <div className={style.benefit}>
            <div className={style.blockBottom}>
              <div className={style.imageContainer}>
                <div className={style.wrapper}>
                  <h2 className={style.userBenefit}>AI Benefits</h2>

                  <div className={style.frameWrapper}>
                    <img
                      src="/images/banner/4.webp"
                      alt="device-frame"
                      className={style.smartWatch}
                    />
                    <img
                      className={style.iphone}
                      src="/images/banner/5.webp"
                      alt="device-frame"
                    />
                  </div>
                  {BENEFITS.map((description, index) => (
                    <div
                      key={index}
                      className={style.imageWrapper}
                      id={`image-${index}`}
                    >
                      <img
                        key={index}
                        className={style.image}
                        src={description.image}
                        alt="feature-benefit"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className={style.rightBlock}>
                {BENEFITS.map((description, index) => (
                  <div
                    id={`description-${index}`}
                    style={{
                      transition: "background-color 0.5s",
                      willChange: "transform",
                      transformStyle: "preserve-3d",
                      transform:
                        "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)",
                    }}
                    className={`${style.descriptionContainer} ${
                      style[`stick-list_card_${index + 1}`]
                    }`}
                    key={index}
                  >
                    <h3
                      className={style.title}
                      dangerouslySetInnerHTML={createMarkup(description.title)}
                    />

                    <ul className={style.description}>
                      {description.items.map((item, index) => (
                        <li key={index}>
                          <p dangerouslySetInnerHTML={createMarkup(item)} />
                        </li>
                      ))}{" "}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefit;
