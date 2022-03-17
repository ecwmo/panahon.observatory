interface RawImages {
  [key: string]: string[]
}

interface Images {
  [key: string]: { imgSrc: string; show: boolean }[]
}

const reportCtrl = () => ({
  imgSrcs: <Images>{ reportImgs: [], staticImgs: [] },
  init() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    fetch(`/lib/fetch-report.php?view=${urlParams.get('view')}`)
      .then((res) => res.json())
      .then((d: RawImages) => {
        const reportImgs = d.reportImgs.map((imgSrc, idx) => ({
          show: idx < 1 ? true : false,
          imgSrc,
        }))

        const staticImgs = d.staticImgs.map((imgSrc) => ({
          show: false,
          imgSrc,
        }))

        this.imgSrcs = { reportImgs, staticImgs }
      })
  },
  loadImage(imgSrcGrpName: string, imgIdx: number) {
    const prevIdx = imgIdx - 1
    let prevImgIsShown = true

    if (imgSrcGrpName === 'staticImgs')
      prevImgIsShown =
        prevIdx < 0
          ? this.imgSrcs['reportImgs'][this.imgSrcs['reportImgs'].length - 1].show
          : this.imgSrcs[imgSrcGrpName][prevIdx].show
    else prevImgIsShown = prevIdx < 0 ? true : this.imgSrcs[imgSrcGrpName][prevIdx].show

    if (prevImgIsShown) {
      this.imgSrcs[imgSrcGrpName][imgIdx].show = true
    }
  },
})

export { reportCtrl }
