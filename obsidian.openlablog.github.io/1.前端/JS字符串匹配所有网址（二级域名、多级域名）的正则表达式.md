亲测可用，适应所有情况：

```javascript
str = str.replace(/(http:\/\/|https:\/\/|[A-Za-z0-9]+[\-]?[A-Za-z0-9]+\.|[A-Za-z0-9]+\.)((\w|=|\?|\.|\/|&|-)*)/g, '<a onclick="alert(\'$1$2\')">$1$2</a>');
```
