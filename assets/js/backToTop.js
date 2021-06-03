window.onload = function () {
    var backToTop = document.getElementById("back-to-top");
    //文档高度
    var clientHeight = document.documentElement.clientHeight;
    var time = null;
    var isTop = true;
    var cancelScroll = false;

    window.onscroll = function () {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (osTop >= clientHeight) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
        if (!isTop) {
            clearInterval(time);
        }
        isTop = false;
    }

    backToTop.onclick = function () {
        //点击事件
        if (cancelScroll == false) {
            time = setInterval(function () {
                var osTop = document.documentElement.scrollTop || document.body.scrollTop;
                // 这样子动画会越来越慢
                var speed = Math.floor(-osTop / 5);
                document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
                isTop = true;
                if (osTop == 0) {
                    clearInterval(time);
                }
            }, 10);
        } else {
            clearInterval(time);
            cancelScroll = true;
        }
    }
}