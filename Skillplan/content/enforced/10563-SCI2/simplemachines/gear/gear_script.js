const fixedCenterGear1 = 150;
                const module = 3;
                const referencePressureAngle = 20* Math.PI / 180;
                var teeth1 = parseInt(document.getElementById("teeth1").value);
                var teeth2 = parseInt(document.getElementById("teeth2").value);
                
                var fixedCenterGear2 = fixedCenterGear1 + module*(teeth1 + teeth2)/2;
                var referenceDiameter1 = module*teeth1;
                var referenceDiameter2 = module*teeth2;
                
                var baseDiameter1 = referenceDiameter1*Math.cos(referencePressureAngle);
                var baseDiameter2 = referenceDiameter2*Math.cos(referencePressureAngle);
                
                var toothDepth = 2.25*module;
                var tipDiameter1 = referenceDiameter1 + 2*module;
                var tipDiameter2 = referenceDiameter2 + 2*module;
                var rootDiameter1 = referenceDiameter1 - 2.5*module;
                var rootDiameter2 = referenceDiameter2 - 2.5*module;
                
                var  dw1 = 2 * (referencePressureAngle*180/Math.PI)*(teeth1/(teeth1+teeth2));
                
                var  dw2 = 2 * (referencePressureAngle*180/Math.PI)*(teeth2/(teeth1+teeth2));
                
                var aw = Math.acos(0.5*(baseDiameter1+baseDiameter2)/referencePressureAngle);
                
            function drawGearOne(ctx) {
                ctx.beginPath();
                var cx      = 200,                    // center x
    cy      = 200,                    // center y
    notches = 7,                      // num. of notches
    radiusO = 180,                    // outer radius
    radiusI = 130,                    // inner radius
    taperO  = 50,                     // outer taper %
    taperI  = 35,                     // inner taper %

    // pre-calculate values for loop

    pi2     = 2 * Math.PI,            // cache 2xPI (360deg)
    angle   = pi2 / (notches * 2),    // angle between notches
    taperAI = angle * taperI * 0.005, // inner taper offset (100% = half notch)
    taperAO = angle * taperO * 0.005, // outer taper offset
    a       = angle,                  // iterator (angle)
    toggle  = false;                  // notch radius level (i/o)


                // for (let i = 0; i < teeth; i++) {
                //     const angle = i * step;
                //     const outerX = x + Math.cos(angle) * (radius+toothDepth);
                //     const outerY = y + Math.sin(angle) * (radius+toothDepth);
                //     const innerX = x + Math.cos(angle + step / 2) * radius;
                //     const innerY = y + Math.sin(angle + step / 2) * radius;
                //     ctx.lineTo(outerX, outerY);
                //     ctx.lineTo(innerX, innerY);
                // }
                // ctx.closePath();
                // ctx.stroke();

                // move to starting point
ctx.moveTo(cx + radiusO * Math.cos(taperAO), cy + radiusO * Math.sin(taperAO));

// loop
for (; a <= pi2; a += angle) {

    // draw inner to outer line
    if (toggle) {
        ctx.lineTo(cx + radiusI * Math.cos(a - taperAI),
                   cy + radiusI * Math.sin(a - taperAI));
        ctx.lineTo(cx + radiusO * Math.cos(a + taperAO),
                   cy + radiusO * Math.sin(a + taperAO));
    }

    // draw outer to inner line
    else {
        ctx.lineTo(cx + radiusO * Math.cos(a - taperAO),  // outer line
                   cy + radiusO * Math.sin(a - taperAO));
        ctx.lineTo(cx + radiusI * Math.cos(a + taperAI),  // inner line
                   cy + radiusI * Math.sin(a + taperAI));
    }

    // switch level
    toggle = !toggle;
}

// close the final line
ctx.closePath();
            }

            function drawGear(ctx, x, y, teeth, radius,id) {
                const step = (2 * Math.PI) / teeth;
                if (id == 1){
                    var offset = referencePressureAngle/2;
                }else{
                    var offset = -referencePressureAngle/2;
                }
                ctx.beginPath();
                for (let i = 0; i < teeth; i++) {
                    const angle = i * step;
                    const outerX = x + Math.cos(angle) * (radius+toothDepth);
                    const outerY = y + Math.sin(angle) * (radius+toothDepth);
                    const innerX = x + Math.cos(angle + step / 2) * radius;
                    const innerY = y + Math.sin(angle + step / 2) * radius;
                    ctx.lineTo(outerX, outerY);
                    ctx.lineTo(innerX, innerY);
                }
                ctx.closePath();
                ctx.stroke();
            }

            function updateCanvas() {
                const canvas = document.getElementById("gearCanvas");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                teeth1 = parseInt(document.getElementById("teeth1").value);
                teeth2 = parseInt(document.getElementById("teeth2").value);

                document.getElementById("teethValue1").innerText = teeth1;
                document.getElementById("teethValue2").innerText = teeth2;
                
                referenceDiameter1 = module*teeth1;
                referenceDiameter2 = module*teeth2;
                
                baseDiameter1 = referenceDiameter1*Math.cos(referencePressureAngle);
                baseDiameter2 = referenceDiameter2*Math.cos(referencePressureAngle);
                
                fixedCenterGear2 = fixedCenterGear1 + module*(teeth1 + teeth2)/2;

                drawGearOne(ctx);
                drawGear(ctx, fixedCenterGear2, fixedCenterGear1, teeth2, referenceDiameter2/2,2);
                
                console.log(teeth1);
                console.log(teeth2);
                console.log(referenceDiameter1);
                console.log(referenceDiameter2);
                console.log(baseDiameter1);
                console.log(baseDiameter2);
            }

            window.onload = updateCanvas;