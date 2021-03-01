jinrishici.load(function (result) {
    if (result.status === "success") {
        var poem = document.querySelector("#poem");
        poem.innerHTML = '';
        var title = document.createElement("p");
        var author = document.createElement("p");
        author.style = "text-indent:2em;font-size:14px;color:gray";
        var content = document.createElement("p");
        title.innerHTML = '<b>' + result.data.origin.title + '<b>';
        author.innerHTML = '—— ' + result.data.origin.author + '【' + result.data.origin.dynasty + '】';
        for (var i = 0; i < result.data.origin.content.length; i++) {
            content.innerHTML += result.data.origin.content[i] + '<br>';
        }
        poem.appendChild(title);
        poem.appendChild(author);
        poem.appendChild(content);
    }
});