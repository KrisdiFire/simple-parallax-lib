/*!
    By Kristian Firedi, krisdifire.github.io
    Website: krisdifire.github.io/parallax
	Available for use under the MIT License
	Version 1.21
*/
'use-strict';
/////////////////////////////
// Calculate the body scrolled percentage
////////////////////////////////////////
let bodyHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight) - window.innerHeight,
    totalBodyScrolledPerc = 0,
    bodyScrolled = 0;

function bodyScrolledAmount() {
    bodyHeight = Math.max(document.documentElement.scrollHeight, document.body.offsetHeight) - window.innerHeight;
    //koliko se odskrolovalo pocevsi od vrha - nikad ne dodje do 100% jer mu fali window inner height
    bodyScrolled = (Math.max(document.documentElement.scrollTop, document.body.offsetTop));
    //koliko je totalno stranice odskrolovano u procentima (Math.round-uj ovo da bude od 1 - 100 celi br)
    totalBodyScrolledPerc = (bodyScrolled / bodyHeight * 100);
}
bodyScrolledAmount();
window.addEventListener('scroll', bodyScrolledAmount);
////////////////////////////////////////
//Parallax Class
////////////////////////////////////////////////
class PrlxElements {
    constructor() {
        this.elements = document.querySelectorAll(
        '.prlx-element');
        this.cache = [];
        this.initialize();
    }
    setCache() {
        this.elements.forEach((element) => {
            const elemCache = {};
            // The element
            elemCache.el = element;
            // parent rect
            elemCache.parent = element.parentElement;
            // Transform speed
            elemCache.speed = element.dataset.prlxSpeed;
            // Stop top pos
            elemCache.stop_1 = element.dataset.prlxStopS;
            // Stop bot pos
            elemCache.stop_2 = element.dataset.prlxStopE;
            // Stop top pos
            elemCache.stop_1_point = element.dataset.prlxStopSp;
            // Stop bot pos
            elemCache.stop_2_point = element.dataset.prlxStopEp;
            // Starting position
            elemCache.sy = 0;
            // Easing amount, maybe I'll implement so that the user can configure this value
            elemCache.ease = 0.08;
            // Changed position initialized as starting position
            elemCache.dy = elemCache.sy;
            // Var in order to run the runner on startup
            elemCache.wasIrun = false;
            // Add this to the list of scrolling element objects
            this.cache.push(elemCache);
        });
    }
    runner() {
        this.cache.forEach((elem) => {
            if (elem.wasIrun == false) {
                    doer(elem.el, elem.sy);
                elem.wasIrun = true;
            }
            if (isInView(elem.el.closest('.prlx-section'))) {
                elem.sy = getValue(elem.el, elem.stop_1, elem.stop_2, 
                    elem.parent, elem.speed);
            }
        });
    }
    transform() {
        // Iterate through each object and transform
        this.cache.forEach((elem) => {
            if (window.innerWidth > 769) {
                elem.dy = lerp(elem.dy, elem.sy, elem
                    .ease);
                if (elem.el.classList.contains(
                        'prlx-sideways')) {
                    if (elem.el.classList.contains(
                            'with-lerp')) {
                        transOptions(elem.el, elem.stop_1_point, elem.stop_2_point, elem.dy);
                    } else {
                        transOptions(elem.el, elem.stop_1_point, elem.stop_2_point, elem.sy);
                    }
                } else if (elem.el.classList.contains(
                        'prlx-norm')) {
                    transOptions(elem.el, elem.stop_1_point, elem.stop_2_point, elem.sy);
                } else if (elem.el.classList.contains(
                        'prlx-lerp')) {
                    transOptions(elem.el, elem.stop_1_point, elem.stop_2_point, elem.dy);
                }
            } else {
                elem.el.style.transform =
                    `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`;
            }
        });
        // Animate the changes
        window.requestAnimationFrame(this.transform.bind(this));
    }
    initialize() {
        this.setCache();
        this.runner();
        this.transform();
        window.addEventListener('scroll', this.runner.bind(this));
    }
}
const prlx = new PrlxElements();
// get parents and their offsets that'll be used in getting the transform value
function getOffsetTop(element) {
	let offsetTop = 0;
    while(element.parentNode && element.parentNode.nodeName
        .toLowerCase() != 'body') {
        element = element.parentNode;
        offsetTop += element.offsetTop;
    }
  return offsetTop;
}
//calculate the position in order for the element to be in its starting position when in center of the screen
function getValue(item, stop_1, stop_2, parent, speed) {
        let totalOffsetTop = getOffsetTop(item),
            par_height = parent.clientHeight,
            par_width = parent.clientWidth;

        let bla,
            // scrollOffset = (window.innerHeight/(window.innerWidth/par_rect.width)) - par_rect.top - par_rect.height * 
            // (par_rect.width/window.innerWidth),
            scrollOffset = window.pageYOffset - totalOffsetTop + window.innerHeight/2 - 
            (par_height/2),
            scrollPercent = scrollOffset / (par_height) * 100 * (speed / 10),
            transformPercent;

        if (item.classList.contains('prlx-sideways')) {
            let par_percent_width = par_width / bodyHeight * 100,
                child_par_perc_width = (((item.offsetWidth / bodyHeight * 100) / 
                par_percent_width) * 100),
                item_off_left = ((par_width - (item.offsetLeft + item.offsetWidth)) / 
                bodyHeight) * 100,
                item_off_left_perc = (item_off_left / par_percent_width) * 100;
                stop_1 = stop_1 - item_off_left_perc;
                stop_2 = stop_2 - child_par_perc_width - item_off_left_perc;                
                transformPercent = par_width / 100;
        } else {
            let par_percent_height = par_height / bodyHeight * 100,
                child_par_perc_height = (((item.offsetHeight / bodyHeight) * 100) / 
                par_percent_height) * 100,
                item_off_top = ((item.offsetTop) / bodyHeight) * 100,
                item_off_top_perc = (item_off_top / par_percent_height) * 100;
                stop_1 = stop_1 - item_off_top_perc;
                stop_2 = stop_2 - child_par_perc_height - item_off_top_perc;
                transformPercent = par_height / 100;
            }  
        if (scrollPercent <= stop_1) {
            return scrollPercent = stop_1 * transformPercent;
        }
        else if (scrollPercent >= stop_2) {
            return scrollPercent = stop_2 * transformPercent;
        }
        else {
            return scrollPercent * transformPercent;
        }
    // }
}
//linear interpolation func
function lerp(a, b, n) {
    a = (1 - n) * a + n * b;
    return Math.floor(a * 100) / 100;
}
//check for stop pos and/or lerp 
function transOptions(elem, stop_2, stop_1, value) {
    if (isInView(elem.closest(".prlx-section")) || isInView(elem)) {

        if (value > stop_1) {
            doer(elem, stop_1);
        } else if (value < stop_2 * -1) {
            doer(elem, stop_2 * -1);
        } else {
            doer(elem, value);
        }
    }
}
// doing the actual transformation
function doer(elem, value) {
    if (elem.classList.contains('prlx-sideways')) {
        elem.style.transform =
            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${value}, 0, 0, 1)`;
    } else {
        elem.style.transform =
            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${value}, 0, 1)`;
    }
}
//is the element in the viewport (not taking into account the x axis)
function isInView(el) {
    let rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}