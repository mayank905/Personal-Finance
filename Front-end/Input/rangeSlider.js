const rangeSlider = document.getElementById('rangeSlider');
const sliderThumb = document.getElementById('sliderThumb');

rangeSlider.addEventListener('click', function(event) {
  const sliderRect = rangeSlider.getBoundingClientRect();
  const sliderWidth = sliderRect.width;
  const clickX = event.clientX - sliderRect.left;
  const rangeValue = Math.round((clickX / sliderWidth) * 100);

  updateSliderThumbPosition(clickX);
  updateRangeValue(rangeValue);
});

function updateSliderThumbPosition(clickX) {
  const sliderThumbWidth = sliderThumb.offsetWidth;
  const thumbPosition = Math.max(0, Math.min(clickX - (sliderThumbWidth / 2), rangeSlider.offsetWidth - sliderThumbWidth));
  sliderThumb.style.left = thumbPosition + 'px';
}

function updateRangeValue(rangeValue) {
  console.log('Range Value:', rangeValue);
  // You can perform additional actions based on the range value
}
