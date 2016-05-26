"use strict";

document.onmousedown=disableclick;
var status="Right Click Disabled";
function disableclick(event)
{
    if(event.button==2)
    {
        //alert(status);
        return false;
    }
}

function replaceValidationUI(e) {
    e.addEventListener("invalid", function(e) {
        $(this).addClass("submitted"), e.preventDefault();
        var t = $(this).find("#name").val().trim(),
            a = $(this).find("#email").val().trim(),
            o = $(this).find("#message").val().trim();
        ga("send", "event", "Contact", "Invalid Submit", t + " <" + a + ">: " + o)
    }, !0), e.addEventListener("submit", function(e) {
        e.preventDefault();
        var t = $(this).find("#name"),
            a = $(this).find("#email"),
            o = $(this).find("#message");
        if ([t, a, o].forEach(function(e) {
                e.val(e.val().trim())
            }), this.checkValidity()) {
            $(this).find(".Form__submit").attr("disabled", !0), $(this).addClass("submitted"), ga("send", "event", "Contact", "Successful Submit", t.val() + " <" + a.val() + ">: " + o.val()), $(this).prepend($('<input type="hidden" name="_subject" />').val(t.val() + " Contact Request")), $(this).prepend($('<input type="hidden" name="_cc" value="krystian@3magine.com,evan@3magine.com" />'));
            var i = this;
            $.ajax({
                url: "",
                method: "POST",
                data: $(this).serialize(),
                dataType: "json",
                complete: function(e) {
                    200 == e.status ? $(i).addClass("sent") : $(i).addClass("failed"), $("html, body").animate({
                        scrollTop: 0
                    })
                }
            })
        }
    }), e.addEventListener("submit", function(t) {
        for (var a = e.querySelectorAll(":invalid"), o = 0; o < a.length; o++) {
            a[o].validationMessage, a[o]
        }
        a.length > 0 && a[0].focus()
    })
}

function setSlideColour(e, t) {
    var a = getSlides(e).eq(t),
        o = a.attr("data-color");
    $case_studies.css("background-color", o)
}

function startSlideVideo(e, t) {
    if (!isMobile.any) {
        var a = getSlides(e).eq(t),
            o = a.find(".Gallery__slide__media"),
            i = o.children(".Gallery__video__play");
        i.removeClass("Gallery__video--hide").show(), i[0].play();
        var n = a.next(".Gallery__slide");
        n.length && n.find(".Gallery__video__play").attr("preload", "auto")
    }
}

function stopSlideVideo(e, t) {
    var a = getSlides(e).eq(t);
    a.find(".Gallery__slide__media").children("video").fadeOut("fast", function() {
        $(this)[0].pause(), $(this)[0].currentTime = 0
    })
}

function getSlides(e) {
    return $sections.eq(e - 1).find(".Gallery__slide")
}

function kickoffSlides(e, t) {
    setSlideColour(e, t), startSlideVideo(e, t)
}

function spindownSlides(e, t) {
    console.log("spindownSlides"), stopSlideVideo(e, t)
}

function preloadVideo(e) {
    console.log(e);
    var t = $sections.eq(e - 1);
    console.log(t), t.find(".Gallery__slide:first-child .Gallery__video__play").attr("preload", "auto")
}

function ImageFactory(e, t) {
    return $("<img />").attr("src", "images/logos/" + e + ".svg").addClass(t + "__static Video__static")
}

function VideoFactory(e, t, a) {
    console.log(e)
    var o = $("<video />").attr("poster", "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7").addClass(t + "__play Video__play").attr("preload", "none");
    o.append($("<source />").attr("src", "assets/video/" + e + "-play.webm").attr("type", "video/webm")), o.append($("<source />").attr("src", "" + e + "-play.mp4").attr("type", "video/mp4"));
    var i = $("<video />").attr("loop", !0).addClass(t + "__loop Video__loop").attr("preload", "none");
    i.append($("<source />").attr("src", "assets/video/" + e + "-loop.webm").attr("type", "video/webm")), i.append($("<source />").attr("src", "" + e + "-loop.mp4").attr("type", "video/mp4"));
    var n = ImageFactory(e, t);
    return {
        $play: o,
        $loop: i,
        $image: n
    }
}
$(function() {
    $(".Contact").length && (replaceValidationUI(document.querySelector("form")), autosize($("textarea")), $(".morph").each(function(e, t) {
        function a(e) {
            var t = 1 == e ? l : d;
            p.stop().animate({
                path: t
            }, 80, mina.easeout, function() {
                p.stop().animate({
                    path: f
                }, 500, mina.elastic, function() {})
            })
        }
        var o = $(t),
            i = o.width(),
            n = 40,
            l = 2,
            d = 38,
            s = $('<div class="bouncy ' + o.attr("id") + '" data-target="' + o.attr("id") + '" 				data-morph-up="M0 ' + Math.round(n / 2) + " Q " + Math.round(i / 2) + " " + l + " " + i + " " + Math.round(n / 2) + '" 				data-morph-down="M0 ' + Math.round(n / 2) + " Q " + Math.round(i / 2) + " " + d + " " + i + " " + Math.round(n / 2) + '">        			<svg viewBox="0 0 ' + i + " " + n + '" preserveAspectRatio="xMidYMid meet">			          <path vector-effect="non-scaling-stroke" fill="none" d="M0 ' + Math.round(n / 2) + " Q " + Math.round(i / 2) + " " + Math.round(n / 2) + " " + i + " " + Math.round(n / 2) + '"/>			        </svg>			      </div>');
        s.insertAfter(o), o.addClass("Form__input_bouncy");
        var r = s.data("target"),
            c = $("#" + r),
            u = Snap(".bouncy." + r + " svg"),
            p = u.select("path"),
            f = p.attr("d"),
            l = s.data("morph-up"),
            d = s.data("morph-down"),
            v = !1;
        c.focus(function() {
            s.addClass("focus")
        }), c.blur(function() {
            s.removeClass("focus")
        }), c.keypress(function() {
            v || a(2), v = !0
        }), c.keyup(function() {
            v = !1
        })
    }))
}), $(function() {
    $(".carousel").flickity({
        imagesLoaded: !0,
        lazyLoad: 1
    })
}), $(function() {
    var e = $(".Home__hero__video");
    if (isMobile.any) return e.children("video").remove(), void e.append($('<img src="" />'));
    var t = e.children(".Hero__video__play");
    t.length && (t.on("playing", function() {
        $(this).next().attr("preload", "auto")
    }), t.on("ended", function() {
        $(this).hide().next().show()[0].play()
    })[0].play())
}), !isMobile.any && UA.isSafari() && ! function() {
    document.body.classList.add("isSafari");
    var e = $(".Home__section--case-studies");
    e.find(".Gallery__slide--envisage").attr("data-color", "#79AD71"), e.find(".Gallery__slide--hardcandy").attr("data-color", "#B73A30"), e.find(".Gallery__slide--tripixy").attr("data-color", "#6FC9F3")
}();
var navigation = document.querySelector(".Nav"),
    hamburger = navigation.querySelector(".Nav__hamburger"),
    items = navigation.querySelector(".Nav__items"),
    html = document.querySelector("html");
hamburger.addEventListener("click", function(e) {
    e.preventDefault(), console.log("Navigation opened"), navigation.classList.toggle("Nav--open"), navigation.classList.contains("Nav--open") ? setTimeout(function() {
        html.classList.add("noscroll"), $(navigation).scrollTop(0)
    }, 300) : html.classList.remove("noscroll")
});
var $sections = $(".FullPage > .FullPage__section"),
    $case_studies = $(".Home__section--case-studies"),
    $next = $(".Home__next").click(function() {
        $(this).hasClass("Home__next--up") ? $.fn.fullpage.moveTo(1) : $.fn.fullpage.moveSectionDown()
    });
if ($sections.length) {
    var $slides = $sections.find(".Gallery__slide");
    $slides.each(function() {
        var e = $(this),
            t = e.attr("data-category").toLowerCase(),
            a = e.attr("data-name").toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-"),
            o = "homepage/" + t + "/" + a,
            i = e.find(".Gallery__slide__media");
        if (isMobile.any) {
            var n = ImageFactory(o, "Gallery__video");
            i.append(n)
        } else {
            var l = VideoFactory(o, "Gallery__video"),
                d = l.$play,
                s = l.$loop,
                n = l.$image;
            d.on("playing", function() {
                console.log("playin"), s.attr("preload", "auto")
            }).on("ended", function() {
                $(this).hide().next().show()[0].play()
            }), i.prepend(s), i.prepend(d)
        }
    })
}
$(".FullPage").fullpage({
    sectionSelector: ".FullPage__section",
    slideSelector: ".Gallery__slide",
    fitToSection: !1,
    autoScrolling: !0,
    slidesNavigation: !0,
    slidesNavPosition: "bottom",
    onLeave: function(e, t, a) {
        if (e !== t) {
            var o = getSlides(e);
            if (o.length && spindownSlides(e, o.filter(".active").index()), 1 === t) {
                var i = $(".Hero__video video:visible");
                i.length && i[0].play()
            }
            t === $sections.length ? $next.addClass("Home__next--up") : $next.removeClass("Home__next--up")
        }
    },
    afterLoad: function(e, t) {
        console.log("afterLoad");
        var a = getSlides(t);
        a.length && kickoffSlides(t, a.filter(".active").index()), !isMobile.any && t + 1 <= $sections.length && preloadVideo(t + 1)
    },
    onSlideLeave: function(e, t, a, o, i) {
        console.log("onSlideLeave"), setSlideColour(t, i), spindownSlides(t, a)
    },
    afterSlideLoad: function(e, t, a, o) {
        startSlideVideo(t, o)
    }
}), $.fn.videoFallback = function() {
    if (this.length) {
        var e = this.attr("data-filename"),
            t = VideoFactory(e, "Hero__video"),
            a = t.$play,
            o = t.$loop,
            i = t.$image;
        a.attr("preload", "auto");
        var n = this;
        return isMobile.any ? $(this).addClass("Hero__video--loaded").append(i) : ($(this).append(a.on("canplaythrough", function() {
            console.log("canplaythrough"), n.addClass("Hero__video--loaded"), $(this)[0].play(), $(this).next().attr("preload", "auto")
        }).on("ended", function() {
            $(this).hide().next().show()[0].play()
        })), $(this).append(o)), this
    }
}, $(function() {
    $(".Hero__video[data-filename]").videoFallback()
}), $(function() {
    var e = [];
    $("[data-video]").each(function(t) {
        var a = this,
            o = VideoFactory($(this).attr("data-video"), "Detail__video"),
            i = o.$play,
            n = o.$loop,
            l = o.$image;
        if (isMobile.any) return void $(a).addClass("data-video-static").append(l);
        var d = !("false" === $(this).attr("data-loop"));
        i.attr("preload", "metadata").on("playing", function() {
            d && n.attr("preload", "auto")
        }), $(this).append(i), d && ($(this).append(n), i.on("ended", function() {
            $(this).hide().next().show()[0].play()
        }));
        var s = new Waypoint.Inview({
            element: $(this)[0],
            enabled: !1,
            offset: "85%",
            enter: function(e) {
                console.log("Enter: " + e)
            },
            entered: function(e) {
                console.log("Entered: " + e), i[0].play()
            },
            exited: function(e) {
                console.log("Exited: " + e)
            }
        });
        e.push(s)
    }), $(window).load(function() {
        setTimeout(function() {
            e.forEach(function(e) {
                e.enable()
            })
        }, 250)
    })
});