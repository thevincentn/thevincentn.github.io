/*==========================================================================
  Filename: CangoArrows-1v01.js
  Rev: 1
  By: Dr A.R.Collins
  Description: Arrow and ArrowArc classes extending Group for use with Cango
  library.

  Date   |Description                                                   |By
  --------------------------------------------------------------------------
  17Mar22 First beta                                                     ARC
  24Mar22 Corrected x,y parameters for non-iso world coords              ARC
  09Apr22 Use start and end coords as Arrow parameters                   ARC
  20Apr22 Released as CangoArrows-1v00                                   ARC
  ==========================================================================*/

// exposed globals: 
var Arrow, ArrowArc;

(function(){
  Arrow = class extends Group
  {
    constructor(baseX, baseY, tipX, tipY, opts={})
    {
      super();
      // added properties: x, y, shaftWidth, shaftWidthWC, headSize
      this.sx = baseX;       // start coords
      this.sy = baseY;
      this.ex = tipX;    // end (head) coords
      this.ey = tipY;
      this.hdSize = 4;
      this.shaftWidthWC = undefined;
      this.shaftWidth = undefined;
      this.options = opts;
      
      const setOptionProperty = (propertyName, value)=>
      {
        if ((typeof propertyName !== "string")||(value === undefined))
        {
          return;
        }
      
        switch (propertyName.toLowerCase())
        {
          case "headsize":
            if ( typeof value === "number" && value > 0)
            {
              this.hdSize = value;
            }
            break;
          case "shaftwidth": 
            if (typeof value === "number" && value > 0)
            {
              this.shaftWidth = value;
            }
            break;
          case "shaftwidthwc":
            if (typeof value === "number" && value > 0)
            {
              this.shaftWidthWC = value;
            }
            break;
          default:
            break;
        }
      };

      for (let prop in opts)
      {
        if (opts.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
          setOptionProperty(prop, opts[prop]);
        }
      }

      const arrowObj = new Shape(null);
      for (let prop in opts)  // pass on the style options
      {
        if (opts.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
          arrowObj.setStyleProperty(prop, opts[prop]);
        }
      }
      // override lorg if set, needed to keep shape in non-isotropic coords
      arrowObj.setStyleProperty("iso", true); 
      this.addObj(arrowObj);
    }

    dup()
    {
      const newArw = new Arrow(this.sx, this.sy, this.ex, this.ey, {
        headSize: this.hdSize,
        shaftWidthWC: this.shaftWidthWC,
        shaftWidth: this.shaftWidth
      });
      // the child is a Shape (the actual arrow) it has all the style properties so dup it
      newArw.children[0] = this.children[0].dup();
      newArw.children[0].parent = newArw;   // dup will have parent = null so fix that
      
      return newArw;
    }

    preRender(gc)
    {
      const yIso_to_WC = Math.abs(gc.yscl/gc.xscl); // converts world coords Y axis units to X axis units
      const PX_to_isoWC = 1/gc.xscl;

      function Point(px, py)
      { 
        return {x:px, y:py}; 
      }
      function dist(pt1, pt2)
      { 
        return Math.sqrt((pt1.x-pt2.x)*(pt1.x-pt2.x)+(pt1.y-pt2.y)*(pt1.y-pt2.y)); 
      }
      function rotatePoint(p, rads)
      {   // rotate a 2D point by 'rads' radians
        const sinA = Math.sin(rads),
              cosA = Math.cos(rads);
        return {x: p.x*cosA - p.y*sinA, y: p.x*sinA + p.y*cosA};
      }
      if (!this.hardTfmApplied)
      {      
        const dx = (this.ex-this.sx);             // x component of shaft length
        const dy = (this.ey-this.sy)*yIso_to_WC;  // y component
        const theta = Math.atan2(dy, dx);         // angle of the arrow to x axis
        const headAng = 21*Math.PI/180.0;         // half included angle of arrow head = 21deg

        let lineWid = gc.lineWidthDef*PX_to_isoWC;    // default lineWidth (in pixels) convert to WC
        // support for zoom and pan changing shaft width
        if (this.shaftWidthWC)
        {
          lineWid = this.shaftWidthWC;
        }
        else if (this.shaftWidth)
        {
          lineWid = this.shaftWidth*PX_to_isoWC;
        }

        const ds = 0.5*lineWid;
        const edgeLen = this.hdSize*lineWid;
        const headLen = edgeLen*Math.cos(headAng);  // length of arrow head along shaft
        // work in X axis units - and always draw with 'iso' true
        const org = new Point(0, 0);
        const tip = new Point(dx, dy);
        const len = dist(org, tip);
        // draw the arrow along the x axis
        const p1 = new Point(0, ds);
        const p2 = new Point(len-headLen, ds);
        const p3 = new Point(p2.x, edgeLen*Math.sin(headAng));
        const t = new Point(len, 0);
        const p4 = new Point(p3.x, -p3.y);
        const p5 = new Point(p2.x, -p2.y);
        const p6 = new Point(p1.x, -p1.y);
        const arwData = [p1, p2, p3, t, p4, p5, p6];
        // rotate array of points by theta then translate drawing origin to sx, sy
        const arwRotated = arwData.map(function(pt){ return rotatePoint(pt, theta)});
        // convert to array ['M', x0, y0, x1, y1, x2, y2 ...]
        const arrowDef = arwRotated.reduce(function(acc, curr){
          acc.push(curr.x, curr.y);
          return acc; }, ["M"]);     // start with an 'M' command
        // insert the "L" at start of the line segments just for clarity (works fine without this)
        arrowDef.splice(3, 0, "L");
        arrowDef.push("Z");  // close the path for future filling

        this.children[0].setDescriptor(arrowDef);

        for (let prop in this.options)
        {
          if (prop !== "x" && prop !== "X" && prop !== "y" && prop !== "Y")
          {
            this.addTransformProperty(prop, this.options[prop]);}
        }
        this.addTransformProperty("x", this.sx);
        this.addTransformProperty("y", this.sy);
        
        this.hardTfmApplied = true;
      }
    }
  };

  ArrowArc = class extends Group
  {
    constructor(radius, startAngle, stopAngle, opts={})
    {
      function mod(val, n) {return ((val % n) + n) % n;};

      super();
      // This will create an arc centred on (0,0) radius r, from angle 'startAngle' to 'stopAngle' (deg)
      // arrow head will be at stop end only, arrow head in proportion to shaft width
      this.r = radius || 1;
      this.startA = mod(startAngle, 360);   // move angle to 0..360
      this.stopA = mod(stopAngle, 360);
      this.clockwise =false;
      this.hdSize = opts.headSize || 4;
      this.shaftWidthWC = undefined;
      this.shaftWidth = undefined;
      this.options = opts;
      
      this.setOptionProperty = (propertyName, value)=>
      {
        if ((typeof propertyName !== "string")||(value === undefined))
        {
          return;
        }
      
        switch (propertyName.toLowerCase())
        {
          case "headsize":
            if ( typeof value === "number" && value > 0)
            {
              this.hdSize = value;
            }
            break;
          case "shaftwidth": 
            if (typeof value === "number" && value > 0)
            {
              this.shaftWidth = value;
            }
            break;
          case "shaftwidthwc":
            if (typeof value === "number" && value > 0)
            {
              this.shaftWidthWC = value;
            }
            break;
          case "clockwise":
            if (value)
            {
              this.clockwise = true;
            }
            break;
          default:
            break;
        }
      };
              
      for (let prop in opts)
      {
        if (opts.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
          this.setOptionProperty(prop, opts[prop]);
        }
      }

      const arrowObj = new Shape(null, opts);   // pass on all the opts hard and soft
      this.addObj(arrowObj);
    }

    dup()
    {
      const newArw = new ArrowArc(this.r, this.startA, this.stopA, {
        clockwise: this.clockwise,
        headSize: this.hdSize,
        shaftWidthWC: this.shaftWidthWC,
        shaftWidth: this.shaftWidth
      });
      // the child is a Shape (the actual arrow) it has all the style properties so dup it
      newArw.children[0] = this.children[0].dup();
      newArw.children[0].parent = newArw;   // dup will have parent = null so fix that
      
      return newArw;
    }

    preRender(gc)
    {
      const PX_to_isoWC = 1/gc.xscl;
      const angSweep = (this.startA > this.stopA)? 1: 0;  // 1 = CW 0 = CCW
      const toRad = Math.PI/180;

      if (!this.hardTfmApplied)
      {
        let lineWid = gc.lineWidthDef*PX_to_isoWC;
        // support for zoom and pan changing shaft width
        if (this.shaftWidthWC)
        {
          lineWid = this.shaftWidthWC;
        }
        else if (this.shaftWidth)
        {
          lineWid = this.shaftWidth*PX_to_isoWC;
        }
        let sweep = this.clockwise? 1: 0;
        let sgnY = -1;

        const ds = 0.5*lineWid;
        const r1 = this.r-ds;
        const r2 = this.r+ds;
        const headSpanWC = 0.95*this.hdSize*lineWid; // length of arrow head along arc (in world coords)
        let headSpanRad = headSpanWC/this.r;         // length of arrow head in radians
        let span = angSweep? this.startA - this.stopA: this.stopA - this.startA;
        if ((angSweep && !sweep)||(!angSweep && sweep))     // XOR = going the wrong way round
        {
          // default is the wrong direction switch direction
          span = 360 - span;
        }
        const spanRad = span*toRad;
        let lrg = (span>180)? 1: 0;
        // make sure span is bigger than arrow head
        if (headSpanRad > spanRad)   // make arc at least as big as the requested head size
        {
          headSpanRad = spanRad;
        }
        // handle the inverted coord where Cango must reverse direction to maintain the sweep=CW convention
        if (gc.yDown)
        {
          lrg = 1 - lrg;
          sgnY = 1;
        }
        else
        {
          sweep = 1 - sweep;
        }
        // construct the nodes of the arrow shape
        const stopRad = sgnY*this.stopA*toRad;
        const startRad = sgnY*this.startA*toRad;
        const baseA = sweep? stopRad-sgnY*headSpanRad: stopRad+sgnY*headSpanRad;  // angle at base of arrow head
        const qr1 = this.r-0.35*headSpanWC,             // 0.35 is sin(21) deg tilt angle of head sides
              qr2 = this.r+0.35*headSpanWC,
              b1x = r1*Math.cos(startRad),
              b1y = r1*Math.sin(startRad)*sgnY,
              e1x = r1*Math.cos(baseA),
              e1y = r1*Math.sin(baseA)*sgnY,
              b2x = r2*Math.cos(startRad),
              b2y = r2*Math.sin(startRad)*sgnY,
              e2x = r2*Math.cos(baseA),
              e2y = r2*Math.sin(baseA)*sgnY,
              tx = this.r*Math.cos(stopRad),
              ty = this.r*Math.sin(stopRad)*sgnY,
              q1x = qr1*Math.cos(baseA),
              q1y = qr1*Math.sin(baseA)*sgnY,
              q2x = qr2*Math.cos(baseA),
              q2y = qr2*Math.sin(baseA)*sgnY;

        const arrowDef = ["M", b2x,b2y, "A",r2,r2,0,lrg,sweep,e2x,e2y, "L", q2x,q2y, "A",qr2,qr2,0,0,sweep,tx,ty, "A",qr1,qr1,0,0,1-sweep,q1x,q1y, "L",e1x,e1y, "A",r1,r1,0,lrg,1-sweep,b1x,b1y, "Z"];

        this.children[0].setDescriptor(arrowDef);
        this.children[0].setStyleProperty("iso", true);  // needed to keep shape in non-isotropic coords
 
        this.hardTfmApplied = true;
      }
    }
  };

//===============================================================================

  Cango.prototype.drawArrow = function(baseX, baseY, tipX, tipY, opts={})
  {
    const arrow = new Arrow(baseX, baseY, tipX, tipY, opts);
    this.render(arrow);
  }

  Cango.prototype.drawArrowArc = function(radius, startAngle, stopAngle, opts={})
  {
    const arrowArc = new ArrowArc(radius, startAngle, stopAngle, opts);
    this.render(arrowArc);
  }

})();