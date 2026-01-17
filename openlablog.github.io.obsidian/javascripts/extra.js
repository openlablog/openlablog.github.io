// A标签外部链接自动加上target = "_blank"
var all_a = document.getElementsByTagName("a");
for (var i = 0; i < all_a.length; i++) {
    if (all_a[i].href.indexOf('http://') === 0 || all_a[i].href.indexOf('https://') === 0) {
        var a_domain = all_a[i].href.split("/");
        if (a_domain[2] != location.host && "www." + a_domain[2] != location.host) {
            all_a[i].target = "_blank";
        }
    }
}
