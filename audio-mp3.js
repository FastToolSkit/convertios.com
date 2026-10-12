/*
 * Shared MP3 encoder for Convertios audio tools.
 * Encodes an AudioBuffer (or a slice of it) to MP3 with lamejs, keeping
 * stereo when the source has two or more channels, and clamping samples so
 * loud audio does not wrap around and distort.
 */
(function () {
  function toInt16(source, from, to) {
    var out = new Int16Array(to - from);
    for (var i = from; i < to; i++) {
      var v = source[i];
      if (v > 1) v = 1;
      else if (v < -1) v = -1;
      out[i - from] = v < 0 ? v * 32768 : v * 32767;
    }
    return out;
  }

  window.encodeMp3 = function (audioBuffer, startSample, endSample, kbps) {
    if (typeof lamejs === 'undefined') {
      throw new Error('MP3 encoder failed to load. Check your connection and try again.');
    }
    var start = Math.max(0, startSample || 0);
    var end = Math.min(audioBuffer.length, endSample == null ? audioBuffer.length : endSample);
    var stereo = audioBuffer.numberOfChannels > 1;
    var left = audioBuffer.getChannelData(0);
    var right = stereo ? audioBuffer.getChannelData(1) : null;
    var encoder = new lamejs.Mp3Encoder(stereo ? 2 : 1, audioBuffer.sampleRate, kbps || 192);
    var blockSize = 1152;
    var data = [];

    for (var i = start; i < end; i += blockSize) {
      var stop = Math.min(i + blockSize, end);
      var l = toInt16(left, i, stop);
      var chunk = stereo ? encoder.encodeBuffer(l, toInt16(right, i, stop)) : encoder.encodeBuffer(l);
      if (chunk.length > 0) data.push(chunk);
    }

    var tail = encoder.flush();
    if (tail.length > 0) data.push(tail);
    return data;
  };
})();
