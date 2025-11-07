import React from "react"
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import "../../App.css"

export default function CustomSlider({
  width,
  id,
  min,
  max,
  step,
  tempRange,
  setTempRange,
  range,
  setRange,
  // isInfoRefDisplayed,
  // infoRef,
  thumbsDisabled,
  rangeSlideDisabled,
  infoRefText,
}) {
  return (
    <div className={`w-[${width}] flex items-center gap-2`}>
      <div className="text-xs font-semibold text-gray-600">{min}</div>
      <div
        className="w-full flex justify-center"
        // onHover={() => console.log("hovering")}
      >
        <RangeSlider
          id={id}
          className="range-slider-rating"
          min={min}
          max={max}
          step={step}
          value={[tempRange[0], tempRange[1]]}
          thumbsDisabled={thumbsDisabled}
          rangeSlideDisabled={rangeSlideDisabled}
          onInput={(value, userInteraction) => {
            // if (userInteraction) {
            setTempRange([value[0], value[1]])
            // }
          }}
          onThumbDragEnd={() => setRange([tempRange[0], tempRange[1]])}
          onRangeDragEnd={() => setRange([tempRange[0], tempRange[1]])}
        />
        {/* 
        <small
          className="absolute w-[5rem] flex items-center justify-center mt-6 z-20 transition-all duration-600 ease-out opacity-100">
          {infoRefText}
        </small> */}
      </div>
      <div className="text-xs font-semibold text-gray-600">{max}</div>
    </div>
  )
}
