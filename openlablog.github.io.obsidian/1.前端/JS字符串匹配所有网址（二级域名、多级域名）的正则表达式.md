---
created: 2026-01-08 15:31:15
modified: 2026-01-13 15:27:02
---

亲测可用，适应所有情况：

```javascript
str = str.replace(/(http:\/\/|https:\/\/|[A-Za-z0-9]+[\-]?[A-Za-z0-9]+\.|[A-Za-z0-9]+\.)((\w|=|\?|\.|\/|&|-)*)/g, '<a onclick="alert(\'$1$2\')">$1$2</a>');
```
