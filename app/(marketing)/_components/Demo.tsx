import React from "react";

const Demo: React.FC = () => {
  return (
    <>
      <section
        className="subsection subsection-depth section-fitness-depth relative"
        data-anim-scroll-group="Depth"
        data-analytics-section-engagement="name:swim workouts"
      >
        <div className="section-hero-container">
          <div className="section-hero-media">
            <div className="inline-media-component-container fitness-depth-video fallback">
              <div
                className="video-wrapper"
                data-video-id="fitness-depth-video"
                data-component-list="InlineMediaConfigured"
              >
                <video
                  id="fitness-depth-video"
                  preload="none"
                  role="img"
                  muted
                  playsInline
                  aria-label="Bài tập bơi với các chỉ số bao gồm nhiệt độ nước trên Apple Watch Series 10, xung quanh có các bong bóng nước nổi lên."
                  className="min-h-0 object-fill"
                  src="/105/media/vn/apple-watch-series-10/2024/3afac4b1-e3ad-4951-8cdc-32870eefd281/anim/depth/large_2x.mp4"
                ></video>
                <picture className="overview-fitness-depth-endframe fallback-frame loaded">
                  <source
                    srcSet="/vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_small.jpg, /vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_small_2x.jpg 2x"
                    media="(max-width:734px)"
                  />
                  <source
                    srcSet="/vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_medium.jpg, /vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_medium_2x.jpg 2x"
                    media="(max-width:1068px)"
                  />
                  <source
                    srcSet="/vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_large.jpg, /vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_large_2x.jpg 2x"
                    media="(min-width:0px)"
                  />
                  <img
                    src="/vn/apple-watch-series-10/images/overview/fitness/depth_endframe__e0vrhpaxntoy_large.jpg"
                    alt="End frame of swim workout"
                  />
                </picture>
              </div>
            </div>
          </div>
          <div className="section-content">
            <div
              className="copy-block row justify-center staggered-end"
              data-component-list="StaggeredFadeIn"
            >
              <p
                className="copy-block-copy typography-tout col-span-5 lg:col-start-6 md:col-span-6 sm:col-span-12"
                data-staggered-item=""
              >
                Cảm biến nhiệt độ nước mới mang lại{" "}
                <span className="highlight">
                  <em>thêm thông tin về các bài tập bơi của bạn</em>
                </span>
                . Và một cảm biến độ sâu mới khiến Series&nbsp;10 rất hữu dụng
                khi bơi lội và lặn vòi hơi.
                <sup className="footnote footnote-number">
                  <a
                    href="#footnote-10"
                    aria-label="Chú thích 10"
                    data-modal-close=""
                  >
                    10
                  </a>
                </sup>{" "}
                Vậy nên cứ mặc sức vui nhé.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Demo;
