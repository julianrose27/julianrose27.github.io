var dragInterval = 100;
var sineFreq = 440;
var dragger;

const osc = new Tone.Oscillator(sineFreq, "sine").toDestination();

//------------------------------------------------------------------------------
// Frequency Drag Logic --------------------------------------------------------
//------------------------------------------------------------------------------
function drag() {
  console.log('hello');
  // sine oscillator
  sineFreq = sineFreq*0.995;
  osc.frequency.rampTo(sineFreq, 0.4);
  freqSlider.value = sineFreq;
}

//------------------------------------------------------------------------------
// Play Button -----------------------------------------------------------------
//------------------------------------------------------------------------------
var playBtn = new Nexus.Button('#playBtn', {
  'mode': 'toggle'
})
// start and stop the oscillator
playBtn.on('change', function(v) {
  if (playBtn.state) {
    osc.start();
    dragger = setInterval(drag, dragInterval);
  } else {
    osc.stop();
    clearInterval(dragger);
  }
})

//------------------------------------------------------------------------------
// Oscillator Frequency Slider -------------------------------------------------
//------------------------------------------------------------------------------
var freqSlider = new Nexus.Slider('#freqSlider',{
    'size': [120,20],
    'mode': 'relative',  // 'relative' or 'absolute'
    'min': 20,
    'max': 1000,
    'step': 0,
    'value': 440
})
// adjust the frequency of the oscillator when the slider value is changed
freqSlider.on('change', function(v) {
  console.log(v);
  sineFreq = v;
  osc.frequency.rampTo(sineFreq, 0.4);
})
