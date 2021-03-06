const canvasEl = document.getElementById('can');
const ctx = canvasEl.getContext("2d");
const tempCanvas = document.createElement("canvas");
const tempCtx = tempCanvas.getContext("2d");

canvasEl.width = 1000;
canvasEl.height = 800;

let mousePressed = false;
let lastX, lastY;
let stPoint;
let endPoint;
let pickedColor = window.activeColor;

(function () {
  const $ = function (id) {
    return document.getElementById(id)
  };

  canvas = this.__canvas = new fabric.Canvas('can', {
    isDrawingMode: true
    // backgroundColor: '#fff'
  });

  canvas.renderAll();

  fabric.Object.prototype.transparentCorners = false;

  const drawingModeEl = $('drawing-mode'),
    drawingOptionsEl = $('drawing-mode-options'),
    drawingColorEl = $('drawing-color'),
    drawingShadowColorEl = $('drawing-shadow-color'),
    drawingLineWidthEl = $('drawing-line-width'),
    drawingShadowWidth = $('drawing-shadow-width'),
    drawingShadowOffset = $('drawing-shadow-offset'),
    clearEl = $('clear-canvas');

  // clearEl.onclick = function() { canvas.clear() };

  drawingModeEl.onclick = function () {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Cancel drawing mode';
      drawingOptionsEl.style.display = '';
    } else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
      drawingOptionsEl.style.display = 'none';
    }
  };

  if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function () {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function () {

      var squareWidth = 10,
        squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function () {

      var squareWidth = 10,
        squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({
        left: canvasWidth / 2,
        top: canvasWidth / 2
      });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    var img = new Image();
    img.src = '../assets/honey_im_subtle.png';

    var texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
  }

  $('drawing-mode-selector').onchange = function () {

    if (this.value === 'hline') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    } else if (this.value === 'vline') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    } else if (this.value === 'square') {
      canvas.freeDrawingBrush = squarePatternBrush;
    } else if (this.value === 'diamond') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    } else if (this.value === 'texture') {
      canvas.freeDrawingBrush = texturePatternBrush;
    } else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };

  drawingColorEl.onchange = function () {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingShadowColorEl.onchange = function () {
    canvas.freeDrawingBrush.shadow.color = this.value;
  };
  drawingLineWidthEl.onchange = function () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowWidth.onchange = function () {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };
  drawingShadowOffset.onchange = function () {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
  }
  var webglBackend = new fabric.WebglFilterBackend();
  var canvas2dBackend = new fabric.Canvas2dFilterBackend()

  fabric.filterBackend = fabric.initFilterBackend();
  fabric.Object.prototype.transparentCorners = false;

  function applyFilter(index, filter) {
    var obj = canvas.getActiveObject();
    obj.filters[index] = filter;
    var timeStart = +new Date();
    obj.applyFilters();
    var timeEnd = +new Date();
    var dimString = canvas.getActiveObject().width + ' x ' +
      canvas.getActiveObject().height;
    canvas.renderAll();
  }

  function getFilter(index) {
    var obj = canvas.getActiveObject();
    return obj.filters[index];
  }

  function applyFilterValue(index, prop, value) {
    var obj = canvas.getActiveObject();
    if (obj.filters[index]) {
      obj.filters[index][prop] = value;
      var timeStart = +new Date();
      obj.applyFilters();
      var timeEnd = +new Date();
      var dimString = canvas.getActiveObject().width + ' x ' +
        canvas.getActiveObject().height;
      canvas.renderAll();
    }
  }

  fabric.Object.prototype.padding = 5;
  fabric.Object.prototype.transparentCorners = false;

  var f = fabric.Image.filters;

  canvas.on({
    'object:selected': function () {
      fabric.util.toArray(document.getElementsByTagName('input'))
        .forEach(function (el) {
          el.disabled = false;
        })

      var filters = ['grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
        'brightness', 'contrast', 'saturation', 'noise', 'vintage',
        'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
        'polaroid', 'blend-color', 'gamma', 'kodachrome',
        'blackwhite', 'blend-image', 'hue', 'resize'
      ];

      for (var i = 0; i < filters.length; i++) {
        $(filters[i]) && (
          $(filters[i]).checked = !!canvas.getActiveObject().filters[i]);
      }
    },
    'selection:cleared': function () {
      fabric.util.toArray(document.getElementsByTagName('input'))
        .forEach(function (el) {
          el.disabled = true;
        })
    }
  });

  var indexF;
  $('webgl').onclick = function () {
    if (this.checked) {
      fabric.filterBackend = webglBackend;
    } else {
      fabric.filterBackend = canvas2dBackend;
    }
  };
  $('brownie').onclick = function () {
    applyFilter(4, this.checked && new f.Brownie());
  };
  $('vintage').onclick = function () {
    applyFilter(9, this.checked && new f.Vintage());
  };
  $('technicolor').onclick = function () {
    applyFilter(14, this.checked && new f.Technicolor());
  };
  $('polaroid').onclick = function () {
    applyFilter(15, this.checked && new f.Polaroid());
  };
  $('kodachrome').onclick = function () {
    applyFilter(18, this.checked && new f.Kodachrome());
  };
  $('blackwhite').onclick = function () {
    applyFilter(19, this.checked && new f.BlackWhite());
  };
  $('grayscale').onclick = function () {
    applyFilter(0, this.checked && new f.Grayscale());
  };
  $('invert').onclick = function () {
    applyFilter(1, this.checked && new f.Invert());
  };
  $('sepia').onclick = function () {
    applyFilter(3, this.checked && new f.Sepia());
  };
  $('brightness').onclick = function () {
    applyFilter(5, this.checked && new f.Brightness({
      brightness: parseFloat($('brightness-value').value)
    }));
  };
  $('brightness-value').oninput = function () {
    applyFilterValue(5, 'brightness', parseFloat(this.value));
  };
  $('gamma').onclick = function () {
    var v1 = parseFloat($('gamma-red').value);
    var v2 = parseFloat($('gamma-green').value);
    var v3 = parseFloat($('gamma-blue').value);
    applyFilter(17, this.checked && new f.Gamma({
      gamma: [v1, v2, v3]
    }));
  };
  $('gamma-red').oninput = function () {
    var current = getFilter(17).gamma;
    current[0] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-green').oninput = function () {
    var current = getFilter(17).gamma;
    current[1] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('gamma-blue').oninput = function () {
    var current = getFilter(17).gamma;
    current[2] = parseFloat(this.value);
    applyFilterValue(17, 'gamma', current);
  };
  $('contrast').onclick = function () {
    applyFilter(6, this.checked && new f.Contrast({
      contrast: parseFloat($('contrast-value').value)
    }));
  };
  $('contrast-value').oninput = function () {
    applyFilterValue(6, 'contrast', parseFloat(this.value));
  };
  $('saturation').onclick = function () {
    applyFilter(7, this.checked && new f.Saturation({
      saturation: parseFloat($('saturation-value').value)
    }));
  };
  $('saturation-value').oninput = function () {
    applyFilterValue(7, 'saturation', parseFloat(this.value));
  };
  $('noise').onclick = function () {
    applyFilter(8, this.checked && new f.Noise({
      noise: parseInt($('noise-value').value, 10)
    }));
  };
  $('noise-value').oninput = function () {
    applyFilterValue(8, 'noise', parseInt(this.value, 10));
  };
  $('pixelate').onclick = function () {
    applyFilter(10, this.checked && new f.Pixelate({
      blocksize: parseInt($('pixelate-value').value, 10)
    }));
  };
  $('pixelate-value').oninput = function () {
    applyFilterValue(10, 'blocksize', parseInt(this.value, 10));
  };
  $('blur').onclick = function () {
    applyFilter(11, this.checked && new f.Blur({
      value: parseFloat($('blur-value').value)
    }));
  };
  $('blur-value').oninput = function () {
    applyFilterValue(11, 'blur', parseFloat(this.value, 10));
  };
  $('sharpen').onclick = function () {
    applyFilter(12, this.checked && new f.Convolute({
      matrix: [0, -1, 0, -1, 5, -1,
        0, -1, 0
      ]
    }));
  };
  $('emboss').onclick = function () {
    applyFilter(13, this.checked && new f.Convolute({
      matrix: [1, 1, 1,
        1, 0.7, -1, -1, -1, -1
      ]
    }));
  };
  $('blend').onclick = function () {
    applyFilter(16, this.checked && new f.BlendColor({
      color: document.getElementById('blend-color').value,
      mode: document.getElementById('blend-mode').value,
      alpha: document.getElementById('blend-alpha').value
    }));
  };

  $('blend-mode').onchange = function () {
    applyFilterValue(16, 'mode', this.value);
  };

  $('blend-color').onchange = function () {
    applyFilterValue(16, 'color', this.value);
  };

  $('blend-alpha').oninput = function () {
    applyFilterValue(16, 'alpha', this.value);
  };

  $('hue').onclick = function () {
    applyFilter(21, this.checked && new f.HueRotation({
      rotation: document.getElementById('hue-value').value,
    }));
  };

  $('hue-value').oninput = function () {
    applyFilterValue(21, 'rotation', this.value);
  };
})();