  /*===========================================================================
    Filename: CangoZoomPan-3v00.js
    Rev: 2
    By: Dr A.R.Collins
    Description: This module exports the 'initZoomPan' function to effect
      zoom and pan controls on canvas graphics created with Cango.

    Copyright 2021-2024 A.R.Collins
    This program is free software, distributed in the hope that it will 
    be useful, but WITHOUT ANY WARRANTY.
    Giving credit to A.R.Collins <http://www.arc.id.au> would be appreciated.
    Report bugs to tony at arc.id.au.

    Date   |Description                                                   |By
    --------------------------------------------------------------------------
    19Sep21 Released as CangoZoomPan-1v00                                  ARC
    23Sep21 Update to use PathSVG rather than shapeDefs                    ARC
    07Feb23 Update to use Cango 26v09                                      ARC
    08Apr23 Make ZoomPan class to handle canvas resize                     ARC
    16Apr23 Released as CangoZoomPan-2v00                                  ARC
    22Mar24 bugfix: bad test for off-screen canvas support                 ARC
    21Mar25 Added options parameter                                        ARC
    21Mar25 Released as CangoZoomPan-3v00                                  ARC
   ===========================================================================*/

  // exposed global: initZoomPan

  const initZoomPan = function(gc, redraw, options={})
  {
    if (gc.cgoType !== "OS")
    {
      new ZoomPan(gc, redraw, options);
    }
    else
    {
      console.log("Zoom and Pan: no support for offscreen canvases");
    }
  }

  class ZoomPan {
    constructor(gc, redraw, opts)
    {
      this.gAry = (Array.isArray(gc))? gc : [gc];
      // find the background canvas
      this.bkgCvs = this.gAry[0].bkgCanvas;
      this.bkgCvs.zNp = this;
      this.bkgCvsId = this.bkgCvs.getAttribute("id");
      if (!this.bkgCvsId)
      {
        console.log("background canvas missing 'id'");
        return;
      }
      this.zpCvs = null;
      this.zpControlsId = null;
      this.zpScl = 1;
      let color = "white";
      const ctlWid = 114;
      this.setOptionProperty = (propertyName, value)=>
      {
        if ((typeof propertyName !== "string")||(value === undefined))
        {
          return;
        }
  
        switch (propertyName.toLowerCase())
        {
          case "width":
            if (49 < value && value < this.bkgCvs.offsetWidth/2)
            {
              this.zpScl = ctlWid/value;             
            }
            else
            {
              this.zpScl = 1;
            }
            break;
          case "strokecolor":
            if (typeof value === "string")
            {
              color = value;
            }
            else
            {
              color = "white";
            }
            break;
          default:
            break;
        }
      }
      for (let prop in opts)
      {
        if (opts.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
          this.setOptionProperty(prop, opts[prop]);
        }
      }
  
      const arw = ['m',-7,-2,'l',7,5,7,-5],
            crs = ['m',-6,-6,'l',12,12,'m',0,-12,'l',-12,12],
            pls = ['m',-7,0,'l',14,0,'m',-7,-7,'l',0,14],
            mns = ['m',-7,0,'l',14,0];
      const rst = new Shape(PathSVG.rectangle(20, 20, 2), {fillColor:"rgba(0,0,0,0.2)"});
      rst.enableClick(()=>this.reset());
      const rgt = new Shape(PathSVG.rectangle(20, 20, 2), {x:22, y:0, fillColor:"rgba(0,0,0,0.2)"});
      rgt.enableClick(()=>this.pan(50, 0));
      const up = new Shape(PathSVG.rectangle(20, 20, 2), {x:0, y:22, fillColor:"rgba(0,0,0,0.2)"});
      up.enableClick(()=>this.pan(0, -50));
      const lft = new Shape(PathSVG.rectangle(20, 20, 2), {x:-22, y:0, fillColor:"rgba(0,0,0,0.2)"});
      lft.enableClick(()=>this.pan(-50, 0));
      const dn = new Shape(PathSVG.rectangle(20, 20, 2), {x:0, y:-22, fillColor:"rgba(0,0,0,0.2)"});
      dn.enableClick(()=>this.pan(0, 50));
      const zin = new Shape(PathSVG.rectangle(20, 20, 2), {x:-56, y:11, fillColor:"rgba(0,0,0,0.2)"});
      zin.enableClick(()=>this.zoom(1/1.2));
      const zout = new Shape(PathSVG.rectangle(20, 20, 2), {x:-56, y:-11, fillColor:"rgba(0,0,0,0.2)"});
      zout.enableClick(()=>this.zoom(1.2));
      const upArw = new Path(arw, {x:0, y:22, strokeColor:color, lineWidth:2});
      const rgtArw = new Path(arw, {rot:-90, x:22, y:0, strokeColor:color, lineWidth:2});
      const lftArw = new Path(arw, {rot:90, x:-22, y:0, strokeColor:color, lineWidth:2});
      const dnArw = new Path(arw, {rot:180, x:0, y:-22, strokeColor:color, lineWidth:2});
      const zPls = new Path(pls, {x:-56, y:11, strokeColor:color, lineWidth:2});
      const zMns = new Path(mns, {x:-56, y:-11, strokeColor:color, lineWidth:2});
      const zRst = new Path(crs, {strokeColor:color, lineWidth:2});
      // make a shaded rectangle for the controls
      const frame = new Shape(PathSVG.rectangle(114, 80), {x:-17, y:0, fillColor: "rgba(0, 50, 0, 0.12)"});

      this.ctrls = new Group(frame, rst, rgt, up, lft, dn, zin, zout, upArw, rgtArw, lftArw, dnArw, zPls, zMns, zRst);

      this.drawZnPcontrols();
      
      this.redraw = redraw;
    }

    drawZnPcontrols() 
    { 
      // create a temporary Cango context to make a top layer 
      const bkgCgo = new Cango(this.bkgCvs);
      this.zpControlsId = bkgCgo.createLayer();
      this.zpGC = new Cango(this.zpControlsId);
      
      this.zpGC.setWorldCoordsRHC(-this.zpGC.rawWidth*this.zpScl+44, -this.zpGC.rawHeight*this.zpScl+44, bkgCgo.rawWidth*this.zpScl);  // default to pixels scaling
      this.zpGC.clearCanvas();
      this.zpGC.render(this.ctrls);
    }

    zoom(z)
    {
      this.gAry.forEach((g)=>{
        const org = g.toPixelCoords(0, 0),
              cx = g.rawWidth/2 - org.x,
              cy = g.rawHeight/2 - org.y;

        g.xoffset += cx - cx/z;
        g.yoffset += cy - cy/z;
        g.xscl /= z;
        g.yscl /= z;
      });
      this.redraw();
    }

    pan(sx, sy)
    {
      this.gAry.forEach((g)=>{
        g.xoffset -= sx;
        g.yoffset -= sy;
      });
      this.redraw();
    }

    reset()
    {
      this.gAry.forEach((g)=>{
        g.xscl = g.savWCscl.xscl;
        g.yscl = g.savWCscl.yscl;
        g.xoffset = g.savWCscl.xoffset;
        g.yoffset = g.savWCscl.yoffset;
      });
      this.redraw();
    }

    resize(w, h)
    {
      this.gAry.forEach((g)=>{
        g.rawWidth = w;
        g.rawHeight = h;
        g.aRatio = w/h;
        g.vpW = g.rawWidth;         // gridbox width in pixels (no gridbox, use full canvas)
        g.vpH = g.rawHeight;        // gridbox height in pixels, canvas height = width/aspect ratio
        g.vpOrgYsvg = 0;            // save vpOrgY, needed when switching between RHC and SVG and back
        g.vpOrgYrhc = g.rawHeight;  //   "

        const savXofs = g.vpOrgXWC,
              savYofs = g.vpOrgYWC, 
              savXspn = g.vpWWC, 
              savYspn = g.vpHWC;
        if (g.yDown)
        {
          // NOTE: setGridbox resets g.yDown and vpOrgXWC, vpOrgYWC, vpWWC, vpHWC
          g.setGridbox(g.savGB.lft, g.savGB.bot, g.savGB.spanX, g.savGB.spanY);  
          g.setWorldCoordsSVG(savXofs, savYofs, savXspn, savYspn);
    
        }
        else
        {
          g.setGridbox(g.savGB.lft, g.savGB.bot, g.savGB.spanX, g.savGB.spanY);
          g.setWorldCoordsRHC(savXofs, savYofs, savXspn, savYspn);
        }
      });
      this.reset();
    }
  }
