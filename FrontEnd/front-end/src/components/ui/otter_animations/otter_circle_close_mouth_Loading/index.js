import styles from "./main.module.css";

const OtterCloseMouthLoading = () => {
  return (
    <div className=" bg-black bg-opacity-85  w-full h-full  flex justify-center items-center ">
      <div>
        <div className={styles.container}>
          <div className={styles.ripple}></div>
          <div className={styles.earLeft}>
            <div className={styles.earlineLeft}></div>
          </div>
          <div className={styles.earRight}>
            <div className={styles.earlineRight}></div>
          </div>
          <div className={styles.head}>
            <div className={styles.lightcircle}></div>
            <div className={styles.face}>
              <div className={styles.eyeLeft}>
                <div className={styles.eyedot}></div>
              </div>
              <div className={styles.eyeRight}>
                <div className={styles.eyedot}></div>
              </div>
              <div className={styles.nose}>
                <div className={styles.nosedot}></div>
              </div>
              <div className={styles.smile}>
                <div className={styles.curve1}></div>
                <div className={styles.curve2}></div>
              </div>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.armLeft}></div>
            <div className={styles.armRight}></div>
            <div className={styles.legLeft}></div>
            <div className={styles.legRight}></div>
          </div>
          <div className={styles.tail}></div>
        </div>
        {/* <span className=" loading loading-infinity mt-5 center w-5/10 ml-10"></span> */}
      </div>
    </div>
  );
};
export default OtterCloseMouthLoading;
