import styles from "./main.module.css";

const AnimationOtter = () => {
  return (
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
          <div className={styles.mouth}>
            <div className={styles.tongue}></div>
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
  );
};

export default AnimationOtter;
