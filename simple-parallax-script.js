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

let value_lerp = 0;
//initialisator
function runner() {
    let prlxElements = document.querySelectorAll('.prlx-element');

    for (let i = 0, n = prlxElements.length; i < n; ++i) {

        if (prlxElements[i].classList.contains('on-small') && window.innerWidth > 768) {
            prlxElements[i].classList.remove('on-small');
        }
        if (window.innerWidth > 768 && prlxElements[i].classList.contains('on-small') == false /*&& window.innerHeight < window.innerWidth*/) { 
                transform(prlxElements[i], value_lerp);
        } else { 
            prlxElements[i].style.transform = `translate3d(0, 0, 0)`; 
            prlxElements[i].classList.add('on-small');
        }

    }
}
runner();
window.addEventListener('scroll', runner);
//get all parents
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
    //for each parent, calculate its offset top, and push into array totalParOff
    for (let i = 0, n = parents.length; i < n; ++i) {
        totalParOff.push(parents[i].offsetTop);
    }
    //reduce all of the numbers in the totalParOff array into this var
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
//transform the elements based on the previous calculations and their respective classes
function transform(el, vl) {
    if (el.classList.contains('prlx-element') && (el.classList.contains('prlx-lerp') || 
        el.classList.contains('prlx-norm') || el.classList.contains('prlx-stop-tb') || 
        el.classList.contains('prlx-sideways')) == false) {
        console.log(el);
        throw 'Missing prlx-identifier on prlx-element';
    }
    if (el.closest(".prlx-section") == null) {
        console.log(el);
        throw 'Missing prlx-section at prlx-element';
    }
    //WITH LERP//
    if (el.classList.contains("prlx-lerp") && (isInView(el.closest(".prlx-section")) || isInView(el)) && 
        el.classList.contains("active") == false) {
        el.classList.add('active');
        let transformPrlxLerp = function () {
            if (isInView(el.closest(".prlx-section")) || isInView(el)) {
                let value = getValue(el) * el.dataset.prlx_speed;
                vl = lerp(vl, value, 0.08);
                let stop_t = el.dataset.prlx_stop_t;
                let stop_b = el.dataset.prlx_stop_b;
                if (el.classList.contains('with-stop')) {
                    if (vl < stop_b && vl > stop_t * -1) {
                        el.style.transform =
                            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${vl}, 0, 1)`;
                    }
                    if (el.classList.contains('with-stop') && vl > stop_b && vl > stop_t * -1) {
                        el.style.transform = 
                            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${stop_b}, 0, 1)`;
                    }
                    if (el.classList.contains('with-stop') && vl < stop_b && vl < stop_t * -1) {
                        el.style.transform = 
                            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${stop_t * -1}, 0, 1)`;
                    }
                } else {
                    el.style.transform =
                        `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${vl}, 0, 1)`;
                }
                window.requestAnimationFrame(transformPrlxLerp);
            } else {
                el.classList.remove("active");
                window.cancelAnimationFrame(transformPrlxLerp);
            }
        };
        transformPrlxLerp();
    }
    //WITHOUT LERP//
    if (el.classList.contains("prlx-norm")) {
        let transformPrlxNorm = function () {
            if (isInView(el.closest(".prlx-section")) || isInView(el)) {
                let value = getValue(el) * el.dataset.prlx_speed;
                let stop_t = el.dataset.prlx_stop_t;
                let stop_b = el.dataset.prlx_stop_b;
                if (el.classList.contains('with-stop')) {
                    if (value < stop_b && value > stop_t * -1) {
                        el.style.transform =
                            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${value}, 0, 1)`;
                    }
                    if (el.classList.contains('with-stop') && value > stop_b && value > stop_t * -1) {
                        el.style.transform = 
                            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${stop_b}, 0, 1)`;
                    }
                    if (el.classList.contains('with-stop') && value < stop_b && value < stop_t * -1) {
                        el.style.transform = 
                            `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${stop_t * -1}, 0, 1)`;
                    }
                } else {
                    el.style.transform =
                        `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${value}, 0, 1)`;
                }
            }
        };
        transformPrlxNorm();
    }
    //SIDEWAYS//
    if (el.classList.contains('prlx-sideways') && (isInView(el.closest(".prlx-section")) || isInView(el))) {
        let value = getValue(el) * el.dataset.prlx_speed;
        let stop_l = el.dataset.prlx_stop_l;
        let stop_r = el.dataset.prlx_stop_r;
        //without lerp
        if (el.classList.contains('with-lerp') == false) {
            if (el.classList.contains('with-stop')) {
                if (value < stop_r && value > stop_l * -1) {
                    el.style.transform =
                       `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${value}, 0, 0, 1)`;
                }
                if (el.classList.contains('with-stop') && value > stop_r && value > stop_l * -1) {
                    el.style.transform = 
                        `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${stop_r}, 0, 0, 1)`;
                }
                if (el.classList.contains('with-stop') && value < stop_r && value < stop_l * -1) {
                    el.style.transform = 
                        `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${stop_l * -1}, 0, 0, 1)`;
                }
            } else {
                el.style.transform =
                   `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${value}, 0, 0, 1)`;
            }
        }
        //with lerp
        if (el.classList.contains('with-lerp') && el.classList
            .contains("active") == false) {
            el.classList.add('active');
            let transformSide = function () {
                if (isInView(el.closest(".prlx-section")) || isInView(el)) {
                    let value = getValue(el) * el.dataset.prlx_speed;
                    vl = lerp(vl, value, 0.08);
                    if (el.classList.contains('with-stop')) {
                        if (vl < stop_r && vl > stop_l * -1) {
                            el.style.transform =
                               `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${vl}, 0, 0, 1)`;
                        }
                        if (el.classList.contains('with-stop') && vl > stop_r && vl > stop_l * -1) {
                            el.style.transform = 
                                `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${stop_r}, 0, 0, 1)`;
                        }
                        if (el.classList.contains('with-stop') && vl < stop_r && vl < stop_l * -1) {
                            el.style.transform = 
                                `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${stop_l * -1}, 0, 0, 1)`;
                        }
                    } else {
                        el.style.transform =
                           `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${vl}, 0, 0, 1)`;
                    }
                    window.requestAnimationFrame(transformSide);
                } else {
                    el.classList.remove("active");
                    window.cancelAnimationFrame(transformSide);
                }
            };
            transformSide();
        }
    }
}
//is an element in the viewport (top/bot - it will work if it's hidden on the sides)
function isInView(el) {
    let rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}