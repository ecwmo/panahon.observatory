function reportCtrl(reportImgs, staticImgs) {
  reportImgs = reportImgs.map((imgSrc, idx) => ({
    lazyLoad: idx < 2 ? false : true,
    show: idx < 2 ? true : false,
    imgSrc,
  }));

  staticImgs = staticImgs.map((imgSrc) => ({
    lazyLoad: true,
    show: false,
    imgSrc,
  }));

  const imgSrcs = {
    reportImgs,
    staticImgs,
  };
  return {
    imgSrcs: imgSrcs,
    loadImage(imgSrcGrpName, imgIdx) {
      const prevIdx = imgIdx - 1;
      let prevImgIsShown = true;

      if (imgSrcGrpName === "staticImgs")
        prevImgIsShown =
          prevIdx < 0
            ? this.imgSrcs["reportImgs"][this.imgSrcs["reportImgs"].length - 1]
                .show
            : this.imgSrcs[imgSrcGrpName][prevIdx].show;
      else
        prevImgIsShown =
          prevIdx < 0 ? true : this.imgSrcs[imgSrcGrpName][prevIdx].show;

      if (prevImgIsShown) {
        this.imgSrcs[imgSrcGrpName][imgIdx].show = true;
      }
    },
  };
}

export { reportCtrl };
