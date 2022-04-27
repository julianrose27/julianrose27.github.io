const osc = new Tone.Oscillator(440, "sine").toDestination();

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
  } else {
    osc.stop();
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
  osc.set({
    frequency: v
  })
})
