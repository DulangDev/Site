function lightning() {
    let lightning_canvas = document.getElementById("backgr")
    let ctx = lightning_canvas.getContext("2d")
    let width = 1000, height = 1000;
    lightning_canvas.setAttribute("height", "2160");
    lightning_canvas.setAttribute("width", "3840");
    let center = [1920, 1080];
    let basic_angle = Math.atan(1080 / 1920);
    let angle_disp = 2;

    let state = {pos: [0, 0], num: 0, basic_angle:basic_angle, nf:false, ctx:ctx};

    class Dash{
        constructor(from, to) {
            this.x1 = from[0];
            this.x2 = to[0];
            this.y1 = from[1];
            this.y2 = to[1];
        }
        draw(){
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);

        }
    }

    function generate_sequence(seq, times, start, direction, final = false){
        let x1 = start[0], y1 = start[1];
        for(let i = 0; i < times; i++){

            let angle = (Math.random() - 0.5)*angle_disp + direction;
            let length = Math.random() * 100;
            if(Math.random() > 0.95 && !final){

                    generate_sequence(seq, 40, center, Math.random()*6, true);

            }
            let x2 = x1 + Math.cos(angle)*length, y2 = y1+Math.sin(angle)*length;
            seq.push(new Dash([x1, y1], [x2, y2]));
            x1 = x2;
            y1 = y2;

        }
    }






    let currPos = center;
    let s = [];
    setInterval(() => {
        s = [];

        ctx.clearRect(0, 0, 3840, 2160);
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#FFFFFF88";

        generate_sequence(s, 80, center, basic_angle);
        let idx = 0;
        let intervalId = null;
        s.forEach(el => el.draw());
        ctx.stroke();
        ctx.closePath();
    }, 300)
}

class ScrollView{
    constructor(element){
        this.elem = element;
    }
}

let header = document.querySelector("#hdr-evolve");

window.addEventListener("load", ()=>{
    let callback_guard = false;
    new IntersectionObserver((entry, observer)=>{

        if(entry[0].intersectionRatio < 0.5){
            header.style.position = "fixed";
            header.style.top = "0";
            header.style.margin = "0";
            header.style.background = "#212121";


            let pros = document.getElementById("cons");
            pros.style.display ="flex";

        } else {
            callback_guard = true;
        }

    }, {root:null, rootMargin:"10px", threshold:0.3}).observe(header)
})



let img = document.querySelector("img")
new IntersectionObserver((entry, o)=>{
    if(entry[0].intersectionRatio < 0.5){
        lightning()
    }
},{root:null}).observe(img)


