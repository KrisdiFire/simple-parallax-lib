/*!
    By Kristian Firedi, krisdifire.github.io
    Website: krisdifire.github.io/parallax
	Available for use under the MIT License
	Version 1.1
*/
'use-strict';

////////////////////////////////////////
//Parallax Function w Lerp
////////////////////////////////////////////////

class PrlxElements {
    constructor () {
        this.elements = document.querySelectorAll('.prlx-element');
        this.cache = [];
        this.initialize();
    }

    setCache() {
        this.elements.forEach((element) => {
            const elemCache = {};
            // The actual element
            elemCache.el = element;
            // Get parents
            elemCache.parents = getParents(element);
            // Transform speed
            elemCache.speed = element.dataset.prlxSpeed;
            // Stop top pos
            elemCache.stop_t = element.dataset.prlxStopT;
            // Stop bot pos
            elemCache.stop_b = element.dataset.prlxStopB;
            // Stop left pos
            elemCache.stop_l = element.dataset.prlxStopL;
            // Stop right pos
            elemCache.stop_r = element.dataset.prlxStopR;
            // Starting position
            elemCache.sy = getValue(element);
            // Easing amount
            elemCache.ease = 0.08;
            // Changed position initialized as starting position
            elemCache.dy = elemCache.sy;
            // Add this to the list of scrolling element objects
            this.cache.push(elemCache);
        });
      }

    runner() {
        // let n = this.cache.length;
        // for (let i = 0; i < n; ++i) {
        //     this.cache[i].sy = getValue(this.cache[i].el) * this.cache[i].speed;
        // }
        this.cache.forEach((elem) => {
            elem.sy = getValue(elem.el) * elem.speed;
        });
    }

    transform() {
        // Iterate through each object w/ index in mind
        this.cache.forEach((elem) => {

            if (window.innerWidth > 769) {
  
                elem.dy = lerp(elem.dy, elem.sy, elem.ease);

                if (elem.el.classList.contains('prlx-sideways')) {
                    if (elem.el.classList.contains('with-lerp')) {
                        transOptions(elem.el, elem.stop_r, elem.stop_l, elem.dy);
                    }
                    else {
                        transOptions(elem.el, elem.stop_r, elem.stop_l, elem.sy);
                    }
                }
                if (elem.el.classList.contains('prlx-norm')) {
                    transOptions(elem.el, elem.stop_b, elem.stop_t, elem.sy);
                }
                if (elem.el.classList.contains('prlx-lerp')) {
                    transOptions(elem.el, elem.stop_b, elem.stop_t, elem.dy);
                }
            } else {
                elem.el.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`;
            }
        });

        // After updating all scrolling element metadata
        // Animate the changes
        window.requestAnimationFrame(this.transform.bind(this));  
    }

    initialize() {
        this.setCache();
        this.transform();
        this.runner();
        window.addEventListener('scroll', this.runner.bind(this));
        // window.requestAnimationFrame(this.transform.bind(this));
    }
}
const prlx = new PrlxElements();
// get parents of element that'll be used in getting the transform value
function getParents(elem) {
    let parents = [];
    while (elem.parentNode && elem.parentNode.nodeName
        .toLowerCase() != 'body') {
        elem = elem.parentNode;
        parents.push(elem);
    }
    return parents;
}
//calculate the position in order for the element to be in its starting position when in center of the screen
function getValue(item) {
    let parents = getParents(item),
        win_h = window.innerHeight,
        win_off = window.pageYOffset,
        elemPar_h = item.parentNode.clientHeight,
        totalParOff = [];
    for (let i = 0, n = parents.length; i < n; ++i) {
        totalParOff.push(parents[i].offsetTop);
    }
    let totalParOffSum = totalParOff.reduce(function (accumulator,
            currentValue) {
            return accumulator + currentValue;
        }),
        cont_scrolled = win_off - totalParOffSum + win_h / 2 - 
        elemPar_h / 2;
    return cont_scrolled * 50 / win_h;
}
//linear interpolation func
function lerp(a, b, n) {
    a = (1 - n) * a + n * b;
    return Math.floor(a * 100) / 100;
}
//check for stop pos or lerp 
function transOptions(elem, stop_1, stop_2, value) {
    if (isInView(elem.closest(".prlx-section")) || isInView(elem)) {
        if (stop_1 == undefined || stop_2 == undefined) {
            if (elem.classList.contains('prlx-sideways')) {
                elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${value}, 0, 0, 1)`;
            } else {
                elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${value}, 0, 1)`;
            }
        }
        else {
            if (value < stop_1 && value > stop_2 * -1) {
                if (elem.classList.contains('prlx-sideways')) {
                    elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${value}, 0, 0, 1)`;
                } else {
                    elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${value}, 0, 1)`;
                }
            } else {
                if (value > stop_1 && value > stop_2 * -1) {
                    if (elem.classList.contains('prlx-sideways')) { 
                        elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${stop_1}, 0, 0, 1)`;
                    } else { 
                        elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${stop_1}, 0, 1)`;
                    }
                }
                if (value < stop_1 && value < stop_2 * -1) {
                    if (elem.classList.contains('prlx-sideways')) {
                        elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${stop_2}, 0, 0, 1)`;
                    } else {
                        elem.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${stop_2}, 0, 1)`;
                    }
                }
            }
        }
    }
}
//is the element in the viewport (not taking into account the x axis)
function isInView(el) {
    let rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}