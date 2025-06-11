/*===========================================================================
  Filename: CangoAnimation-13v02.js
  Rev 13
  By: A.R.Collins
  Description: This file augments the core Cango object with
               animation methods

  Copyright 2014-2020 A.R.Collins
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
  For more detail about the GNU General Public License see
  <https://www.gnu.org/licenses/>.
    
  Giving credit to A.R.Collins <http://www.arc.id.au> would be appreciated.
  Report bugs to tony at arc.id.au.

  Date    Description                                                   |By
  --------------------------------------------------------------------------
  11May14 First release                                                  ARC
  21Jul14 Released as Version 2                                          ARC
  01Dec15 Released as Version 3                                          ARC
  02Feb16 Released as Version 4                                          ARC
  30Mar17 Released as Version 5                                          ARC
  09Jun17 Released as Version 6                                          ARC
  20Feb20 Released as Version 7                                          ARC
  08Mar20 Track requires SVGsegs as argument                             ARC
  06Jul20 bugfix: getPosAry didn't handle "noloop" option                ARC
          Added drawTextOnTrack method                                   ARC
  07Jul20 Use Track class from Cango
          Rename TrackTweener to PathTweener                             ARC
  10Jul20 Released as Version 8                                          ARC
  09Aug20 If frameRate set, call pathFn at least at frameRate            ARC
  27Nov20 bugfix: bad range check on dists values in getDist             ARC
  02Apr21 Drop the initFn use pathFn and time=0                          ARC
  04Apr21 Released as Version 9                                          ARC
  13Jun21 Added setAnimationProperty (from Cango.setPropertyDefault)     ARC
  26Jun21 Changed PathTweener to use SVGsegs array not Path object       ARC
  02Jul21 Released as Version 10                                         ARC
  05Jul21 Use SVGsegs path not Track (made private in SVGpathUtils-6v01) ARC
  08Jul21 Use getPointAtLength instead of distToPos                      ARC
  23Sep21 Update to use PathSVG rather than SVGsegs                      ARC
  23Nov21 Made getVal time argument loop to match Tweener                ARC
  01Dec21 Added BoneArray and WideBoneArray objects                      ARC
  01Dec21 Released as Version 11                                         ARC
  08Dec21 Remove need for head, use Node Object for lobes linking        ARC
  03Jul22 Add linkObj method to BoneArray and WideBoneArray              ARC
  10Jun24 bugfix: WideBoneArray p and s nodes not offset                 ARC
  21Jun24 Complete refactor of BoneArray and drop WideBoneArray          ARC
  01Jul24 bugfix: frameRate setting ignored                              ARC
  02Aug24 Added requestFrame to AnimObj                                  ARC
  06Aug24 Removed 'manualClear' property use from options
          Removed auto canvas clearing, app drawFn should handle it      ARC
  07Feb25 Update to use Cango-29v00                                      ARC
  08Feb25 Released as Version 13                                         ARC
  21Apr25 Remove preview method, call as part of Bone.rotate             ARC
 ===========================================================================*/

let Tweener, PathTweener, BoneArray;

(function()  // Cango must be declared a global before this file is loaded
{
  "use strict";
  function mod(val, n) {return ((val % n) + n) % n;}

  Tweener = class 
  {
    constructor(delay, duration, loopStr)  // interpolates between values held in an array
    {
      this.delay = delay || 0;
      this.dur = duration || 5000;
      this.reStartOfs = 0;
      this.loop = false;
      this.loopAll = false;

      if (typeof loopStr === 'string')
      {
        const loopParm = loopStr.toLowerCase();
        this.loop = (loopParm === 'loop');
        this.loopAll = (loopParm === 'loopall');
      }
    }

    getVal(rawTime, vals, keyTimes)
    { 
      // 'vals' is an array of key frame values (or a static number)
      let time = rawTime,
          slabDur,
          slab,
          frac,
					localTime;

      if (this.loop) // 
      {
        time = mod(rawTime, this.dur);
      }
      else if (this.loopAll)
      {
        time = mod(rawTime, this.delay+this.dur);
      }
      if (time === 0)   // re-starting after a stop, otherwise this can increase forever (looping is handled here)
      {
        this.reStartOfs = 0;    // reset this to prevent negative times
      }
      localTime = time - this.reStartOfs;       // handles local looping
      if ((localTime > this.dur+this.delay) && (this.dur > 0) && (this.loop || this.loopAll))
      {
        this.reStartOfs = this.loop? time - this.delay : time;  // we will correct external time to re-start
        localTime = 0;          // force re-start at frame 0 now too
      }

      let t = 0;    // t is the actual local time value used for interpolating
      if (localTime > this.delay)    // repeat initial frame (t=0) if there is a delay to start
      {
        t = localTime - this.delay;  // localTime is constrained to 0 < localTime < this.dur
      }

      if (!Array.isArray(vals))      // not an array, just a static value, return it every time
      {
        return vals;
      }
      if (!vals.length)
      {
        return 0;
      }
      if (vals.length === 1)
      {
        return vals[0];
      }
      // we have at least 2 element array of values
      if (t === 0)
      {
        return vals[0];
      }
      if (t >= this.dur)
      {
        return vals[vals.length-1];  // freeze at end value
      }
      const numSlabs = vals.length-1;
      if (!Array.isArray(keyTimes) || (vals.length !== keyTimes.length))
      {
        slabDur = this.dur/numSlabs;
        slab = Math.floor(t/slabDur);
        frac = (t - slab*slabDur)/slabDur;

        return vals[slab] + frac*(vals[slab+1] - vals[slab]);
      }

      // we have keyTimes to play work with copies of arrays
      const values = [].concat(vals);
      const times = [].concat(keyTimes);
      // make sure times start with 0
      if (times[0] !== 0)
      {
        values.unshift(values[0]);
        times.unshift(0);
      }
      // make sure times end with 100
      if (times[times.length-1] !== 100)
      {
        values.push(values[values.length-1]);
        times.push(100);
      }
      const tFrac = t/this.dur;
      let i = 0;
      while ((i < times.length-1) && (times[i+1]/100 < tFrac))
      {
        i++;
      }
      slabDur = (times[i+1]-times[i])/100;
      frac = (tFrac - times[i]/100)/slabDur;    // convert percentage time to fraction

      return values[i] + frac*(values[i+1] - values[i]);
    }
  };

  PathTweener = class   
  {
    constructor(pth, delay, duration, loopStr)  // interpolates between values held in an array
    {
      if (!(pth instanceof PathSVG))
      {
        console.warn("Type Error: PathTweener argument 1 not an PathSVG object");
        return;
      }
      this.track = pth;
      this.delay = delay || 0;
      this.dur = duration || 5000;
      this.reStartOfs = 0;
      this.loop = false;
      this.loopAll = false;

      if (typeof loopStr === 'string')
      {
        const loopParm = loopStr.toLowerCase();
        this.loop = (loopParm === 'loop');
        this.loopAll = (loopParm === 'loopall');
      }
    }

   /*========================================================
    * 'getDist' takes the 'time' the current time along the 
    * timeline and uses the keyTime values and corresponding 
    * dists values to calculate the % distance along the track 
    * this time corresponds to.
    * returns % distance along total track
    *-------------------------------------------------------*/
    getDist(rawTime, dists=[], keyTimes)
    {
      let time = rawTime,
          localTime;

      if (this.loop) // 
      {
        time = mod(rawTime, this.dur);
      }
      else if (this.loopAll)
      {
        time = mod(rawTime, this.delay+this.dur);
      }
      if (time === 0)       // re-starting after a stop, otherwise this can increase forever (looping is handled here)
      {
        this.reStartOfs = 0;     // reset this to prevent negative times
      }

      localTime = time - this.reStartOfs;       // handles local looping
      if ((localTime > this.dur+this.delay) && (this.dur > 0) && (this.loop || this.loopAll))
      {
        this.reStartOfs = this.loop? time - this.delay : time;      // we will correct external time to re-start
        localTime = 0;          // force re-start at frame 0 now too
      }

      let t = 0;    // t is the actual local time value used for interpolating
      if (localTime > this.delay)    // repeat initial frame (t=0) if there is a delay to start
      {
        t = localTime - this.delay;   // localTime is constrained to 0 < localTime < this.dur
      }

      if (typeof(dists) == "number")    // not an array, just a static value, return it every time
      {
        if (0<=dists && dists<=100)
        {
          return dists;
        }
        console.warn("Range Error: TrackTweener.getDist argument 2 (0 .. 100)");
        return 0;
      }
      if (!Array.isArray(dists))
      {
        console.warn("Type Error: TrackTweener.getDist argument 2");
        return 0;
      }
      if (!dists.length)
      {
        return 0;
      }
      if (dists.length === 1)
      {
        return dists[0];
      }
      // check all distances are percent of total
      for (let i=0; i<dists.length; i++)
      {
        if (dists[i]<0 || dists[i]>100)
        {
          console.warn("Range Error: TrackTweener.getDist argument 2 (0 .. 100)");
          return 0;
        }
      }
      // we have at least 2 element array of dists
      if (t === 0)
      {
        return dists[0];
      }
      if (t >= this.dur)
      {
        return dists[dists.length-1];  // freeze at end value
      }
      const numSlabs = dists.length-1;
      if (!Array.isArray(keyTimes) || (dists.length !== keyTimes.length))
      {
        const slabDur = this.dur/numSlabs;
        const slab = Math.floor(t/slabDur);
        const frac = (t - slab*slabDur)/slabDur;

        return dists[slab] + frac*(dists[slab+1] - dists[slab]);
      }

      // we have keyTimes to play work with copies of arrays
      const distances = [].concat(dists);
      const times = [].concat(keyTimes);
      // make sure times start with 0
      if (times[0] !== 0)
      {
        distances.unshift(distances[0]);
        times.unshift(0);
      }
      // make sure times end with 100
      if (times[times.length-1] !== 100)
      {
        distances.push(distances[distances.length-1]);
        times.push(100);
      }
      const tFrac = t/this.dur;
      let i = 0;
      while ((i < times.length-1) && (times[i+1]/100 < tFrac))
      {
        i++;
      }
      const slabDur = (times[i+1]-times[i])/100;
      const frac = (tFrac - times[i]/100)/slabDur;    // convert percentage time to fraction

      return distances[i] + frac*(distances[i+1] - distances[i]);
    }

   /*==============================================================
    * getPos calculates a position along a Track at some specified 
    * time along an animation timeline.
    * 'time' is the specified time (along a Timeline) 
    * 'dists' is an array of distances along track (% total track length), 
    * 'keyTimes' is an array of times to be at each 'dists' val 
    * getPos returns an object {x:, y:, gradient: } representing 
    * world coords of the track position and the track gradient 
    * at that point.
    *-------------------------------------------------------------*/
    getPos(time, dists, keyTimes)
    {
      const tLen = this.track.getTotalLength();
      // TrackTweener.getDist returns % distance travelled at time 'time' along total track
      const currDist = tLen*this.getDist(time, dists, keyTimes)/100;  // convert to world coord distance

      return this.track.getPointAtLength(currDist);   // convert to a world coord location and return
    }

  };

  class AnimObj
  { 
    constructor(id, gc, drawFn, pathFn, options)
    {
      this.id = id;
      this.gc = gc;        // the Cango context to do the drawing
      this.drawFn = drawFn;
      this.pathFn = pathFn;
      this.options = options || {};
      this.currState = {time:0};  // consider as read-only
      this.nextState = {time:0};  // properties can be added to this (becomes the currState after frame is drawn)
      this.gc.ctx.save();

      if (typeof this.pathFn === "function")
      {
        this.pathFn.call(this, 0, this.options);   // put obj at 0 time position
      }
      // draw the object as setup by initFn (pathFn not called yet)
      if (typeof this.drawFn === "function")
      {
        this.drawFn.call(this, this.options);   // call user custom function
      }
      else
      {
        console.log("invalid animation draw function");
      }
      this.gc.ctx.restore();  // if initFn makes changes to ctx restore to pre-initFn state
      // now it has been drawn save the currState values (nextState values are generated by pathFn)
      for (let prop in this.nextState)   // if initFn creates new properties, make currState match
      {
        if (this.nextState[prop] !== undefined)
        {
          this.currState[prop] = this.nextState[prop];
        }
      }
    }

    requestFrame(timeToFrame) {
      this.currState.time += timeToFrame;  // move time as if currFrame just drawn
      if (typeof this.drawFn === "function")
      {
        this.drawFn.call(this, this.options); 
      }
    }
  }

	//===============================================================================

  class Timeline 
  {
    constructor()
    {
      this.animTasks = [];              // each layer can push an AnimObj object in here
      this.timer = null;                // need to save the RAF id for cancelling
      this.modes = {PAUSED:1, STOPPED:2, PLAYING:3, STEPPING:4};     // animation modes
      this.animMode = this.modes.STOPPED;
      this.prevAnimMode = this.modes.STOPPED;
      this.startTime = 0;               // animation start time (relative to 1970)
      this.startOfs = 0;                // used if play calls with non-zero start time
      this.currTime = 0;                // timestamp of frame on screen
      this.stepTime = 50;               // animation step time interval (in msec)
      this.frameRate = undefined;       // if undefined free run using RAF utility (set by Cango.setPropertyDefault)
      this.interval = 0;                // recalculated from frameRate each playAnimation call
    }

    // this is the actual animator that draws the frame
    drawFrame() {
      const time = Date.now();    // use this as a time stamp, browser don't all pass the same time code

      if (this.prevAnimMode === this.modes.STOPPED)
      {
        this.startTime = time - this.startOfs;   // forces localTime = 0 to start from beginning
      }
      const localTime = time - this.startTime;
      // step through all the animation tasks
      this.animTasks.forEach((at)=>{
        at.gc.ctx.save();
        // if re-starting after a stopAnimation reset the currState.time so pathFn doesn't get negative time between frames
        if (this.prevAnimMode === this.modes.STOPPED)
        {
          at.currState.time = 0;    // avoid -ve dT (=localTime-currState.time) in pathFn
        }
        if (typeof(at.pathFn) === 'function')  // static objects may have null or undefined
        {
          at.pathFn.call(at, localTime, at.options);
        }
        if (typeof at.drawFn === "function")
        {
          at.drawFn.call(at, at.options); 
        }
        at.gc.ctx.restore(); // if pathFn changes any ctx properties restore to pre pathFn state
        // now swap the currState and nextState vectors (pathFn may use currState to gen nextState)
        const temp = at.currState;
        at.currState = at.nextState;    // save current state vector, pathFn will use it
        at.nextState = temp;
        at.currState.time = localTime;  // save the localTime along the timeline for use by pathFn
      });

      this.currTime = localTime;    // timestamp of what is currently on screen
    }
	
    stopAnimation() {
      clearTimeout(this.timer);                  // if frameRate set kill timeout
      cancelAnimationFrame(this.timer);   // if no frameRate kill RAF 
      this.prevAnimMode = this.animMode;
      this.animMode = this.modes.STOPPED;
      // reset the currTime so play and step know to start again
      this.currTime = 0;
      this.startOfs = 0;
    }

    pauseAnimation() {
      clearTimeout(this.timer);                  // if frameRate set kill timeout
      cancelAnimationFrame(this.timer);   // if no frameRate kill RAF 
      this.prevAnimMode = this.animMode;
      this.animMode = this.modes.PAUSED;
    }

    stepAnimation() {
      // this is the actual animator that draws the frame
      const drawIt = ()=>{
        this.drawFrame();
        this.prevAnimMode = this.modes.PAUSED;
        this.animMode = this.modes.PAUSED;
      }

      // equivalent to play for one frame and pause
      if (this.animMode === this.modes.PLAYING)
      {
        return;
      }
      if (this.animMode === this.modes.PAUSED)
      {
        this.startTime = Date.now() - this.currTime;  // move time as if currFrame just drawn
      }
      this.prevAnimMode = this.animMode;
      this.animMode = this.modes.STEPPING;

      setTimeout(drawIt, this.stepTime);
    }

    redrawAnimation() {
      // equivalent to play for one frame and pause
      if (this.animMode === this.modes.PLAYING)
      {
        return;
      }
      this.startTime = Date.now() - this.currTime;  // move time as if currFrame just drawn

      this.drawFrame();
    }

    playAnimation(startOfs, stopOfs) {
      // this is the actual animator that draws each frame
      const drawIt = ()=>{
        this.drawFrame();
        this.prevAnimMode = this.modes.PLAYING;
        if (stopOfs && this.currTime >= stopOfs)
        {
          this.stopAnimation();     // go back to start of time line
        }
        else
        {
          if (!this.frameRate)
          {
            this.timer = requestAnimationFrame(drawIt);   // go forever
          }
        }
      }

      this.startOfs = startOfs || 0;
      if (this.animMode === this.modes.PLAYING)
      {
        return;
      }
      if (this.animMode === this.modes.PAUSED)
      {
        this.startTime = Date.now() - this.currTime;  // move time as if currFrame just drawn
      }
      this.prevAnimMode = this.animMode;
      this.animMode = this.modes.PLAYING;
      if (this.frameRate)
      {
        this.interval = 1000/this.frameRate;  // msec
        this.timer = setInterval(requestAnimationFrame, this.interval, drawIt);
      }
      else
      {
        this.timer = requestAnimationFrame(drawIt);
      }
    }
  }

  class Node extends Path   // its a Path so it can be a child of its parent Bone Group 
  {
    // this is a valid Obj2D but can't be drawn
    constructor(x, y){
      super("M0,0", {x:x, y:y});
      this.ofsx = x;
      this.ofsy = y;
      this.x = 0;     // dynamic position of node reference point, gets all the transforms
      this.y = 0;
    }
 
    dup(){
      const newNode = new Node(this.ofsx, this.ofsy);

      return newNode;
    }
  }

  class Bone extends Group
  {
    constructor(length=0, pWidth=0, sWidth=0){
      super();
      if (length < 0)
      {
        console.log("Range Error: Bone length must be >=0");
        return;
      }
      if (pWidth < 0 || sWidth < 0)
      {
        console.log("Range Error: Bone pWidth and sWidth must be >=0");
        return;
      }
      this.parentAry = null;    // the BoneArray holding references to the chain of Bones
                                // filled in for the first bone as the BoneArray then every bone added just copies
                                // its parent bone's reference so they all point to the one BoneArray
      this.origin = new Node(0, 0); 
      this.end = new Node(length, 0);
      this.pnode = new Node(length, -pWidth);
      this.snode = new Node(length, sWidth);
      this.linkobjs = new Group();   // must be a child younger than next bone to render in order)
      this.addObj(this.origin, this.end, this.pnode, this.snode, this.linkobjs);
      this.angle = 0;           // (degs) accumulated rotation
      this.sectLength = length;
      this.sectRotation = 0;    // (degs) this is the only independent variable
    }

    dup(){
      // dont copy the children they are links the the next bone and so on
      const newBone = new Bone(this.sectLength);
      this.parentAry = this.parentAry;
      const objAry = this.linkobjs.children;
      for(let i=0; i<objAry.length; i++)
      {
        const objt = objAry[i].dup();  // Path or Shape etc
        objt.parent = null;            // forget the parent of the original
        newBone.linkobjs.addObj(objt); // sets parent to be the linkobjs Group
        objt.parent = newBone; // make objt.parent the bone so it inherits bone rotation  
      }
      newBone.angle = this.angle;
      newBone.sectRotation = this.sectRotation;

      return newBone;
    }

    setRotation(deg){
      if (typeof(deg) !== "number")
      { 
        console.log("Type Error: invalid Bone rotation value");
        return;
      }
      this.sectRotation = deg;
 
      this.parentAry.preview();  // update the positions of the linked objects
    }

    getRotation(){
      return this.sectRotation;
    }

    getLength(){
      return this.sectLength;
    }
  }
  
  BoneArray = class extends Array
  {
    constructor(){
      super();
      this.objects = null;     // a reference so cgo.render(BoneArray.objects) works
      this.span = 0;           // sum of the bone lengths
      this.originNodes = [];
      this.endNodes = [];
      this.pNodes = [];
      this.sNodes = [];
      this.linkedObjs = [];
    }

    addBone(length=0, pWidth=0, sWidth=0){
      if (typeof(length) !== "number" || length < 0)
      {
        console.log("Type Error: invalid length for addBone");
        return;
      }
      const newBone = new Bone(length, pWidth, sWidth);
      if (this.length === 0)       // adding first bone
      {
        // this is the root of the family tree
        this.objects = newBone;
        newBone.parentAry = this;  // save link to the BoneArray
      }
      else
      {
        // make the new bone a child of the last bone in the BoneArray
        const lastBone = this.at(-1);
        lastBone.addObj(newBone);
        newBone.parentAry = lastBone.parentAry; // copy the head to each new bone
      }
      this.push(newBone);
      this.originNodes.push(newBone.origin);
      this.endNodes.push(newBone.end);
      this.pNodes.push(newBone.pnode);
      this.sNodes.push(newBone.snode);
      this.span += length;
    }

    dup(){
      const newAry = new BoneArray();
      const headCopy = this[0].dup();
      newAry.push(headCopy);
      newAry.objects = headCopy;
      newAry.originNodes.push(headCopy.origin);
      newAry.endNodes.push(headCopy.end);
      newAry.pNodes.push(headCopy.pnode);
      newAry.sNodes.push(headCopy.snode);
      for (let i=0; i<this[0].linkobjs.length; i++)
      {
        newAry.linkedObjs.push(this[0].linkobjs[i]);  // just use a reference Bone.dup made a copy
      }
      for(let b=1; b<this.length; b++)
      {
        const boneCopy = this[b].dup();
        newAry[b-1].addObj(boneCopy);
        newAry.push(boneCopy);
        newAry.originNodes.push(boneCopy.origin);
        newAry.endNodes.push(boneCopy.end);
        newAry.pNodes.push(boneCopy.pnode);
        newAry.sNodes.push(boneCopy.snode);
        for (let i=0; i<this[b].linkobjs.length; i++)
        {
          newAry.linkedObjs.push(this[b].linkobjs[i]);  // just use a reference Bone.dup made a copy
        }
      }
      
      newAry.span = this.span;

      return newAry;
    }

    linkObj(node, objt){
      if (!objt 
       || !(objt.type === "GRP" || objt.type === "PATH" || objt.type === "SHAPE" || objt.type === "IMG" || objt.type === "TEXT") 
       || !(node instanceof Node))
      {
        console.log("Type Error: bad argument for linkObj");
        return;
      }
      if (node.ofsx) objt.addTransformProperty("x", node.ofsx);
      if (node.ofsy) objt.addTransformProperty("y", node.ofsy);
      const bone = node.parent;
      bone.linkobjs.addObj(objt);  // sets parent as the bone Group so drag rotates the bone
      objt.parent = bone;          // set objt the parent to be the bone to inherit rotation
      this.linkedObjs.push(objt);  // save a reference for easy access from BoneArray
      bone.setRotation(0);         // force calculation of node offsets etc 
    }

    preview(){
      this[0].ofsTfmAry.length = 0;
      this[0].rotate(this[0].sectRotation);  // head doesn't translate
      this[0].angle = this[0].sectRotation;  // reset angle accumulator
      for (let b=1; b<this.length; b++)
      {
        this[b].ofsTfmAry.length = 0;
        this[b].rotate(this[b].sectRotation);
        this[b].angle = this[b-1].angle + this[b].sectRotation;
        this[b].translate(this[b-1].sectLength);
      }

      this.pseudoRender(this[0]); 
    }

    pseudoRender(rootObj)
    {
      function matrixRotate(M, degs)
      {
        // Rotate by angle T (in radians)
        let T = degs*Math.PI/180.0;
        let cosT = Math.cos(T);
        let sinT = Math.sin(T);
        let A = new DOMMatrix([cosT, -sinT, sinT, cosT, 0.0, 0.0]);
    
        return M.multiply(A);
      } 
    
      function matrixTranslate(M, ofsX, ofsY)
      {
        let A = new DOMMatrix([1.0, 0.0, 0.0, 1.0, ofsX, ofsY]);
        
        return M.multiply(A);
      }

      const genOfsTfmMatrix = (obj)=>
      {
        let ofsMat = new DOMMatrix(obj.ofsTfmMat);  // will be identity unless transformRestore called
  
        obj.ofsTfmAry.slice().reverse().forEach((xfmr)=>{
          if (xfmr.type === "TRN")
          {
            ofsMat = matrixTranslate(ofsMat, xfmr.args[0], xfmr.args[1]); 
          }
          else if (xfmr.type === "ROT")
          {
            ofsMat = matrixRotate(ofsMat, -xfmr.args[0]);
          }
        });
  
        return ofsMat;
      }
  
      const genNetTfmMatrix = (obj, softTfm)=>
      {
        obj.netTfm = new DOMMatrix();  // clear out previous transforms
        // cnavas ctx expects transforms in reverse order (matricies use preMultiply)
        obj.netTfm = obj.netTfm.multiply(softTfm);
        obj.hardTfmAry.slice(0).reverse().forEach((xfmr)=>{
          if (xfmr.type === "TRN")
          {
            // objects descriptors assume iso world coords 
            obj.netTfm = matrixTranslate(obj.netTfm, xfmr.args[0], xfmr.args[1]); 
          }
          else if (xfmr.type === "ROT")
          {
            obj.netTfm = matrixRotate(obj.netTfm, -xfmr.args[0]);
          }
        });
      }

      const handleTransforms = (obj)=>
      {
        const grpTfmMat = (obj.parent)? obj.parent.netTfmMat: new DOMMatrix();
        // Save a set of transforms values equivalent to the 'as-drawn' values.
        obj.ofsTfmMat = genOfsTfmMatrix(obj);
        let softTfmMat = grpTfmMat.multiply(obj.ofsTfmMat);
        obj.ofsTfmMat = new DOMMatrix();
        if (obj.type === "GRP")
        {
          obj.netTfmMat = softTfmMat;
        }
        else
        {
          genNetTfmMatrix(obj, softTfmMat);
          // apply the transforms to a reference point if one defined
          if (obj.x !== undefined && obj.y !== undefined)  // nodes and linked objects
          {
            obj.x = obj.netTfm.e;
            obj.y = obj.netTfm.f
          }
        }
      }

      function recursiveGenNetTfmAry(root)
      {
        function iterate(obj)
        {
          if (obj.type === "GRP")    // find Obj2Ds to draw
          {
            handleTransforms(obj);
            obj.children.forEach((childNode)=>{
              iterate(childNode);
            });
          }
          else
          {
            handleTransforms(obj);
          }
        }
        // now propagate the current grpXfm through the tree of children
        iterate(root);
      }

      recursiveGenNetTfmAry(rootObj);
    }
  }

  //===============================================================================
  Cango.prototype.animation = function(draw, path, options)
  {
    const animId = this.cId+"_"+this.getUnique();
    const animObj = new AnimObj(animId, this, draw, path, options);

    if (this.bkgCanvas.timeline === undefined)
    {
      // create a single timeline for all animations on all layers
      this.bkgCanvas.timeline = new Timeline();
    } 
    // push this into the Cango animations array
    this.stopAnimation();   // make sure we are not still running an old animation
    this.bkgCanvas.timeline.animTasks.push(animObj);

    return animObj.id;   // so the animation just created can be deleted if required
  };

  Cango.prototype.pauseAnimation = function()
  {
    this.bkgCanvas.timeline.pauseAnimation();
  };

  Cango.prototype.playAnimation = function(startTime, stopTime)
  {
    this.bkgCanvas.timeline.playAnimation(startTime, stopTime);
  };

  Cango.prototype.stopAnimation = function()
  {
    this.bkgCanvas.timeline.stopAnimation();
  };

  Cango.prototype.stepAnimation = function()
  {
    this.bkgCanvas.timeline.stepAnimation();
  };

  Cango.prototype.redrawAnimation = function()
  {
    this.bkgCanvas.timeline.redrawAnimation();
  };

  Cango.prototype.deleteAnimation = function(animId)
  {
    this.pauseAnimation();   // pause all animations
    this.bkgCanvas.timeline.animTasks.forEach((task, idx)=>{
      if (task.id === animId)
      {
        this.bkgCanvas.timeline.animTasks.splice(idx, 1);       // delete the animation object
        return;
      }
    });
  };

  Cango.prototype.deleteAllAnimations = function()
  {
    this.stopAnimation();
    this.bkgCanvas.timeline.animTasks = [];
  };

  Cango.prototype.setAnimationProperty = function(propertyName, value)
  {
    if ((typeof propertyName !== "string")||(value === undefined)||(value === null))
    {
      return;
    }
    switch (propertyName.toLowerCase())
    {
      case "steptime":
        if ((value >= 15)&&(value <= 500))
        {
          this.bkgCanvas.timeline.stepTime = value;
        }
        break;
      case "minframerate":
      case "framerate":
          if (value && value === "auto")
        {
          this.bkgCanvas.timeline.frameRate = undefined;
        }
        else if (isNaN(value) || value > 30 || value < 0.5)  // 1 frame per 2 sec to 30 frames per sec
        {
          console.warn("Range Error: setPropertyDefault frameRate (0.5 .. 30)");
          return;
        }
        this.bkgCanvas.timeline.frameRate = value;
        break;
      default:
        break;
    }
  };

}());
