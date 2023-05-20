/**
 * Menu
 */
$("a.menu-icon").on("click", function (event) {
  var w = $(".menu");

  w.css({
    display: w.css("display") === "none"
      ? "block"
      : "none"
  });
});

/**
 * Wechat widget
 */
function moveWidget(event) {
  var w = $("#wechat-widget");

  w.css({
    left: event.pageX - 25,
    top: event.pageY - w.height() - 60
  });
}

$("a#wechat-link").on("mouseenter", function (event) {
  $("#wechat-widget").css({ display: "block" });
  moveWidget(event);
});

$("a#wechat-link").on("mousemove", function (event) {
  moveWidget(event);
});

$("a#wechat-link").on("mouseleave", function (event) {
  $("#wechat-widget").css({ display: "none" });
});

$(document).ready(function () {
  var id = setInterval(fixCount, 100);
  var site_pv = parseInt('{{ site.analytics.busunzi.site_pv }}')
  var site_uv = parseInt('{{ site.analytics.busunzi.site_uv }}')
  var page_pv = parseInt('{{ site.analytics.busunzi.page_pv }}')
  function fixCount() {
    if ($("#busuanzi_container_site_pv").css("display") != "none") {
      clearInterval(id);
      $("#busuanzi_value_site_pv").html(parseInt($("#busuanzi_value_site_pv").html()) + site_pv)
      $("#busuanzi_value_site_uv").html(parseInt($("#busuanzi_value_site_uv").html()) + site_uv)
      $("#busuanzi_value_page_pv").html(parseInt($("#busuanzi_value_page_pv").html()) + page_pv)
    }
  }
});